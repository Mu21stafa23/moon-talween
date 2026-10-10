import { featuredPatterns, makeItem } from '../makers/index.js'
import { handGroups } from './base.js'
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

// Only what the gallery shows can be opened by its id. Drawings kept just to illustrate a word are left out.
const stored = new Map(drawings.filter((item) => item.group !== 'patterns').map((item) => [item.id, item]))

/** A drawing or made page by its reference. */
export function drawingById(id) {
  return stored.get(id) ?? makeItem(id)
}
