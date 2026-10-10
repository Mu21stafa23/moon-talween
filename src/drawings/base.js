import animals from './animals.js'
import characters from './characters.js'
import local from './local.js'
import nature from './nature.js'
import objects from './objects.js'
import occasions from './occasions.js'
import sea from './sea.js'
import space from './space.js'
import vehicles from './vehicles.js'

// The drawings made by hand. Every one sits in a 200 by 200 box.
// See characters.js for how a drawing is written.
export const handGroups = [
  { id: 'characters', name: { ar: 'شخصيات', en: 'Characters' }, items: characters },
  { id: 'animals', name: { ar: 'حيوانات', en: 'Animals' }, items: animals },
  { id: 'sea', name: { ar: 'البحر', en: 'Sea' }, items: sea },
  { id: 'nature', name: { ar: 'الطبيعة والبيت', en: 'Nature and home' }, items: nature },
  { id: 'vehicles', name: { ar: 'مركبات', en: 'Vehicles' }, items: vehicles },
  { id: 'space', name: { ar: 'الفضاء', en: 'Space' }, items: space },
  { id: 'local', name: { ar: 'من بلادنا', en: 'From our country' }, items: local },
  { id: 'occasions', name: { ar: 'مناسبات', en: 'Occasions' }, items: occasions },
  { id: 'objects', name: { ar: 'للكبار', en: 'For older children' }, items: objects },
]

const index = new Map(handGroups.flatMap((group) => group.items.map((item) => [item.id, item])))

export const handDrawing = (id) => index.get(id)
