import { f, starPath } from './shapes.js'

// Tiled patterns in the tradition of Islamic geometric art.

/** Eight-pointed stars whose tips touch, leaving crosses between them. */
export function starAndCross() {
  const radius = 22
  const parts = ['<rect x="12" y="12" width="176" height="176" rx="4"/>']
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const x = 34 + column * 44
      const y = 34 + row * 44
      parts.push(`<path d="${starPath(x, y, 8, radius, radius * 0.7654)}"/>`, `<path d="${starPath(x, y, 4, 9, 9 * 0.92, Math.PI / 8)}"/>`, `<circle cx="${x}" cy="${y}" r="3"/>`)
    }
  }
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const x = 56 + column * 44
      const y = 56 + row * 44
      parts.push(`<path d="M${x} ${y - 7}L${x + 7} ${y}L${x} ${y + 7}L${x - 7} ${y}z"/>`)
    }
  }
  return parts.join('')
}

/** A honeycomb, each cell holding a six-pointed star. */
export function honeycombStars() {
  const side = 22
  const across = side * Math.sqrt(3)
  const parts = ['<rect x="8" y="8" width="184" height="184" rx="4"/>']
  for (let row = 0; row < 5; row += 1) {
    const columns = row % 2 === 0 ? 4 : 3
    for (let column = 0; column < columns; column += 1) {
      const x = 100 + (column - (columns - 1) / 2) * across
      const y = 100 + (row - 2) * side * 1.5
      parts.push(`<path d="${starPath(x, y, 6, side, side * 0.866, Math.PI / 6)}"/>`, `<path d="${starPath(x, y, 6, side * 0.78, side * 0.45)}"/>`, `<circle cx="${f(x)}" cy="${f(y)}" r="4"/>`)
    }
  }
  return parts.join('')
}

/** Square tiles, each with a four-pointed star and a diamond, like cut zellige. */
export function squareTiles() {
  const parts = []
  const size = 44
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const x = 12 + column * size
      const y = 12 + row * size
      const cx = x + size / 2
      const cy = y + size / 2
      parts.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}"/>`, `<path d="${starPath(cx, cy, 4, 21, 8, (row + column) % 2 === 0 ? 0 : Math.PI / 4)}"/>`, `<path d="${starPath(cx, cy, 4, 7, 7 * 0.7071, Math.PI / 4)}"/>`)
    }
  }
  return parts.join('')
}
