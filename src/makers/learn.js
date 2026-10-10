import { f } from './shapes.js'

// Pages for learning: tracing a letter, a letter with a word and a drawing, and dot to dot.

/** A big letter to color, then rows of the same letter in dots to write over. */
export function traceArt(glyph, title) {
  const big = glyph.length > 1 ? 74 : 92
  const small = glyph.length > 1 ? 26 : 32
  const rows = [150, 198, 246]
  const columns = [34, 78, 122, 166]
  const parts = [`<text class="m" x="100" y="16" font-size="10">${title}</text>`, `<text x="100" y="${glyph.length > 1 ? 92 : 98}" font-size="${big}">${glyph}</text>`]
  for (const y of rows) {
    parts.push(`<path class="g" d="M12 ${y + 6}H188"/>`, `<path class="c" d="M12 ${y - 26}H188"/>`)
    for (const x of columns) parts.push(`<text class="t" x="${x}" y="${y}" font-size="${small}">${glyph}</text>`)
  }
  return { box: [200, 268], art: parts.join('') }
}

/** A letter, a drawing whose name starts with it, and the word to color and to trace. */
export function wordArt(glyph, word, drawing) {
  const size = word.length > 7 ? 26 : 34
  return {
    box: [200, 280],
    art: `<text x="100" y="58" font-size="62">${glyph}</text><g transform="translate(34 66) scale(0.66)">${drawing}</g><text x="100" y="${232}" font-size="${size}">${word}</text><path class="g" d="M30 272H170"/><text class="t" x="100" y="266" font-size="${f(size * 0.7)}">${word}</text>`,
  }
}

// Dot to dot: the outline is given as corners to join in order. Details that are not part
// of the outline (an eye, a window) are drawn already.
const heart = [[100, 62], [122, 38], [152, 34], [176, 56], [178, 92], [160, 124], [130, 154], [100, 182], [70, 154], [40, 124], [22, 92], [24, 56], [48, 34], [78, 38]]
const star = Array.from({ length: 10 }, (_, index) => {
  const radius = index % 2 === 0 ? 84 : 36
  const angle = (index * Math.PI) / 5
  return [f(100 + radius * Math.sin(angle)), f(104 - radius * Math.cos(angle))]
})

export const dotShapes = {
  star: { name: { ar: 'نجمة', en: 'Star' }, points: star, extra: '<circle cx="86" cy="96" r="4" class="d"/><circle cx="114" cy="96" r="4" class="d"/><path class="o" d="M88 114q12 10 24 0"/>' },
  heart: { name: { ar: 'قلب', en: 'Heart' }, points: heart, extra: '' },
  house: {
    name: { ar: 'بيت', en: 'House' },
    points: [[40, 180], [40, 100], [22, 100], [100, 30], [130, 57], [130, 36], [150, 36], [150, 75], [178, 100], [160, 100], [160, 180]],
    extra: '<rect x="88" y="130" width="26" height="50"/><rect x="56" y="112" width="22" height="22"/><rect x="124" y="112" width="22" height="22"/>',
  },
  fish: {
    name: { ar: 'سمكة', en: 'Fish' },
    points: [[20, 100], [40, 74], [70, 58], [104, 56], [134, 68], [156, 90], [184, 62], [178, 100], [184, 138], [156, 110], [134, 132], [104, 144], [70, 142], [40, 126]],
    extra: '<circle cx="52" cy="92" r="5" class="d"/><path class="o" d="M30 108q10 6 20 2"/>',
  },
  rocket: {
    name: { ar: 'صاروخ', en: 'Rocket' },
    points: [[100, 16], [124, 44], [132, 84], [128, 124], [156, 164], [116, 150], [100, 188], [84, 150], [44, 164], [72, 124], [68, 84], [76, 44]],
    extra: '<circle cx="100" cy="82" r="15"/>',
  },
  cat: {
    name: { ar: 'قطة', en: 'Cat' },
    points: [[36, 36], [72, 70], [128, 70], [164, 36], [170, 110], [146, 156], [100, 176], [54, 156], [30, 110]],
    extra: '<circle cx="78" cy="106" r="6" class="d"/><circle cx="122" cy="106" r="6" class="d"/><path d="M93 124h14l-7 8z"/><path class="o" d="M100 132q-9 12-20 5M100 132q9 12 20 5"/>',
  },
  crown: {
    name: { ar: 'تاج', en: 'Crown' },
    points: [[30, 164], [20, 66], [60, 108], [100, 40], [140, 108], [180, 66], [170, 164]],
    extra: '<path class="o" d="M38 142h124"/><circle cx="70" cy="153" r="5"/><circle cx="100" cy="153" r="5"/><circle cx="130" cy="153" r="5"/>',
  },
  tree: {
    name: { ar: 'شجرة', en: 'Tree' },
    points: [[100, 14], [132, 56], [116, 56], [150, 98], [130, 98], [168, 146], [112, 146], [112, 184], [88, 184], [88, 146], [32, 146], [70, 98], [50, 98], [84, 56], [68, 56]],
    extra: '',
  },
}

export function dotsArt(points, extra) {
  const cx = points.reduce((sum, [x]) => sum + x, 0) / points.length
  const cy = points.reduce((sum, [, y]) => sum + y, 0) / points.length
  const parts = [extra]
  points.forEach(([x, y], index) => {
    // The number stands just outside its dot, on the side away from the middle of the shape.
    const dx = x - cx
    const dy = y - cy
    const far = Math.hypot(dx, dy) || 1
    parts.push(`<circle cx="${x}" cy="${y}" r="1.8" class="d"/><text class="s" x="${f(x + (dx / far) * 8)}" y="${f(y + (dy / far) * 8 + 2.6)}" font-size="7.5">${index + 1}</text>`)
  })
  return parts.join('')
}

/** A name in big letters to color, with stars around it. */
export function nameArt(name) {
  const size = name.length <= 3 ? 84 : name.length <= 5 ? 62 : name.length <= 8 ? 44 : name.length <= 12 ? 32 : 24
  return `<text x="100" y="${f(104 + size * 0.3)}" font-size="${size}">${name}</text><path d="M30 44l4 10l10 4l-10 4l-4 10l-4-10l-10-4l10-4z"/><path d="M168 36l3 8l8 3l-8 3l-3 8l-3-8l-8-3l8-3z"/><path d="M158 150l4 10l10 4l-10 4l-4 10l-4-10l-10-4l10-4z"/><path d="M40 146l3 8l8 3l-8 3l-3 8l-3-8l-8-3l8-3z"/><circle cx="100" cy="36" r="6"/><circle cx="72" cy="172" r="5"/><circle cx="126" cy="174" r="7"/>`
}
