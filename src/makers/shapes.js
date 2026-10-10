// Small helpers shared by the drawings that are made by rules instead of by hand.

export const CENTER = 100

/** Two decimals are plenty for a 200 by 200 box, and keep the markup short. */
export const f = (value) => Math.round(value * 100) / 100

/** A repeatable random number source: the same seed always gives the same drawing. */
export function randomFrom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const pick = (random, list) => list[Math.floor(random() * list.length)]

/** One shape repeated `count` times around the centre. */
export const around = (count, shape, offset = 0) =>
  Array.from({ length: count }, (_, index) => `<g transform="rotate(${f(offset + (index * 360) / count)} ${CENTER} ${CENTER})">${shape}</g>`).join('')

/** A rounded petal pointing up, from radius `inner` to radius `outer`. */
export function petal(inner, outer, width) {
  const y1 = CENTER - inner
  const y2 = CENTER - outer
  const long = outer - inner
  const belly = y1 - long * 0.45
  return `<path d="M${CENTER} ${f(y1)}C${f(CENTER - width)} ${f(belly)} ${f(CENTER - width * 0.7)} ${f(y2 + long * 0.18)} ${CENTER} ${f(y2)}C${f(CENTER + width * 0.7)} ${f(y2 + long * 0.18)} ${f(CENTER + width)} ${f(belly)} ${CENTER} ${f(y1)}z"/>`
}

/** A pointed leaf with four corners. */
export function kite(inner, outer, width, belly = 0.45) {
  const y1 = CENTER - inner
  const y2 = CENTER - outer
  const middle = y1 - (outer - inner) * belly
  return `<path d="M${CENTER} ${f(y1)}L${f(CENTER - width)} ${f(middle)}L${CENTER} ${f(y2)}L${f(CENTER + width)} ${f(middle)}z"/>`
}

export const dot = (radius, size) => `<circle cx="${CENTER}" cy="${f(CENTER - radius)}" r="${f(size)}"/>`

export const ring = (radius) => `<circle cx="${CENTER}" cy="${CENTER}" r="${f(radius)}"/>`

/** The corners of a star: `points` tips at `outer`, the notches between them at `inner`. */
export function starPath(cx, cy, points, outer, inner, turn = 0) {
  const corners = Array.from({ length: points * 2 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner
    const angle = turn + (index * Math.PI) / points
    return `${f(cx + radius * Math.sin(angle))} ${f(cy - radius * Math.cos(angle))}`
  })
  return `M${corners.join('L')}z`
}

/** A point at `radius` from the centre, `degrees` clockwise from straight up. */
export function polar(radius, degrees) {
  const angle = (degrees * Math.PI) / 180
  return [f(CENTER + radius * Math.sin(angle)), f(CENTER - radius * Math.cos(angle))]
}
