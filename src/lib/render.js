// Draws a planned page onto a canvas. The same code makes the small previews on screen and
// the full-size pages that are printed or put in a PDF, so what you see is what comes out.

import { lines, MM_PER_INCH } from './paper.js'

const INK = '#000000'
export const FONT = '"Baloo Bhaijaan 2"'

// ---- a drawing's markup, read once ----

const parsed = new Map()

function shapesOf(art) {
  if (!parsed.has(art)) {
    const svg = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${art}</svg>`, 'image/svg+xml')
    parsed.set(art, svg.documentElement)
  }
  return parsed.get(art)
}

function applyTransform(ctx, text) {
  for (const [, kind, inside] of text.matchAll(/(translate|scale|rotate)\(([^)]*)\)/g)) {
    const [a = 0, b, c] = inside.split(/[\s,]+/).map(Number)
    if (kind === 'translate') ctx.translate(a, b ?? 0)
    else if (kind === 'scale') ctx.scale(a, b ?? a)
    else {
      ctx.translate(b ?? 0, c ?? 0)
      ctx.rotate((a * Math.PI) / 180)
      ctx.translate(-(b ?? 0), -(c ?? 0))
    }
  }
}

function roundedRect(path, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  path.moveTo(x + radius, y)
  path.arcTo(x + w, y, x + w, y + h, radius)
  path.arcTo(x + w, y + h, x, y + h, radius)
  path.arcTo(x, y + h, x, y, radius)
  path.arcTo(x, y, x + w, y, radius)
  path.closePath()
}

// How each kind of text is drawn. Letters to color have no class.
function paintText(ctx, node, number) {
  const kind = node.getAttribute('class')
  const x = number('x')
  const y = number('y')
  const value = node.textContent
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  if (kind === 's' || kind === 'm') {
    // Plain writing: a label, a number, a line of instructions.
    ctx.font = `${kind === 's' ? 700 : 600} ${number('font-size')}px ${FONT}`
    ctx.fillStyle = kind === 's' ? INK : '#555555'
    ctx.fillText(value, x, y)
    return
  }
  ctx.font = `800 ${number('font-size')}px ${FONT}`
  if (kind === 't') {
    // A dotted outline to write over.
    ctx.save()
    ctx.strokeStyle = '#555555'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2.4])
    ctx.strokeText(value, x, y)
    ctx.restore()
    return
  }
  // The outline is drawn twice as wide and the letter is then filled over it. That leaves a
  // clean outline outside the letter and hides the places where its own strokes overlap.
  ctx.save()
  ctx.lineWidth *= kind === 'n' ? 1.2 : 2
  ctx.strokeText(value, x, y)
  ctx.restore()
  ctx.fillStyle = '#ffffff'
  ctx.fillText(value, x, y)
}

function paint(ctx, parent) {
  for (const node of parent.children) {
    const number = (name) => Number(node.getAttribute(name) ?? 0)
    const transform = node.getAttribute('transform')
    if (transform) {
      ctx.save()
      applyTransform(ctx, transform)
    }
    if (node.tagName === 'g') paint(ctx, node)
    else if (node.tagName === 'text') paintText(ctx, node, number)
    else {
      let path
      if (node.tagName === 'path') path = new Path2D(node.getAttribute('d'))
      else {
        path = new Path2D()
        if (node.tagName === 'circle') path.arc(number('cx'), number('cy'), number('r'), 0, Math.PI * 2)
        else if (node.tagName === 'ellipse') path.ellipse(number('cx'), number('cy'), number('rx'), number('ry'), 0, 0, Math.PI * 2)
        else if (node.tagName === 'rect') roundedRect(path, number('x'), number('y'), number('width'), number('height'), number('rx'))
      }
      const kind = node.getAttribute('class')
      if (kind === 'c' || kind === 'g') {
        // A dashed line to cut or fold along, or a faint line to write on.
        ctx.save()
        ctx.strokeStyle = kind === 'c' ? '#777777' : '#999999'
        ctx.lineWidth = kind === 'c' ? 0.8 : 0.6
        if (kind === 'c') ctx.setLineDash([4, 3])
        ctx.stroke(path)
        ctx.restore()
      } else {
        if (kind !== 'o') {
          ctx.fillStyle = kind === 'd' ? INK : '#ffffff'
          ctx.fill(path)
        }
        ctx.stroke(path)
      }
    }
    if (transform) ctx.restore()
  }
}

/** A drawing's markup in one language. Most drawings have no words and are the same in both. */
export const artOf = (item, lang) => (typeof item.art === 'string' ? item.art : item.art[lang])

/** The box a drawing is made in: 200 by 200 unless it says otherwise. */
export const boxOf = (item) => item.box ?? [200, 200]

/** Draws one drawing as large as fits in the rectangle, centred, keeping its shape. */
export function drawArt(ctx, art, rect, line, box = [200, 200]) {
  const scale = Math.min(rect.w / box[0], rect.h / box[1])
  ctx.save()
  ctx.translate(rect.x + (rect.w - box[0] * scale) / 2, rect.y + (rect.h - box[1] * scale) / 2)
  ctx.scale(scale, scale)
  ctx.lineWidth = line
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = INK
  paint(ctx, shapesOf(art))
  ctx.restore()
}

// ---- what a slot can hold ----

function fitInside(boxW, boxH, w, h) {
  const scale = Math.min(boxW / w, boxH / h)
  return { w: w * scale, h: h * scale }
}

function drawItem(ctx, item, box, line, turn, lang) {
  if (item.kind === 'picture') {
    const { image } = item
    // A wide picture on a tall sheet is turned on its side, so it prints as large as it can.
    const sideways = turn && image.width > image.height * 1.15 && box.h > box.w * 1.15
    const size = sideways ? fitInside(box.w, box.h, image.height, image.width) : fitInside(box.w, box.h, image.width, image.height)
    ctx.save()
    ctx.translate(box.x + box.w / 2, box.y + box.h / 2)
    if (sideways) {
      ctx.rotate(Math.PI / 2)
      ctx.drawImage(image, -size.h / 2, -size.w / 2, size.h, size.w)
    } else ctx.drawImage(image, -size.w / 2, -size.h / 2, size.w, size.h)
    ctx.restore()
    return
  }
  drawArt(ctx, artOf(item, lang), box, line * (item.weight ?? 1), boxOf(item))
}

function write(ctx, value, x, y, size, weight = 700, color = INK) {
  ctx.font = `${weight} ${size}px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(value, x, y)
}

function drawCover(ctx, box, mm, words, first, line, lang) {
  // A frame, the title, the child's name, and the first drawing as a taste of what is inside.
  ctx.lineWidth = 1.2 * mm
  ctx.strokeStyle = INK
  const frame = new Path2D()
  roundedRect(frame, box.x + 2 * mm, box.y + 2 * mm, box.w - 4 * mm, box.h - 4 * mm, 6 * mm)
  ctx.stroke(frame)
  const middle = box.x + box.w / 2
  const unit = box.w / 100
  write(ctx, words.title, middle, box.y + box.h * (words.name ? 0.12 : 0.17), 13 * unit, 800)
  if (words.name) write(ctx, words.name, middle, box.y + box.h * 0.245, 21 * unit, 800)
  if (first) {
    const side = Math.min(box.w * 0.8, box.h * 0.54)
    drawItem(ctx, first, { x: middle - side / 2, y: box.y + box.h * 0.37, w: side, h: side }, line, false, lang)
  }
}

function drawBack(ctx, box, words) {
  const middle = box.x + box.w / 2
  const unit = box.w / 100
  if (words.back) write(ctx, words.back, middle, box.y + box.h * 0.4, 9 * unit, 700)
  if (words.name) write(ctx, words.name, middle, box.y + box.h * 0.52, 17 * unit, 800)
  write(ctx, words.site, middle, box.y + box.h * 0.93, 5.5 * unit, 600, '#555555')
}

/**
 * @param {object} page     a page from `plan()`
 * @param {object} options  { dpi, lang, line: 'thick'|'medium'|'thin', words: { title, name, back, site, nameLine }, first, nameOf(item) }
 * @returns {HTMLCanvasElement}
 */
export function renderPage(page, options) {
  const mm = options.dpi / MM_PER_INCH
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(page.width * mm)
  canvas.height = Math.round(page.height * mm)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // Arabic lines are written from the right, so a colon or a blank to fill in lands on the correct side.
  ctx.direction = options.lang === 'ar' ? 'rtl' : 'ltr'
  const line = lines[options.line] ?? lines.medium

  for (const slot of page.slots) {
    const box = { x: slot.x * mm, y: slot.y * mm, w: slot.w * mm, h: slot.h * mm }
    const { content } = slot
    if (content.type === 'art') {
      drawItem(ctx, content.item, box, line, slot.turn, options.lang)
      if (slot.header) write(ctx, options.words.nameLine, box.x + box.w / 2, box.y - 6.5 * mm, 5.2 * mm, 600, '#333333')
      if (slot.caption) write(ctx, options.nameOf(content.item), box.x + box.w / 2, box.y + box.h + 8 * mm, 7 * mm, 700)
      if (slot.number) write(ctx, String(slot.number), box.x + box.w / 2, box.y + box.h + 4.5 * mm, 5 * mm, 700, '#555555')
    } else if (content.type === 'cover') drawCover(ctx, box, mm, options.words, options.first, line, options.lang)
    else if (content.type === 'back') drawBack(ctx, box, options.words)
  }

  if (page.cut || page.fold) {
    // A dashed line to cut along, or two small marks showing where to fold.
    ctx.strokeStyle = '#888888'
    ctx.lineWidth = Math.max(1, 0.3 * mm)
    const x = canvas.width / 2
    ctx.beginPath()
    if (page.cut) {
      ctx.setLineDash([3 * mm, 3 * mm])
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
    } else {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 4 * mm)
      ctx.moveTo(x, canvas.height - 4 * mm)
      ctx.lineTo(x, canvas.height)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }
  return canvas
}

/** The typeface has to be loaded before a canvas can write with it. */
export async function fontsReady(sample) {
  if (!document.fonts?.load) return
  await Promise.all([800, 700, 600].map((weight) => document.fonts.load(`${weight} 40px ${FONT}`, sample)))
}
