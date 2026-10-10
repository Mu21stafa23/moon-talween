import { mandalaBands } from './mandala.js'
import { around, f, kite, petal, polar, ring } from './shapes.js'

// Color by number: a plain mandala where every shape carries the number of its color.

const colors = [
  { ar: 'أحمر', en: 'red' },
  { ar: 'أصفر', en: 'yellow' },
  { ar: 'أزرق', en: 'blue' },
  { ar: 'أخضر', en: 'green' },
  { ar: 'برتقالي', en: 'orange' },
  { ar: 'بنفسجي', en: 'purple' },
]

export function numbersArt(seed, level, lang) {
  const { bands, inner } = mandalaBands(seed + 500, level, true)
  const parts = [ring(95), ring(89)]
  const labels = []
  bands.forEach((band, index) => {
    const shape = band.kind === 'kite' ? kite : petal
    parts.push(around(band.shapes, shape(band.bottom, band.top, band.width), band.offset))
    // Only the outer part of a shape shows, the rest is under the next band: the number goes there, upright.
    const size = Math.min(8, band.width * 0.8, band.height * 0.42)
    const at = band.top - band.height * (band.kind === 'kite' ? 0.56 : 0.5)
    for (let each = 0; each < band.shapes; each += 1) {
      const [x, y] = polar(at, band.offset + (each * 360) / band.shapes)
      labels.push(`<text class="s" x="${x}" y="${f(y + size * 0.36)}" font-size="${f(size)}">${index + 1}</text>`)
    }
  })
  parts.push(ring(inner), `<text class="s" x="100" y="${f(100 + 2.6)}" font-size="7">${bands.length + 1}</text>`)
  // The key: a small box for each number, with the name of its color.
  const count = bands.length + 1
  const perRow = count > 3 ? Math.ceil(count / 2) : count
  const key = []
  for (let index = 0; index < count; index += 1) {
    const row = Math.floor(index / perRow)
    const inRow = Math.min(perRow, count - row * perRow)
    const column = index % perRow
    const step = 180 / inRow
    const middle = 10 + step * (lang === 'ar' ? inRow - 1 - column + 0.5 : column + 0.5)
    const y = 204 + row * 22
    const boxX = lang === 'ar' ? middle + step * 0.5 - 20 : middle - step * 0.5 + 6
    const textX = lang === 'ar' ? boxX - (step - 28) / 2 - 2 : boxX + 14 + (step - 28) / 2 + 2
    key.push(`<rect x="${f(boxX)}" y="${y}" width="14" height="14" rx="3"/><text class="s" x="${f(boxX + 7)}" y="${y + 10.5}" font-size="8.5">${index + 1}</text><text class="s" x="${f(textX)}" y="${y + 10.5}" font-size="9">${colors[index % colors.length][lang]}</text>`)
  }
  return { box: [200, 204 + Math.ceil(count / perRow) * 22], art: parts.join('') + labels.join('') + key.join('') }
}
