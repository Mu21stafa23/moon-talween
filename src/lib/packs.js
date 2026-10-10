// Books that are ready to print with one press.

import { handGroups } from '../drawings/base.js'
import { arabic, numbers } from '../drawings/letters.js'
import { featuredPatterns } from '../makers/index.js'

const group = (id) => handGroups.find((item) => item.id === id).items.map((item) => item.id)

export const packs = [
  { id: 'animals', name: { ar: 'كتاب الحيوانات', en: 'The animals book' }, cover: 'lion', refs: group('animals') },
  { id: 'heroes', name: { ar: 'كتاب الأبطال', en: 'The heroes book' }, cover: 'hero', refs: group('characters') },
  { id: 'local', name: { ar: 'كتاب من بلادنا', en: 'From our country' }, cover: 'camel', refs: group('local') },
  { id: 'eid', name: { ar: 'كتاب العيد ورمضان', en: 'Eid and Ramadan' }, cover: 'lantern', refs: ['lantern', 'hilal', 'mosque', 'gift', 'cake', 'balloons'] },
  { id: 'travel', name: { ar: 'كتاب البحر والفضاء', en: 'Sea and space' }, cover: 'rocket', refs: [...group('sea'), ...group('space'), ...group('vehicles')] },
  { id: 'letters', name: { ar: 'كتاب الحروف العربية', en: 'Arabic letters' }, cover: 'ar-2', refs: arabic.map((item) => item.id) },
  { id: 'numbers', name: { ar: 'كتاب الأرقام', en: 'Numbers' }, cover: 'n-5', refs: numbers.map((item) => item.id) },
  { id: 'patterns', name: { ar: 'كتاب الزخارف', en: 'Mandalas and patterns' }, cover: 'mandala-3-2', refs: featuredPatterns },
]

/** Eight drawings picked at random from those that suit the given ages. */
export function surprise(pool, random = Math.random) {
  const left = [...pool]
  const chosen = []
  while (chosen.length < 8 && left.length > 0) chosen.push(left.splice(Math.floor(random() * left.length), 1)[0])
  return chosen
}
