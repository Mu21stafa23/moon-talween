// Wording that depends on a number or on what is being printed, in both languages.

/** Arabic counts change the noun: one, two, three to ten, eleven and more. */
function arabicCount(count, one, two, few, many) {
  if (count === 1) return one
  if (count === 2) return two
  return count <= 10 ? `${count} ${few}` : `${count} ${many}`
}

const english = (count, one, many) => (count === 1 ? `1 ${one}` : `${count} ${many}`)

export const count = {
  drawings: (n, lang) => (lang === 'ar' ? arabicCount(n, 'رسمة واحدة', 'رسمتان', 'رسومات', 'رسمة') : english(n, 'drawing', 'drawings')),
  pictures: (n, lang) => (lang === 'ar' ? arabicCount(n, 'صورة واحدة', 'صورتان', 'صور', 'صورة') : english(n, 'picture', 'pictures')),
  sheets: (n, lang) => (lang === 'ar' ? arabicCount(n, 'ورقة واحدة', 'ورقتين', 'ورقات', 'ورقة') : english(n, 'sheet', 'sheets')),
  pages: (n, lang) => (lang === 'ar' ? arabicCount(n, 'صفحة واحدة', 'صفحتين', 'صفحات', 'صفحة') : english(n, 'page', 'pages')),
}

/** What a drawing or picture is called. A visitor's picture is called by its file name. */
export function nameOf(item, lang) {
  return item.kind === 'picture' ? item.name : item.name[lang]
}

/** One line saying what will come out of the printer. */
export function summary(thePlan, items, paperLabel, lang) {
  const ar = lang === 'ar'
  if (thePlan.mode === 'book') {
    return ar
      ? `كتاب من ${count.pages(thePlan.bookPages, lang)} على ${count.sheets(thePlan.sheets, lang)} ${paperLabel}`
      : `A book of ${count.pages(thePlan.bookPages, lang)} on ${count.sheets(thePlan.sheets, lang)} of ${paperLabel}`
  }
  if (thePlan.mode === 'two') {
    return ar ? `${count.drawings(items.length, lang)} على ${count.sheets(thePlan.sheets, lang)} ${paperLabel}` : `${count.drawings(items.length, lang)} on ${count.sheets(thePlan.sheets, lang)} of ${paperLabel}`
  }
  return ar ? `${count.sheets(thePlan.sheets, lang)} ${paperLabel}، رسمة في كل ورقة` : `${count.sheets(thePlan.sheets, lang)} of ${paperLabel}, one drawing each`
}

/** The words written on the pages themselves, and what the renderer needs to know. */
export function renderOptions(items, options, lang) {
  const ar = lang === 'ar'
  const name = options.childName.trim()
  const words = {
    title: ar ? 'كتاب تلوين' : 'Coloring book',
    name,
    back: name ? (ar ? 'هذا كتاب' : 'This book belongs to') : '',
    site: ar ? 'مون تلوين' : 'Moon Talween',
  }
  const names = items.map((item) => nameOf(item, lang))
  return {
    line: options.line,
    words,
    first: items[0],
    nameOf: (item) => nameOf(item, lang),
    // Every letter that will be written, so the right part of the typeface is loaded first.
    sample: [words.title, words.name, words.back, words.site, ...names, ...items.map((item) => item.text ?? ''), '0123456789'].join(' '),
  }
}

export const toolAdvice = {
  pencil: {
    ar: 'ورق الطابعة العادي (80 غ) يكفي، ويمكن الطباعة على الوجهين.',
    en: 'Ordinary printer paper (80 gsm) is enough, and both sides can be printed.',
  },
  crayon: {
    ar: 'ورق الطابعة العادي يكفي. الورق الأثقل قليلاً (90 إلى 100 غ) يتحمل الضغط أكثر.',
    en: 'Ordinary printer paper is enough. Slightly heavier paper (90 to 100 gsm) takes the pressure better.',
  },
  marker: {
    ar: 'الفلوماستر ينفذ من الورق العادي. استخدم ورق 100 إلى 120 غ، وفي الكتاب نترك ظهر كل رسمة فارغاً.',
    en: 'Felt pens soak through ordinary paper. Use 100 to 120 gsm paper; in a book we leave the back of every drawing blank.',
  },
  water: {
    ar: 'الألوان المائية تحتاج ورقاً سميكاً (160 غ أو أكثر). حبر الطابعات النافثة قد يسيل مع الماء، فطابعة الليزر أفضل. وفي الكتاب نترك ظهر كل رسمة فارغاً.',
    en: 'Watercolors need thick paper (160 gsm or more). Inkjet ink can run when wet, so a laser printer is better. In a book we leave the back of every drawing blank.',
  },
}
