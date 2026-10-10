import { featuredPatterns, makeItem } from '../makers/index.js'
import { handDrawing, handGroups } from './base.js'
import { arabic, english, numbers } from './letters.js'

// Everything the gallery shows: the hand-made drawings, a set of chosen mandalas and
// patterns, and a page for every letter and number.
export const groups = [
  ...handGroups,
  { id: 'patterns', name: { ar: 'زخارف وماندالا', en: 'Mandalas and patterns' }, items: featuredPatterns.map(makeItem) },
  { id: 'arabic', name: { ar: 'حروف عربية', en: 'Arabic letters' }, items: arabic },
  { id: 'english', name: { ar: 'حروف إنجليزية', en: 'English letters' }, items: english },
  { id: 'numbers', name: { ar: 'أرقام', en: 'Numbers' }, items: numbers },
]

export const drawings = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.id })))

const letterIndex = new Map([...arabic, ...english, ...numbers].map((item) => [item.id, item]))

/** A drawing or made page by its reference. */
export function drawingById(id) {
  const stored = handDrawing(id) ?? letterIndex.get(id)
  if (stored) return { ...stored, group: stored.group ?? groups.find((group) => group.items.includes(stored))?.id }
  return makeItem(id)
}
