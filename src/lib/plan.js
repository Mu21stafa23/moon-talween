// Works out what goes where on paper. Nothing here draws: a plan is plain data that the
// renderer, the preview and the tests all read.
//
// A plan has `pages`, each a side of a sheet with its size in millimetres and its `slots`.
// A slot is a rectangle with something in it: a drawing, a cover, a back cover or nothing.

import { papers, tools } from './paper.js'

const EDGE = 7 // most home printers cannot print closer to the edge than this
const MARGIN = 16
const CAPTION = 14
const HEADER = 13 // room for "Name: ______" above a drawing

const isWide = (item) => Boolean(item.box) && item.box[0] > item.box[1] * 1.1

/** One drawing on one sheet: with a margin and its name, or as large as the sheet allows. */
function sheetPage(paper, item, fit, header) {
  // A page that is wider than tall, such as a certificate, is printed with the sheet on its side.
  const width = isWide(item) ? paper.height : paper.width
  const height = isWide(item) ? paper.width : paper.height
  const top = header ? HEADER : 0
  if (fit === 'fill' || item.sheetOnly) {
    return { width, height, slots: [{ x: EDGE, y: EDGE + top, w: width - EDGE * 2, h: height - EDGE * 2 - top, content: { type: 'art', item }, turn: true, header }] }
  }
  return {
    width,
    height,
    slots: [{ x: MARGIN, y: MARGIN + top, w: width - MARGIN * 2, h: height - MARGIN * 2 - CAPTION - top, content: { type: 'art', item }, caption: true, header }],
  }
}

/** The reading order of a booklet: cover first, back cover last, blanks so the count divides by four. */
export function bookOrder(items, bleeds) {
  const order = [{ type: 'cover' }]
  let number = 0
  for (const item of items) {
    // When color soaks through, every drawing gets a leaf of its own: a blank page before it.
    if (bleeds) order.push({ type: 'blank' })
    number += 1
    order.push({ type: 'art', item, number })
  }
  while ((order.length + 1) % 4 !== 0) order.push({ type: 'blank' })
  order.push({ type: 'back' })
  return order
}

/**
 * Lays booklet pages on sheets, two to a side, so that folding the stack in half puts them
 * in reading order. `rtl` books open from the right, as Arabic books do.
 */
export function impose(order, rtl) {
  const count = order.length
  const sides = []
  for (let sheet = 0; sheet < count / 4; sheet += 1) {
    const front = [order[count - 1 - sheet * 2], order[sheet * 2]]
    const back = [order[sheet * 2 + 1], order[count - 2 - sheet * 2]]
    sides.push(rtl ? front.reverse() : front, rtl ? back.reverse() : back)
  }
  return sides
}

/** The reading order of a book made of folded leaves: an even number of pages, no blanks needed between. */
export function leafOrder(items) {
  const order = [{ type: 'cover' }, ...items.map((item, index) => ({ type: 'art', item, number: index + 1 }))]
  if (order.length % 2 === 0) order.push({ type: 'blank' })
  order.push({ type: 'back' })
  return order
}

/**
 * For a printer that prints one side only. Every sheet carries two pages side by side and is
 * folded on its own with the print outside, so it becomes one leaf with a page on each face.
 * The leaves are stacked and stapled along their open edges. The page that faces the reader
 * first has to be the half whose outer edge is the fold: the left half of the sheet in a
 * book that opens like an English one, the right half in an Arabic one.
 */
export function leaves(order, rtl) {
  const sides = []
  for (let index = 0; index < order.length; index += 2) sides.push(rtl ? [order[index + 1], order[index]] : [order[index], order[index + 1]])
  return sides
}

function halfSlots(paper, pair, inset, header) {
  // The sheet lies on its side; each half is one page of the booklet.
  const width = paper.height
  const height = paper.width
  const half = width / 2
  const top = header ? HEADER : 0
  return {
    width,
    height,
    slots: pair.map((content, index) => ({
      x: index * half + inset,
      y: inset + top,
      w: half - inset * 2,
      h: height - inset * 2 - top - (content.type === 'art' && content.number ? 8 : 0),
      content,
      number: content.type === 'art' ? content.number : undefined,
      header: header && content.type === 'art',
    })),
  }
}

/** A booklet page on its own, as it looks when the book is open: used for the preview on screen. */
export function leafPage(paperKey, content) {
  const paper = papers[paperKey] ?? papers.a4
  const single = halfSlots(paper, [content], 9, false)
  return { width: paper.height / 2, height: paper.width, slots: single.slots }
}

/**
 * @param {object} job
 * @param {'sheets'|'two'|'book'} job.mode
 * @param {object[]} job.items   the drawings and pictures to print, in order
 * @param {string} job.paper     a key of `papers`
 * @param {'margin'|'fill'} job.fit  for single sheets
 * @param {string} job.tool      a key of `tools`
 * @param {'both'|'one'} job.sides  what the printer can do; matters for a book
 * @param {boolean} job.nameLine  a line for the child's name above each drawing (not in a book)
 * @param {boolean} job.rtl      which way a booklet opens
 */
export function plan(job) {
  const paper = papers[job.paper] ?? papers.a4
  const tool = tools[job.tool] ?? tools.pencil
  // A page made for a whole sheet, such as a certificate, cannot share a sheet or sit in a book.
  const items = job.mode === 'sheets' ? job.items : job.items.filter((item) => !item.sheetOnly)

  if (job.mode === 'book' && job.sides === 'one') {
    const order = leafOrder(items)
    const pages = leaves(order, job.rtl).map((pair) => ({ ...halfSlots(paper, pair, 9, false), fold: true }))
    return { mode: 'book', sides: 'one', pages, order, sheets: pages.length, bookPages: order.length, duplex: false }
  }

  if (job.mode === 'book') {
    const order = bookOrder(items, tool.bleeds)
    const pages = impose(order, job.rtl).map((pair) => ({ ...halfSlots(paper, pair, 9, false), fold: true }))
    return { mode: 'book', sides: 'both', pages, order, sheets: pages.length / 2, bookPages: order.length, duplex: true }
  }

  if (job.mode === 'two') {
    const pages = []
    for (let index = 0; index < items.length; index += 2) {
      const pair = [items[index], items[index + 1]].map((item) => (item ? { type: 'art', item } : { type: 'blank' }))
      pages.push({ ...halfSlots(paper, job.rtl ? pair.reverse() : pair, 9, job.nameLine), cut: true })
    }
    return { mode: 'two', pages, sheets: pages.length, duplex: false }
  }

  const pages = items.map((item) => sheetPage(paper, item, job.fit, job.nameLine && !item.sheetOnly))
  return { mode: 'sheets', pages, sheets: pages.length, duplex: false }
}
