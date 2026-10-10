import { f, pick, randomFrom, starPath } from './shapes.js'

// A maze with exactly one way through, carved by walking at random and backing up at dead ends.

const sizes = { 1: [7, 9], 2: [11, 14], 3: [16, 21] }
export const mazeWeight = { 1: 0.85, 2: 0.6, 3: 0.42 }

/** Which walls are left standing: for each cell, the one on its right and the one below it. */
export function carve(seed, level) {
  const [columns, rows] = sizes[level] ?? sizes[2]
  const random = randomFrom(seed * 104729 + level)
  const right = Array.from({ length: rows }, () => Array(columns).fill(true))
  const below = Array.from({ length: rows }, () => Array(columns).fill(true))
  const seen = Array.from({ length: rows }, () => Array(columns).fill(false))
  const stack = [[0, 0]]
  seen[0][0] = true
  while (stack.length > 0) {
    const [row, column] = stack[stack.length - 1]
    const next = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ].filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < columns && !seen[r][c])
    if (next.length === 0) {
      stack.pop()
      continue
    }
    const [r, c] = pick(random, next)
    if (r === row) right[row][Math.min(c, column)] = false
    else below[Math.min(r, row)][column] = false
    seen[r][c] = true
    stack.push([r, c])
  }
  return { columns, rows, right, below }
}

export function mazeArt(seed, level) {
  const { columns, rows, right, below } = carve(seed, level)

  const cell = 180 / columns
  const left = 10
  const top = 22
  const x = (column) => f(left + column * cell)
  const y = (row) => f(top + row * cell)
  // The frame, open above the first cell and below the last one.
  let walls = `M${x(1)} ${y(0)}H${x(columns)}V${y(rows)}M${x(columns - 1)} ${y(rows)}H${x(0)}V${y(0)}`
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (right[row][column] && column < columns - 1) walls += `M${x(column + 1)} ${y(row)}V${y(row + 1)}`
      if (below[row][column] && row < rows - 1) walls += `M${x(column)} ${y(row + 1)}H${x(column + 1)}`
    }
  }
  const enter = left + cell / 2
  const leave = left + (columns - 0.5) * cell
  const end = top + rows * cell
  return {
    box: [200, f(end + 24)],
    art: `<path class="o" d="${walls}"/><path d="M${f(enter)} 17l-6-9h4V2h4v6h4z"/><path d="${starPath(leave, end + 12, 5, 9, 4)}"/>`,
  }
}
