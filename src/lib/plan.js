// Works out what goes where on paper. Nothing here draws: a plan is plain data that the
// renderer, the preview and the tests all read.
//
// A plan has `pages`, each a side of a sheet with its size in millimetres and its `slots`.
// A slot is a rectangle with something in it: a drawing, a cover, a back cover or nothing.

import { papers, tools } from './paper.js'

const EDGE = 7 // most home printers cannot print closer to the edge than this
const MARGIN = 16
const CAPTION = 14

/** One drawing on one sheet: with a margin and its name, or as large as the sheet allows. */
function sheetPage(paper, item, fit) {
  const { width, height } = paper
  if (fit === 'fill') return { width, height, slots: [{ x: EDGE, y: EDGE, w: width - EDGE * 2, h: height - EDGE * 2, content: { type: 'art', item }, turn: true }] }
  return {
    width,
    height,
    slots: [{ x: MARGIN, y: MARGIN, w: width - MARGIN * 2, h: height - MARGIN * 2 - CAPTION, content: { type: 'art', item }, caption: true }],
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

function halfSlots(paper, pair, inset) {
  // The sheet lies on its side; each half is one page of the booklet.
  const width = paper.height
  const height = paper.width
  const half = width / 2
  return {
    width,
    height,
    slots: pair.map((content, index) => ({
      x: index * half + inset,
      y: inset,
      w: half - inset * 2,
      h: height - inset * 2 - (content.type === 'art' ? 8 : 0),
      content,
      number: content.type === 'art' ? content.number : undefined,
    })),
  }
}

/** A booklet page on its own, as it looks when the book is open: used for the preview on screen. */
export function leafPage(paperKey, content) {
  const paper = papers[paperKey] ?? papers.a4
  const single = halfSlots(paper, [content], 9)
  return { width: paper.height / 2, height: paper.width, slots: single.slots }
}

/**
 * @param {object} job
 * @param {'sheets'|'two'|'book'} job.mode
 * @param {object[]} job.items   the drawings and pictures to print, in order
 * @param {string} job.paper     a key of `papers`
 * @param {'margin'|'fill'} job.fit  for single sheets
 * @param {string} job.tool      a key of `tools`
 * @param {boolean} job.rtl      which way a booklet opens
 */
export function plan(job) {
  const paper = papers[job.paper] ?? papers.a4
  const tool = tools[job.tool] ?? tools.pencil
  const items = job.items

  if (job.mode === 'book') {
    const order = bookOrder(items, tool.bleeds)
    const pages = impose(order, job.rtl).map((pair) => ({ ...halfSlots(paper, pair, 9), fold: true }))
    return { mode: 'book', pages, order, sheets: pages.length / 2, bookPages: order.length, duplex: true }
  }

  if (job.mode === 'two') {
    const pages = []
    for (let index = 0; index < items.length; index += 2) {
      const pair = [items[index], items[index + 1]].map((item) => (item ? { type: 'art', item } : { type: 'blank' }))
      pages.push({ ...halfSlots(paper, job.rtl ? pair.reverse() : pair, 9), cut: true })
    }
    return { mode: 'two', pages, sheets: pages.length, duplex: false }
  }

  const pages = items.map((item) => sheetPage(paper, item, job.fit))
  return { mode: 'sheets', pages, sheets: pages.length, duplex: false }
}
