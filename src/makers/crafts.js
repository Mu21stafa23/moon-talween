import { handDrawing } from '../drawings/base.js'
import { starPath } from './shapes.js'

// Things to print, color and then cut or fold: a certificate, a door sign, greeting cards,
// bookmarks and masks. Each is a whole sheet, so its box has the shape of the paper.

const sizeFor = (text, sizes) => sizes[Math.min(sizes.length - 1, Math.max(0, Math.ceil(text.length / 4) - 1))]
const star = (x, y, radius) => `<path d="${starPath(x, y, 5, radius, radius * 0.45)}"/>`

export function certificate(name, lang) {
  const ar = lang === 'ar'
  const who = name
    ? `<text class="n" x="140" y="${118 + sizeFor(name, [34, 30, 24, 18, 15]) * 0.1}" font-size="${sizeFor(name, [34, 30, 24, 18, 15])}">${name}</text>`
    : '<path class="g" d="M70 118H210"/>'
  return `<rect x="8" y="8" width="264" height="184" rx="10"/><rect x="16" y="16" width="248" height="168" rx="6"/>${star(34, 34, 9)}${star(246, 34, 9)}${star(34, 166, 9)}${star(246, 166, 9)}
<text class="n" x="140" y="58" font-size="26">${ar ? 'شهادة تقدير' : 'Certificate'}</text>
<text class="s" x="140" y="78" font-size="9.5">${ar ? 'تُمنح هذه الشهادة إلى' : 'awarded to the young artist'}</text>${who}
<text class="s" x="140" y="138" font-size="9.5">${ar ? 'تقديراً للتلوين بإتقان وصبر' : 'for coloring with care and patience'}</text>
<path d="M128 168l-8 20l12-5l8 9z"/><path d="M152 168l8 20l-12-5l-8 9z"/><circle cx="140" cy="160" r="15"/>${star(140, 160, 8)}
<text class="m" x="74" y="168" font-size="7.5">${ar ? 'التاريخ' : 'Date'}</text><path class="g" d="M46 178h56"/>
<text class="m" x="206" y="168" font-size="7.5">${ar ? 'التوقيع' : 'Signed'}</text><path class="g" d="M178 178h56"/>`
}

export function doorSign(name, lang) {
  const ar = lang === 'ar'
  const first = name ? (ar ? 'غرفة' : `${name}’s`) : ar ? 'غرفتي' : 'My room'
  const second = name ? (ar ? name : 'room') : ''
  const firstSize = sizeFor(first, [46, 40, 32, 24, 20])
  const secondSize = sizeFor(second, [58, 50, 38, 28, 22])
  const lines = second
    ? `<text x="140" y="88" font-size="${firstSize}">${first}</text><text x="140" y="${150 + secondSize * 0.08}" font-size="${secondSize}">${second}</text>`
    : `<text x="140" y="122" font-size="54">${first}</text>`
  return `<rect x="8" y="8" width="264" height="184" rx="22"/><rect x="18" y="18" width="244" height="164" rx="14"/><circle cx="44" cy="36" r="6"/><circle cx="236" cy="36" r="6"/>${lines}
${star(46, 150, 12)}${star(236, 96, 10)}${star(60, 76, 7)}<path d="M226 138a16 16 0 1 0 14 26a13 13 0 0 1-14-26z"/><circle cx="212" cy="60" r="4"/><circle cx="78" cy="168" r="4"/>`
}

const cards = {
  eid: { drawing: 'lantern', words: { ar: 'عيد مبارك', en: 'Eid Mubarak' }, name: { ar: 'بطاقة العيد', en: 'Eid card' } },
  birthday: { drawing: 'cake', words: { ar: 'عيد ميلاد سعيد', en: 'Happy birthday' }, name: { ar: 'بطاقة عيد ميلاد', en: 'Birthday card' } },
  thanks: { drawing: 'balloons', words: { ar: 'شكراً', en: 'Thank you' }, name: { ar: 'بطاقة شكر', en: 'Thank-you card' } },
  mum: { drawing: 'flower', words: { ar: 'أحبك يا أمي', en: 'I love you, Mum' }, name: { ar: 'بطاقة لأمي', en: 'Card for Mum' } },
}
export const cardKinds = Object.keys(cards)
export const cardName = (kind) => cards[kind]?.name

/** A sheet folded in half down the middle. The front is the half that ends up facing the reader. */
export function card(kind, lang) {
  const { drawing, words } = cards[kind]
  const ar = lang === 'ar'
  // An Arabic card opens from the left, like an Arabic book, so its front is the left half.
  const front = ar ? 70 : 210
  const back = ar ? 210 : 70
  const text = words[lang]
  return `<path class="c" d="M140 4V196"/><rect x="${front - 60}" y="12" width="120" height="176" rx="10"/>
<text class="n" x="${front}" y="${52}" font-size="${sizeFor(text, [26, 24, 19, 15, 13])}">${text}</text>
<g transform="translate(${front - 48} 68) scale(0.48)">${handDrawing(drawing).art}</g>${star(front - 44, 174, 6)}${star(front + 44, 174, 6)}${star(front, 176, 5)}
<text class="m" x="${back}" y="170" font-size="8">${ar ? 'صُنعت بيد:' : 'Made by:'}</text><path class="g" d="M${back - 36} 184h72"/>`
}

const bookmarkSets = {
  animals: { name: { ar: 'فواصل كتب: حيوانات', en: 'Bookmarks: animals' }, strips: [['cat', 'rabbit', 'lion'], ['dog', 'owl', 'turtle'], ['butterfly', 'duck', 'elephant'], ['fish', 'whale', 'crab']] },
  heroes: { name: { ar: 'فواصل كتب: أبطال وفضاء', en: 'Bookmarks: heroes and space' }, strips: [['rocket', 'planet', 'ufo'], ['astronaut', 'zuzu', 'robot'], ['hero', 'bolt', 'heroine'], ['dragon', 'monster', 'ninja']] },
}
export const bookmarkKinds = Object.keys(bookmarkSets)
export const bookmarkName = (kind) => bookmarkSets[kind]?.name

/** Four strips to color and cut out, each with a hole for a ribbon. */
export function bookmarks(kind) {
  return bookmarkSets[kind].strips
    .map((strip, index) => {
      const x = 10 + index * 47
      const middle = x + 19.5
      const pictures = strip.map((id, row) => `<g transform="translate(${x + 1.5} ${46 + row * 70}) scale(0.18)">${handDrawing(id).art}</g>`).join('')
      const gaps = [106, 176].map((y) => `<path d="M${middle} ${y - 5}l5 5l-5 5l-5-5z"/><path class="o" d="M${x + 5} ${y}h8M${x + 26} ${y}h8"/>`).join('')
      return `<rect x="${x}" y="10" width="39" height="260" rx="12"/><circle cx="${middle}" cy="27" r="5"/>${pictures}${gaps}${star(middle, 254, 6)}`
    })
    .join('')
}

// Only drawings that are a face on their own.
export const maskKinds = ['cat', 'dog', 'rabbit', 'lion']

/** A face that fills the sheet, with a tab on each side to tie a string to. */
export function mask(id, lang) {
  return `<rect x="16" y="98" width="70" height="24" rx="12"/><rect x="194" y="98" width="70" height="24" rx="12"/><circle cx="29" cy="110" r="4.5"/><circle cx="251" cy="110" r="4.5"/>
<g transform="translate(40 0)">${handDrawing(id).art}</g>
<text class="m" x="140" y="196" font-size="6.5">${lang === 'ar' ? 'لوّن، قصّ حول الوجه، اثقب مكان العينين، واربط خيطاً في الدائرتين.' : 'Color, cut around the face, make holes for the eyes, and tie a string to the two circles.'}</text>`
}
