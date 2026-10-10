// Letters and numbers are not drawn by hand: each one is a single large outlined glyph,
// set in the site's own typeface, so there is one page for every letter.

const glyph = (text, size, y) => `<text x="100" y="${y}" font-size="${size}">${text}</text>`

const arabicNames = ['الألف', 'الباء', 'التاء', 'الثاء', 'الجيم', 'الحاء', 'الخاء', 'الدال', 'الذال', 'الراء', 'الزاي', 'السين', 'الشين', 'الصاد', 'الضاد', 'الطاء', 'الظاء', 'العين', 'الغين', 'الفاء', 'القاف', 'الكاف', 'اللام', 'الميم', 'النون', 'الهاء', 'الواو', 'الياء']
const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي']
const latinNames = ['Alif', 'Ba', 'Ta', 'Tha', 'Jim', 'Ha', 'Kha', 'Dal', 'Dhal', 'Ra', 'Zay', 'Sin', 'Shin', 'Sad', 'Dad', 'Tah', 'Zah', 'Ain', 'Ghain', 'Fa', 'Qaf', 'Kaf', 'Lam', 'Mim', 'Nun', 'Ha', 'Waw', 'Ya']

export const arabic = arabicLetters.map((letter, index) => ({
  id: `ar-${index + 1}`,
  name: { ar: `حرف ${arabicNames[index]}`, en: `Arabic letter ${latinNames[index]}` },
  age: [3, 6],
  text: letter,
  art: glyph(letter, 118, 132),
}))

export const english = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({
  id: `en-${letter.toLowerCase()}`,
  name: { ar: `الحرف ${letter}`, en: `Letter ${letter}` },
  age: [4, 7],
  text: `${letter}${letter.toLowerCase()}`,
  art: glyph(`${letter}${letter.toLowerCase()}`, 104, 138),
}))

export const numbers = '0123456789'.split('').map((digit) => ({
  id: `n-${digit}`,
  name: { ar: `الرقم ${digit}`, en: `Number ${digit}` },
  age: [3, 6],
  text: digit,
  art: glyph(digit, 170, 158),
}))
