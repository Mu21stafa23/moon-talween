import { around, dot, kite, petal, pick, randomFrom, ring } from './shapes.js'

// A mandala is built from the rim inwards. Each band is a ring of one shape repeated around
// the centre. A band reaches well under the next one, and inner bands are drawn later, so
// they sit on top like the layers of a flower.

/**
 * The bands of a mandala, as plain data, so that other makers (color by number) can use
 * the same layout. `level` is 1 (large shapes) to 3 (fine detail).
 */
export function mandalaBands(seed, level, plain = false) {
  const random = randomFrom(seed * 7919 + level)
  const fold = pick(random, level === 1 ? [8] : level === 2 ? [10, 12] : [12, 16])
  const count = level === 1 ? 3 : level === 2 ? 4 : pick(random, [5, 6])
  const outer = 86
  const inner = level === 1 ? 14 : 11
  const height = (outer - inner) / count
  const bands = []
  let last = ''
  for (let index = 0; index < count; index += 1) {
    let kind = pick(random, ['petal', 'petal', 'petal', 'kite', 'kite', 'beads'])
    // Two bands of beads in a row, or beads at the rim or the centre, look empty.
    if (kind === 'beads' && (plain || last === 'beads' || index === 0 || index === count - 1)) kind = 'petal'
    if (kind === 'kite' && last === 'kite') kind = 'petal'
    last = kind
    const top = outer - index * height
    const isLast = index === count - 1
    const reach = kind === 'beads' ? 1 : isLast ? 1.05 : pick(random, [1.5, 1.7, 1.9])
    const bottom = Math.max(inner - 3, top - height * reach)
    // Towards the centre there is less room, so the innermost bands use half as many shapes.
    const shapes = fold >= 12 && index >= count - 2 ? fold / 2 : fold
    const room = (2 * Math.PI * ((top + bottom) / 2)) / shapes
    bands.push({
      kind,
      shapes,
      top,
      bottom,
      height,
      width: room * (kind === 'kite' ? 0.34 : 0.52),
      offset: index % 2 === 1 ? 180 / shapes : 0,
      detail: plain ? 'none' : pick(random, level === 1 ? ['none', 'inner', 'dot'] : ['inner', 'inner', 'dot', 'none']),
      beads: !plain && level > 1 && random() < 0.55,
      edge: !isLast && random() < (level === 1 ? 0.35 : 0.5),
    })
  }
  return { fold, bands, inner, level, heart: pick(random, ['flower', 'rings']) }
}

export function mandalaArt(seed, level) {
  const { fold, bands, inner, heart } = mandalaBands(seed, level)
  const parts = [ring(95), ring(89)]
  if (level > 1) parts.push(around(fold * 2, dot(92, 1.7), 180 / (fold * 2)))
  for (const band of bands) {
    const long = band.top - band.bottom
    if (band.kind === 'beads') {
      const middle = band.top - band.height / 2
      parts.push(ring(middle + band.height * 0.42), ring(middle - band.height * 0.42), around(band.shapes * 2, dot(middle, Math.min(band.height * 0.3, (Math.PI * middle) / (band.shapes * 2) * 0.7)), band.offset))
      continue
    }
    const shape = band.kind === 'kite' ? kite : petal
    parts.push(around(band.shapes, shape(band.bottom, band.top, band.width), band.offset))
    // A smaller copy inside each shape, or a dot near its tip, where there is room.
    const tip = band.top - band.height * 0.5
    if (band.detail === 'inner' && band.height > 9) parts.push(around(band.shapes, shape(band.top - band.height * 0.95, band.top - band.height * 0.18, band.width * 0.42), band.offset))
    else if (band.detail === 'dot' && band.height > 8) parts.push(around(band.shapes, dot(tip, Math.max(1.5, Math.min(band.height * 0.14, band.width * 0.22))), band.offset))
    if (band.beads) parts.push(around(band.shapes, dot(band.top - band.height * 0.1, Math.max(1.4, Math.min(2.6, band.width * 0.12))), band.offset + 180 / band.shapes))
    if (band.edge) parts.push(ring(band.top - band.height * 1.02))
    else if (long <= band.height * 1.1) parts.push(ring(band.bottom + 0.5))
  }
  parts.push(ring(inner))
  if (heart === 'flower') parts.push(around(6, petal(2.5, inner - 1.5, inner * 0.3)), ring(2.5))
  else parts.push(ring(inner * 0.55), ring(inner * 0.2))
  return parts.join('')
}

// The outline has to get thinner as the shapes get smaller.
export const mandalaWeight = { 1: 0.75, 2: 0.5, 3: 0.38 }
