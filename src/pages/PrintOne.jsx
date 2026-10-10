import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Choice from '../components/Choice.jsx'
import Output from '../components/Output.jsx'
import Preview from '../components/Preview.jsx'
import Toggle from '../components/Toggle.jsx'
import { useTitle } from '../lib/hooks.js'
import { useLang, useT, useTo } from '../lib/i18n.jsx'
import { papers } from '../lib/paper.js'
import { plan } from '../lib/plan.js'
import { useStore } from '../lib/store.jsx'
import { nameOf, renderOptions } from '../lib/words.js'

function Missing({ wasPicture }) {
  const t = useT()
  const to = useTo()
  return (
    <div className="wrap py-14">
      <h1 className="text-4xl">{wasPicture ? t('This picture is no longer here', 'هذه الصورة لم تعد هنا') : t('This drawing does not exist', 'هذه الرسمة غير موجودة')}</h1>
      <p className="mt-3 max-w-xl text-xl text-mute">
        {wasPicture
          ? t('Your pictures are kept only while the page is open, so they are gone after a reload. Add the picture again from the drawings page.', 'صورك تبقى ما دامت الصفحة مفتوحة فقط، فتختفي عند إعادة التحميل. أضف الصورة مرة أخرى من صفحة الرسومات.')
          : t('The link may be old or mistyped.', 'ربما كان الرابط قديماً أو فيه خطأ.')}
      </p>
      <Link to={to('/')} className="btn-go mt-6">
        {t('See the drawings', 'شاهد الرسومات')}
      </Link>
    </div>
  )
}

function Ready({ item }) {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const { options, setOption, book, toggle } = useStore()
  const name = nameOf(item, lang)
  useTitle(t(`Print ${name} | Moon Talween`, `اطبع ${name} | مون تلوين`))

  const items = useMemo(() => [item], [item])
  const thePlan = useMemo(() => plan({ mode: 'sheets', items, paper: options.paper, fit: options.fit, tool: options.tool, nameLine: options.nameLine, rtl: lang === 'ar' }), [items, options.paper, options.fit, options.tool, options.nameLine, lang])
  const how = useMemo(() => renderOptions(items, options, lang), [items, options, lang])
  const inBook = book.includes(item.ref)

  return (
    <div className="wrap pb-6 pt-2">
      <Link to={to('/')} className="link inline-block py-2">
        {t('All drawings', 'كل الرسومات')}
      </Link>
      <h1 className="mt-1 text-4xl sm:text-5xl">{t(`Print: ${name}`, `اطبع: ${name}`)}</h1>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
        <div className="space-y-6">
          {!item.sheetOnly && (
          <Choice
            legend={t('How should it sit on the sheet?', 'كيف تريدها على الورقة؟')}
            name="fit"
            value={options.fit}
            onChange={(value) => setOption('fit', value)}
            columns="grid-cols-2"
            options={[
              { id: 'fill', label: t('Fill the sheet', 'املأ الورقة كلها'), note: t('as large as it can be', 'بأكبر حجم ممكن') },
              { id: 'margin', label: t('With a margin and its name', 'مع هامش واسم الرسمة'), note: t('neater, suits every printer', 'أرتب، ويناسب كل الطابعات') },
            ]}
          />
          )}
          <Choice legend={t('Paper in your printer', 'مقاس الورق في طابعتك')} name="paper" value={options.paper} onChange={(value) => setOption('paper', value)} options={Object.values(papers).map((paper) => ({ id: paper.id, label: paper.label }))} />
          {item.kind === 'drawing' && (
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
          )}
          <div className="card bg-sand p-5">
            <Output thePlan={thePlan} items={items} options={options} fileName={`moon-talween-${item.ref.replace(/[^a-z0-9-]/gi, '').slice(0, 30) || 'page'}`} />
            <p className="font-semibold text-mute">{t('In the print window, choose the same paper size and “actual size”, so nothing is cut off.', 'في نافذة الطباعة اختر مقاس الورق نفسه و«الحجم الفعلي»، حتى لا يُقص شيء.')}</p>
          </div>
          {!item.sheetOnly && (
            <Toggle id="name-line" checked={options.nameLine} onChange={(value) => setOption('nameLine', value)}>
              {t('A line for the child’s name at the top (for teachers)', 'سطر لاسم الطفل أعلى الورقة (للمعلمين)')}
            </Toggle>
          )}
          {!item.sheetOnly && (
            <button type="button" className="btn-flat" aria-pressed={inBook} onClick={() => toggle(item.ref)}>
              {inBook ? t('In my book. Take it out', 'في كتابي. أخرجها منه') : t('Add it to my book as well', 'أضفها إلى كتابي أيضاً')}
            </button>
          )}
        </div>
        <div className="mx-auto w-full max-w-sm lg:sticky lg:top-6">
          <Preview page={thePlan.pages[0]} options={how} width={384} label={t(`How ${name} will print`, `شكل ${name} على الورقة`)} className="shadow-hard-lg" />
          <p className="mt-3 text-center font-semibold text-mute">{t('This is the sheet as it will print.', 'هذه هي الورقة كما ستُطبع.')}</p>
        </div>
      </div>
    </div>
  )
}

export default function PrintOne() {
  const { ref } = useParams()
  const { resolve } = useStore()
  const item = useMemo(() => resolve(ref), [resolve, ref])
  return item ? <Ready key={ref} item={{ ...item, ref }} /> : <Missing wasPicture={ref.startsWith('pic-')} />
}
