// Writes a PDF by hand: one JPEG picture per page, at the page's real size.
// A PDF is a list of numbered objects, then a table saying where each one starts.

const encoder = new TextEncoder()

/**
 * @param {{ jpeg: Uint8Array, pixelWidth: number, pixelHeight: number, width: number, height: number }[]} pages
 *   `width` and `height` are in points (1/72 inch).
 * @returns {Uint8Array}
 */
export function buildPdf(pages) {
  const chunks = []
  const offsets = []
  let length = 0
  const push = (data) => {
    const bytes = typeof data === 'string' ? encoder.encode(data) : data
    chunks.push(bytes)
    length += bytes.length
  }
  const object = (number, body, stream) => {
    offsets[number] = length
    push(`${number} 0 obj\n${body}\n`)
    if (stream) {
      push('stream\n')
      push(stream)
      push('\nendstream\n')
    }
    push('endobj\n')
  }
  const round = (value) => Math.round(value * 100) / 100

  // Object 1 is the catalog and 2 the list of pages; each page then takes three objects.
  push('%PDF-1.4\n%âãÏÓ\n')
  const first = (index) => 3 + index * 3
  object(1, '<< /Type /Catalog /Pages 2 0 R >>')
  object(2, `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, index) => `${first(index)} 0 R`).join(' ')}] >>`)
  pages.forEach((page, index) => {
    const id = first(index)
    const width = round(page.width)
    const height = round(page.height)
    const content = encoder.encode(`q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`)
    object(id, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 ${id + 2} 0 R >> >> /Contents ${id + 1} 0 R >>`)
    object(id + 1, `<< /Length ${content.length} >>`, content)
    object(
      id + 2,
      `<< /Type /XObject /Subtype /Image /Width ${page.pixelWidth} /Height ${page.pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>`,
      page.jpeg,
    )
  })

  const total = 3 + pages.length * 3
  const start = length
  push(`xref\n0 ${total}\n0000000000 65535 f \n`)
  for (let number = 1; number < total; number += 1) push(`${String(offsets[number]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`)

  const file = new Uint8Array(length)
  let at = 0
  for (const chunk of chunks) {
    file.set(chunk, at)
    at += chunk.length
  }
  return file
}
