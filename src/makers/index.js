import { handDrawing } from '../drawings/base.js'
import { arabic, english, numbers } from '../drawings/letters.js'
import { bookmarkKinds, bookmarkName, bookmarks, card, cardKinds, cardName, certificate, doorSign, mask, maskKinds } from './crafts.js'
import { dotShapes, dotsArt, nameArt, traceArt, wordArt } from './learn.js'
import { mandalaArt, mandalaWeight } from './mandala.js'
import { mazeArt, mazeWeight } from './maze.js'
import { numbersArt } from './numbers.js'
import { honeycombStars, squareTiles, starAndCross } from './patterns.js'

// Pages that are made on request instead of being stored: a mandala from a number, a maze,
// a tracing sheet for a letter, a certificate with a name on it. Each has a reference such
// as "mandala-41-2" that says everything needed to make it again, so it can sit in a book,
// be remembered, and travel in a link like any other drawing.

const both = (make) => ({ ar: make('ar'), en: make('en') })
const levelNames = { 1: { ar: 'سهلة', en: 'easy' }, 2: { ar: 'متوسطة', en: 'medium' }, 3: { ar: 'دقيقة', en: 'fine' } }
const ages = { 1: [5, 9], 2: [8, 13], 3: [10, 15] }
const letters = new Map([...arabic, ...english, ...numbers].map((item) => [item.id, item]))

const patterns = {
  stars: { name: { ar: 'زخرفة النجوم الثمانية', en: 'Eight-pointed stars' }, art: starAndCross },
  honey: { name: { ar: 'زخرفة خلية النحل', en: 'Honeycomb stars' }, art: honeycombStars },
  tiles: { name: { ar: 'زخرفة البلاط', en: 'Star tiles' }, art: squareTiles },
}

// A letter, a word that starts with it, and the drawing of that word.
export const arabicWords = { 'ar-1': ['أسد', 'lion'], 'ar-2': ['بطة', 'duck'], 'ar-3': ['تنين', 'dragon'], 'ar-5': ['جمل', 'camel'], 'ar-6': ['حوت', 'whale'], 'ar-8': ['دلّة', 'dallah'], 'ar-10': ['روبوت', 'robot'], 'ar-12': ['سمكة', 'fish'], 'ar-13': ['شمس', 'sun'], 'ar-14': ['صاروخ', 'rocket'], 'ar-16': ['طائرة', 'plane'], 'ar-20': ['فيل', 'elephant'], 'ar-21': ['قطة', 'cat'], 'ar-22': ['كلب', 'dog'], 'ar-24': ['مسجد', 'mosque'], 'ar-25': ['نخلة', 'palm'], 'ar-26': ['هلال', 'hilal'], 'ar-27': ['وردة', 'flower'] }
export const englishWords = { 'en-a': ['Astronaut', 'astronaut'], 'en-b': ['Butterfly', 'butterfly'], 'en-c': ['Cat', 'cat'], 'en-d': ['Dog', 'dog'], 'en-e': ['Elephant', 'elephant'], 'en-f': ['Fish', 'fish'], 'en-g': ['Guitar', 'guitar'], 'en-h': ['House', 'house'], 'en-k': ['Knight', 'knight'], 'en-l': ['Lion', 'lion'], 'en-m': ['Mermaid', 'mermaid'], 'en-n': ['Ninja', 'ninja'], 'en-o': ['Owl', 'owl'], 'en-p': ['Princess', 'princess'], 'en-r': ['Rocket', 'rocket'], 'en-s': ['Sun', 'sun'], 'en-t': ['Turtle', 'turtle'], 'en-w': ['Whale', 'whale'] }

/** Text typed by a visitor goes into markup, so the characters that mean something there are removed. */
const clean = (text) => text.replace(/[<>&"'`~]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20)
export const nameRef = (prefix, name) => `${prefix}-${clean(name)}`

function build(ref) {
  const cut = ref.indexOf('-')
  if (cut < 0) return undefined
  const kind = ref.slice(0, cut)
  const rest = ref.slice(cut + 1)
  // "41-2" means number 41 at level 2: only digits, so a link cannot carry anything else.
  const parts = /^(\d{1,8})-(\d)$/.exec(rest)
  const seed = parts ? Number(parts[1]) : 0
  const level = parts ? Number(parts[2]) : 0
  const numbered = Boolean(parts)

  if (kind === 'mandala' && numbered && levelNames[level]) {
    return { name: { ar: `ماندالا ${levelNames[level].ar} ${seed}`, en: `Mandala ${seed} (${levelNames[level].en})` }, age: ages[level], weight: mandalaWeight[level], art: mandalaArt(seed, level), group: 'patterns' }
  }
  if (kind === 'pattern' && patterns[rest]) return { name: patterns[rest].name, age: [9, 15], weight: 0.5, art: patterns[rest].art(), group: 'patterns' }
  if (kind === 'maze' && numbered && levelNames[level]) {
    const maze = mazeArt(seed, level)
    return { name: { ar: `متاهة ${levelNames[level].ar} ${seed}`, en: `Maze ${seed} (${levelNames[level].en})` }, age: ages[level], weight: mazeWeight[level], ...maze, group: 'maze' }
  }
  if (kind === 'numbers' && numbered && (level === 1 || level === 2)) {
    const made = both((lang) => numbersArt(seed, level, lang))
    return { name: { ar: `لوّن بالأرقام ${seed}`, en: `Color by number ${seed}` }, age: level === 1 ? [5, 9] : [7, 12], weight: level === 1 ? 0.7 : 0.5, box: made.ar.box, art: { ar: made.ar.art, en: made.en.art }, group: 'numbers' }
  }
  if (kind === 'trace' && letters.has(rest)) {
    const letter = letters.get(rest)
    const made = both((lang) => traceArt(letter.text, letter.name[lang]))
    return { name: { ar: `تتبّع ${letter.name.ar}`, en: `Trace: ${letter.name.en}` }, age: [3, 7], weight: 0.7, box: made.ar.box, art: { ar: made.ar.art, en: made.en.art }, text: letter.text, group: 'trace' }
  }
  if (kind === 'word' && (arabicWords[rest] || englishWords[rest])) {
    const [word, drawing] = arabicWords[rest] ?? englishWords[rest]
    const letter = letters.get(rest)
    const glyph = rest.startsWith('en-') ? letter.text : letter.text
    return { name: { ar: `${letter.name.ar}: ${word}`, en: `${letter.name.en}: ${word}` }, age: [3, 7], weight: 0.8, ...wordArt(glyph, word, handDrawing(drawing).art), text: `${glyph}${word}`, group: 'word' }
  }
  if (kind === 'dots' && dotShapes[rest]) {
    const shape = dotShapes[rest]
    return { name: { ar: `وصّل النقاط: ${shape.name.ar}`, en: `Dot to dot: ${shape.name.en}` }, age: [4, 8], weight: 0.7, art: dotsArt(shape.points, shape.extra), group: 'dots' }
  }
  if (kind === 'name') {
    const name = clean(rest)
    if (!name || name !== rest) return undefined
    return { name: { ar: `اسم للتلوين: ${name}`, en: `Name to color: ${name}` }, age: [3, 15], art: nameArt(name), text: name, group: 'name' }
  }
  if (kind === 'cert') {
    const name = clean(rest)
    if (name !== rest) return undefined
    return { name: { ar: name ? `شهادة ${name}` : 'شهادة تقدير', en: name ? `Certificate for ${name}` : 'Certificate' }, age: [3, 15], weight: 0.6, box: [280, 200], art: both((lang) => certificate(name, lang)), text: name, sheetOnly: true, group: 'crafts' }
  }
  if (kind === 'door') {
    const name = clean(rest)
    if (name !== rest) return undefined
    return { name: { ar: name ? `لوحة غرفة ${name}` : 'لوحة باب الغرفة', en: name ? `Door sign for ${name}` : 'Door sign' }, age: [3, 15], weight: 0.7, box: [280, 200], art: both((lang) => doorSign(name, lang)), text: name, sheetOnly: true, group: 'crafts' }
  }
  if (kind === 'card' && cardKinds.includes(rest)) return { name: cardName(rest), age: [4, 12], weight: 0.7, box: [280, 200], art: both((lang) => card(rest, lang)), sheetOnly: true, group: 'crafts' }
  if (kind === 'bookmarks' && bookmarkKinds.includes(rest)) return { name: bookmarkName(rest), age: [4, 12], weight: 0.45, box: [200, 280], art: bookmarks(rest), sheetOnly: true, group: 'crafts' }
  if (kind === 'mask' && maskKinds.includes(rest)) {
    const face = handDrawing(rest)
    return { name: { ar: `قناع ${face.name.ar}`, en: `${face.name.en} mask` }, age: [3, 9], box: [280, 200], art: both((lang) => mask(rest, lang)), sheetOnly: true, group: 'crafts' }
  }
  return undefined
}

const made = new Map()

/** The page for a reference, or undefined when the reference means nothing. */
export function makeItem(ref) {
  if (typeof ref !== 'string' || ref.length > 200) return undefined
  if (!made.has(ref)) {
    const item = build(ref)
    made.set(ref, item ? { id: ref, ...item } : undefined)
    // A visitor can ask for endless mandalas; only the recent ones are kept.
    if (made.size > 400) made.delete(made.keys().next().value)
  }
  return made.get(ref)
}

export const featuredPatterns = ['mandala-3-1', 'mandala-4-1', 'mandala-2-2', 'mandala-3-2', 'mandala-5-2', 'mandala-3-3', 'mandala-5-3', 'mandala-6-3', 'pattern-stars', 'pattern-honey', 'pattern-tiles']
export const traceRefs = { arabic: arabic.map((item) => `trace-${item.id}`), english: english.map((item) => `trace-${item.id}`), numbers: numbers.map((item) => `trace-${item.id}`) }
export const wordRefs = { ar: Object.keys(arabicWords).map((id) => `word-${id}`), en: Object.keys(englishWords).map((id) => `word-${id}`) }
export const dotRefs = Object.keys(dotShapes).map((id) => `dots-${id}`)
export const craftRefs = { cards: cardKinds.map((kind) => `card-${kind}`), bookmarks: bookmarkKinds.map((kind) => `bookmarks-${kind}`), masks: maskKinds.map((kind) => `mask-${kind}`) }
