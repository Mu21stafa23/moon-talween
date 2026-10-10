// Turns a plan into paper: straight to the printer, or as a PDF file.

import { POINTS_PER_MM } from './paper.js'
import { buildPdf } from './pdf.js'
import { fontsReady, renderPage } from './render.js'

const PRINT_DPI = 200

const toBlob = (canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))

/** Every page of a plan as a JPEG, drawn at print quality. */
async function pictures(thePlan, options) {
  await fontsReady(options.sample)
  const result = []
  for (const page of thePlan.pages) {
    const canvas = renderPage(page, { ...options, dpi: PRINT_DPI })
    const blob = await toBlob(canvas)
    result.push({ blob, page, pixelWidth: canvas.width, pixelHeight: canvas.height })
    // Let the browser breathe between pages, so the screen does not freeze on a long book.
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  return result
}

export async function makePdf(thePlan, options) {
  const pages = await pictures(thePlan, options)
  const parts = []
  for (const { blob, page, pixelWidth, pixelHeight } of pages) {
    parts.push({ jpeg: new Uint8Array(await blob.arrayBuffer()), pixelWidth, pixelHeight, width: page.width * POINTS_PER_MM, height: page.height * POINTS_PER_MM })
  }
  return new Blob([buildPdf(parts)], { type: 'application/pdf' })
}

export function saveFile(blob, name) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

/**
 * Prints the pages. They are put in the document as pictures that only the printer sees,
 * with the paper size set to match, then the browser's own print window is opened.
 */
export async function printPlan(thePlan, options) {
  const pages = await pictures(thePlan, options)
  const { width, height } = thePlan.pages[0]
  document.getElementById('print-root')?.remove()
  const root = document.createElement('div')
  root.id = 'print-root'
  const style = document.createElement('style')
  style.textContent = `@page { size: ${width}mm ${height}mm; margin: 0; }
@media screen { #print-root { display: none; } }
@media print {
  body > *:not(#print-root) { display: none !important; }
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  #print-root img { display: block; width: ${width}mm; height: ${height}mm; break-after: page; page-break-after: always; }
  #print-root img:last-child { break-after: auto; page-break-after: auto; }
}`
  root.appendChild(style)
  const urls = []
  for (const { blob } of pages) {
    const image = new Image()
    const url = URL.createObjectURL(blob)
    urls.push(url)
    image.src = url
    image.alt = ''
    root.appendChild(image)
    await image.decode().catch(() => {})
  }
  document.body.appendChild(root)
  const clean = () => {
    root.remove()
    urls.forEach((url) => URL.revokeObjectURL(url))
    window.removeEventListener('afterprint', clean)
  }
  window.addEventListener('afterprint', clean)
  window.print()
}
