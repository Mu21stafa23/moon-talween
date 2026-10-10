import animals from './animals.js'
import characters from './characters.js'
import { arabic, english, numbers } from './letters.js'
import nature from './nature.js'
import sea from './sea.js'
import space from './space.js'
import vehicles from './vehicles.js'

// Every drawing sits in a 200 by 200 box. See characters.js for how a drawing is written.
export const groups = [
  { id: 'characters', name: { ar: 'شخصيات', en: 'Characters' }, items: characters },
  { id: 'animals', name: { ar: 'حيوانات', en: 'Animals' }, items: animals },
  { id: 'sea', name: { ar: 'البحر', en: 'Sea' }, items: sea },
  { id: 'nature', name: { ar: 'الطبيعة والبيت', en: 'Nature and home' }, items: nature },
  { id: 'vehicles', name: { ar: 'مركبات', en: 'Vehicles' }, items: vehicles },
  { id: 'space', name: { ar: 'الفضاء', en: 'Space' }, items: space },
  { id: 'arabic', name: { ar: 'حروف عربية', en: 'Arabic letters' }, items: arabic },
  { id: 'english', name: { ar: 'حروف إنجليزية', en: 'English letters' }, items: english },
  { id: 'numbers', name: { ar: 'أرقام', en: 'Numbers' }, items: numbers },
]

export const drawings = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.id })))

const index = new Map(drawings.map((item) => [item.id, item]))

export const drawingById = (id) => index.get(id)
