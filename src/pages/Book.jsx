import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Art from '../components/Art.jsx'
import Choice from '../components/Choice.jsx'
import Output from '../components/Output.jsx'
import Preview from '../components/Preview.jsx'
import { Close, Down, Up } from '../components/icons.jsx'
import { useTitle } from '../lib/hooks.js'
import { useLang, useT, useTo } from '../lib/i18n.jsx'
import { papers, tools } from '../lib/paper.js'
import { leafPage, plan } from '../lib/plan.js'
import { useStore } from '../lib/store.jsx'
import { count, nameOf, renderOptions, summary, toolAdvice } from '../lib/words.js'

const sheetIcon = (
  <svg width="30" height="40" viewBox="0 0 38 50" aria-hidden="true">
    <rect x="2" y="2" width="34" height="46" rx="3" fill="#fff" stroke="#211c17" strokeWidth="3" />
  </svg>
)
const bookIcon = (
  <svg width="52" height="40" viewBox="0 0 62 46" aria-hidden="true">
    <path d="M31 6v36M31 6C22 0 10 2 3 5v36c8-3 19-4 28 1c9-5 20-4 28-1V5C52 2 40 0 31 6z" fill="#fff" stroke="#211c17" strokeWidth="3" strokeLinejoin="round" />
  </svg>
)
const twoIcon = (
  <svg width="48" height="38" viewBox="0 0 54 42" aria-hidden="true">
    <rect x="2" y="2" width="50" height="38" rx="3" fill="#fff" stroke="#211c17" strokeWidth="3" />
    <path d="M27 2v38" stroke="#211c17" strokeWidth="3" strokeDasharray="4 4" />
  </svg>
)

const steps = {
  book: [
    { en: 'Print on both sides and choose “flip on short edge”. Keep “actual size”.', ar: 'اطبع على الوجهين واختر «القلب على الحافة القصيرة»، مع «الحجم الفعلي».' },
    { en: 'Keep the sheets in the order they came out and fold the stack in half.', ar: 'اترك الأوراق بترتيب خروجها واطوِها معاً من المنتصف.' },
    { en: 'Staple along the fold. The book is ready.', ar: 'دبّس على خط الطي، والكتاب جاهز.' },
  ],
  two: [
    { en: 'Print on one side, at “actual size”.', ar: 'اطبع على وجه واحد، مع «الحجم الفعلي».' },
    { en: 'Cut each sheet along the dashed line.', ar: 'قصّ كل ورقة على الخط المتقطع.' },
    { en: 'You now have two small drawings from every sheet.', ar: 'صار عندك رسمتان صغيرتان من كل ورقة.' },
  ],
  sheets: [
    { en: 'Choose the same paper size in the print window.', ar: 'اختر مقاس الورق نفسه في نافذة الطباعة.' },
    { en: 'Keep “actual size”, so nothing is cut off.', ar: 'اختر «الحجم الفعلي»، حتى لا يُقص شيء.' },
    { en: 'Print on one side.', ar: 'اطبع على وجه واحد.' },
  ],
}

function Empty() {
  const t = useT()
  const to = useTo()
  return (
    <div className="wrap py-14">
      <h1 className="text-4xl sm:text-5xl">{t('Your book is empty', 'كتابك فارغ')}</h1>
      <p className="mt-3 max-w-xl text-xl text-mute">{t('Press “Add to book” on the drawings you like, then come back here to print them as a book or as sheets.', 'اضغط «أضفها للكتاب» على الرسومات التي تعجبك، ثم عُد إلى هنا لتطبعها كتاباً أو أوراقاً.')}</p>
      <Link to={to('/')} className="btn-go mt-6">
        {t('Choose drawings', 'اختر الرسومات')}
      </Link>
    </div>
  )
}

export default function Book() {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const { book, options, setOption, resolve, remove, move, clear } = useStore()
  useTitle(t('My book | Moon Talween', 'كتابي | مون تلوين'))

  const items = useMemo(() => book.map(resolve).filter(Boolean), [book, resolve])
  const thePlan = useMemo(() => plan({ mode: options.mode, items, paper: options.paper, fit: options.fit, tool: options.tool, rtl: lang === 'ar' }), [items, options.mode, options.paper, options.fit, options.tool, lang])
  const how = useMemo(() => renderOptions(items, options, lang), [items, options, lang])
  // A book is shown page by page, in reading order; the printed sheets carry two pages each.
  const shownPages = useMemo(() => (thePlan.mode === 'book' ? thePlan.order.map((content) => leafPage(options.paper, content)) : thePlan.pages), [thePlan, options.paper])

  if (items.length === 0) return <Empty />
  const paper = papers[options.paper] ?? papers.a4
  const bleeds = tools[options.tool]?.bleeds

  return (
    <div className="wrap pb-6 pt-2">
      <h1 className="text-4xl sm:text-5xl">{t('Set up printing', 'جهّز الطباعة')}</h1>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-7">
          <section aria-labelledby="chosen">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="chosen" className="text-xl">
                {t('Your drawings', 'رسوماتك')} <span className="font-semibold text-mute">({count.drawings(items.length, lang)})</span>
              </h2>
              <button type="button" className="link py-2 text-base" onClick={clear}>
                {t('Empty the book', 'أفرغ الكتاب')}
              </button>
            </div>
            <ol className="mt-2 space-y-2">
              {items.map((item, index) => {
                const name = nameOf(item, lang)
                return (
                  <li key={item.ref} className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-white p-2">
                    <span className="w-14 shrink-0">
                      <Art item={item} />
                    </span>
                    <span className="min-w-0 flex-1 break-words font-bold">{name}</span>
                    <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink disabled:opacity-30" disabled={index === 0} onClick={() => move(item.ref, -1)} aria-label={t(`Move ${name} earlier`, `قدّم ${name}`)}>
                      <Up />
                    </button>
                    <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink disabled:opacity-30" disabled={index === items.length - 1} onClick={() => move(item.ref, 1)} aria-label={t(`Move ${name} later`, `أخّر ${name}`)}>
                      <Down />
                    </button>
                    <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink bg-sand" onClick={() => remove(item.ref)} aria-label={t(`Remove ${name}`, `احذف ${name}`)}>
                      <Close />
                    </button>
                  </li>
                )
              })}
            </ol>
            <Link to={to('/')} className="link mt-3 inline-block py-2">
              {t('Add more drawings', 'أضف رسومات أخرى')}
            </Link>
          </section>

          <Choice
            legend={t('What do you want to print?', 'ماذا تريد أن تطبع؟')}
            name="mode"
            value={options.mode}
            onChange={(value) => setOption('mode', value)}
            options={[
              { id: 'sheets', icon: sheetIcon, label: t('Single sheets', 'أوراق مفردة'), note: t('one drawing a sheet', 'رسمة في كل ورقة') },
              { id: 'book', icon: bookIcon, label: t('Coloring book', 'كتاب تلوين'), note: t('sheets folded in half', 'ورق مطوي بالنصف') },
              { id: 'two', icon: twoIcon, label: t('Two a sheet', 'رسمتان في الورقة'), note: t('saves paper', 'توفير للورق') },
            ]}
          />

          {options.mode === 'sheets' && (
            <Choice
              legend={t('How should each drawing sit on its sheet?', 'كيف تريد الرسمة على الورقة؟')}
              name="fit"
              value={options.fit}
              onChange={(value) => setOption('fit', value)}
              columns="grid-cols-2"
              options={[
                { id: 'fill', label: t('Fill the sheet', 'املأ الورقة كلها') },
                { id: 'margin', label: t('With a margin and its name', 'مع هامش واسم الرسمة') },
              ]}
            />
          )}

          <div>
            <Choice
              legend={t('What will your child color with?', 'بماذا سيلوّن طفلك؟')}
              name="tool"
              value={options.tool}
              onChange={(value) => setOption('tool', value)}
              columns="grid-cols-2"
              options={[
                { id: 'pencil', label: t('Pencils', 'أقلام خشبية') },
                { id: 'crayon', label: t('Crayons', 'ألوان شمعية') },
                { id: 'marker', label: t('Felt pens', 'فلوماستر') },
                { id: 'water', label: t('Watercolors', 'ألوان مائية') },
              ]}
            />
            <p className="mt-2.5 rounded-2xl border-2 border-dashed border-crayon-blue bg-crayon-sky px-4 py-2.5 text-base font-semibold" role="status">
              {toolAdvice[options.tool]?.[lang]}
            </p>
          </div>

          <Choice legend={t('Paper in your printer', 'مقاس الورق في طابعتك')} name="paper" value={options.paper} onChange={(value) => setOption('paper', value)} options={Object.values(papers).map((item) => ({ id: item.id, label: item.label }))} />

          <Choice
            legend={t('Thickness of the lines', 'سُمك الخطوط')}
            name="line"
            value={options.line}
            onChange={(value) => setOption('line', value)}
            options={[
              { id: 'thick', label: t('Thick', 'عريض'), note: t('for little ones', 'للصغار') },
              { id: 'medium', label: t('Medium', 'متوسط') },
              { id: 'thin', label: t('Thin', 'رفيع'), note: t('more detail', 'تفاصيل أكثر') },
            ]}
          />

          {options.mode === 'book' && (
            <div>
              <label htmlFor="child" className="text-xl font-extrabold">
                {t('Child’s name on the cover', 'اسم الطفل على الغلاف')} <span className="text-base font-semibold text-mute">({t('optional', 'اختياري')})</span>
              </label>
              <input
                id="child"
                type="text"
                maxLength={24}
                autoComplete="off"
                value={options.childName}
                onChange={(event) => setOption('childName', event.target.value)}
                className="mt-2.5 block min-h-14 w-full rounded-2xl border-[3px] border-ink bg-white px-4 text-xl font-bold"
              />
            </div>
          )}
        </div>

        <section className="card bg-sand p-4 sm:p-6 lg:sticky lg:top-6" aria-labelledby="result">
          <h2 id="result" className="text-2xl">
            {thePlan.mode === 'book' ? t('This is how your book will look', 'هكذا سيكون كتابك') : t('This is what will print', 'هذا ما سيُطبع')}
          </h2>
          <ul className={`mt-4 grid gap-3 ${thePlan.mode === 'two' ? 'grid-cols-2' : 'grid-cols-3 sm:grid-cols-4'}`} data-pages>
            {shownPages.map((page, index) => (
              <li key={index} className="min-w-0">
                <Preview page={page} options={how} width={thePlan.mode === 'two' ? 260 : 150} label={t(`Page ${index + 1}`, `الصفحة ${index + 1}`)} />
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border-[3px] border-ink bg-white p-4">
            <p className="text-xl font-extrabold" data-summary>
              {summary(thePlan, items, paper.label, lang)}
            </p>
            <p className="font-semibold text-mute">
              {thePlan.mode === 'book'
                ? bleeds
                  ? t('Each drawing has a blank page behind it, and the pages are arranged to read in order once folded.', 'خلف كل رسمة صفحة فارغة، والصفحات مرتّبة لتصير بالتسلسل الصحيح بعد الطي.')
                  : t('The pages are arranged so they read in order once the sheets are folded.', 'الصفحات مرتّبة لتصير بالتسلسل الصحيح بعد طي الأوراق.')
                : thePlan.mode === 'two'
                  ? t('Each sheet is cut in half along the dashed line.', 'كل ورقة تُقص من المنتصف على الخط المتقطع.')
                  : t('One side of each sheet is printed.', 'يُطبع وجه واحد من كل ورقة.')}
            </p>
            <div className="mt-3">
              <Output thePlan={thePlan} items={items} options={options} fileName={thePlan.mode === 'book' ? 'moon-talween-book' : 'moon-talween-drawings'} />
            </div>
          </div>

          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {steps[thePlan.mode].map((step, index) => (
              <li key={step.en} className="rounded-2xl border-2 border-ink bg-white p-3 text-base font-semibold leading-snug">
                <span className="me-1.5 inline-grid h-7 w-7 place-items-center rounded-full bg-ink text-base font-bold text-white">{index + 1}</span>
                {step[lang]}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
