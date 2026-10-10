import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Art from '../components/Art.jsx'
import Choice from '../components/Choice.jsx'
import Tile, { Dock, Made } from '../components/Tile.jsx'
import { drawingById } from '../drawings/index.js'
import { useTitle } from '../lib/hooks.js'
import { useLang, useT } from '../lib/i18n.jsx'
import { useStore } from '../lib/store.jsx'
import { dotRefs, nameRef, traceRefs, wordRefs } from '../makers/index.js'

const kinds = [
  { id: 'mandala', name: { ar: 'ماندالا', en: 'Mandalas' } },
  { id: 'maze', name: { ar: 'متاهات', en: 'Mazes' } },
  { id: 'numbers', name: { ar: 'لوّن بالأرقام', en: 'Color by number' } },
  { id: 'name', name: { ar: 'اسمك للتلوين', en: 'Your name' } },
  { id: 'trace', name: { ar: 'تتبّع الحروف', en: 'Letter tracing' } },
  { id: 'word', name: { ar: 'حرف وكلمة', en: 'Letter and word' } },
  { id: 'dots', name: { ar: 'وصّل النقاط', en: 'Dot to dot' } },
]

const about = {
  mandala: { ar: 'زخرفة جديدة في كل مرة. اختر الصعوبة واضغط حتى تجد ما يعجبك.', en: 'A new pattern every time. Choose how fine it is, and press until you find one you like.' },
  maze: { ar: 'متاهة جديدة في كل مرة، لها طريق واحد من السهم إلى النجمة.', en: 'A new maze every time, with one way from the arrow to the star.' },
  numbers: { ar: 'كل جزء فيه رقم، وكل رقم له لون في المفتاح أسفل الصفحة.', en: 'Every part has a number, and every number has a color in the key below.' },
}

const levels = (t) => [
  { id: 1, label: t('Easy', 'سهلة') },
  { id: 2, label: t('Medium', 'متوسطة') },
  { id: 3, label: t('Fine', 'دقيقة') },
]

/** A page made from a number: press for another one. */
function Maker({ kind }) {
  const lang = useLang()
  const t = useT()
  const [seed, setSeed] = useState(kind === 'mandala' ? 3 : 1)
  const [level, setLevel] = useState(2)
  const top = kind === 'numbers' ? 2 : 3
  const item = { ...drawingById(`${kind}-${seed}-${Math.min(level, top)}`), kind: 'drawing' }
  item.ref = item.id
  return (
    <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-start">
      <div className="card p-4 shadow-hard-lg">
        <Art item={item} />
      </div>
      <div className="space-y-6">
        <p className="max-w-xl text-xl text-mute">{about[kind][lang]}</p>
        <Choice legend={t('How hard?', 'الصعوبة')} name="level" value={Math.min(level, top)} onChange={setLevel} options={levels(t).slice(0, top)} />
        <button type="button" className="btn-sun" onClick={() => setSeed(1 + Math.floor(Math.random() * 99998))}>
          {kind === 'maze' ? t('Another maze', 'متاهة أخرى') : t('Another one', 'واحدة أخرى')}
        </button>
        <p className="font-bold" role="status" data-made>
          {item.name[lang]}
        </p>
        <Made item={item} />
      </div>
    </div>
  )
}

/** A name typed by the visitor, as big letters to color. */
function NameMaker() {
  const t = useT()
  const { options, setOption } = useStore()
  const name = options.childName.trim()
  const item = name ? drawingById(nameRef('name', name)) : undefined
  return (
    <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-start">
      <div className="card p-4 shadow-hard-lg">{item ? <Art item={item} /> : <div className="grid aspect-square place-items-center p-6 text-center text-xl font-bold text-mute">{t('Write a name and it appears here.', 'اكتب اسماً فيظهر هنا.')}</div>}</div>
      <div className="space-y-5">
        <p className="max-w-xl text-xl text-mute">{t('Any name, in Arabic or English, as big letters to color.', 'أي اسم، بالعربية أو الإنجليزية، بحروف كبيرة للتلوين.')}</p>
        <div>
          <label htmlFor="name" className="text-xl font-extrabold">
            {t('The name', 'الاسم')}
          </label>
          <input id="name" type="text" maxLength={20} autoComplete="off" value={options.childName} onChange={(event) => setOption('childName', event.target.value)} className="mt-2.5 block min-h-14 w-full max-w-md rounded-2xl border-[3px] border-ink bg-white px-4 text-xl font-bold" />
        </div>
        {item && <Made item={{ ...item, ref: item.id }} />}
      </div>
    </div>
  )
}

function Tiles({ refs }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {refs.map((ref) => (
        <Tile key={ref} item={{ ...drawingById(ref), kind: 'drawing', ref }} heading="h2" />
      ))}
    </ul>
  )
}

export default function Activities() {
  const lang = useLang()
  const t = useT()
  const { book } = useStore()
  const [params, setParams] = useSearchParams()
  useTitle(t('Activities | Moon Talween', 'أنشطة | مون تلوين'))

  const kind = kinds.some((item) => item.id === params.get('kind')) ? params.get('kind') : 'mandala'
  const script = ['arabic', 'english', 'numbers'].includes(params.get('letters')) ? params.get('letters') : lang === 'ar' ? 'arabic' : 'english'
  const go = (next) => setParams(next, { replace: true, preventScrollReset: true })

  return (
    <div className={`wrap pt-2 ${book.length > 0 ? 'pb-28' : 'pb-6'}`}>
      <h1 className="text-4xl sm:text-5xl">{t('Activities', 'أنشطة')}</h1>
      <p className="mt-3 max-w-2xl text-xl text-mute">{t('Pages made on the spot, and pages for learning letters. All of them print like any drawing.', 'صفحات تُصنع في لحظتها، وصفحات لتعلّم الحروف. كلها تُطبع مثل أي رسمة.')}</p>

      <fieldset className="mt-6 flex flex-wrap gap-2.5">
        <legend className="sr-only">{t('Kind of activity', 'نوع النشاط')}</legend>
        {kinds.map((item) => (
          <label key={item.id} className="relative">
            <input type="radio" name="kind" className="peer sr-only" checked={kind === item.id} onChange={() => go(item.id === 'mandala' ? {} : { kind: item.id })} />
            <span className={`chip peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-crayon-blue ${kind === item.id ? 'chip-on' : ''}`}>{item.name[lang]}</span>
          </label>
        ))}
      </fieldset>

      {(kind === 'mandala' || kind === 'maze' || kind === 'numbers') && <Maker key={kind} kind={kind} />}
      {kind === 'name' && <NameMaker />}
      {kind === 'trace' && (
        <>
          <fieldset className="mt-5 flex flex-wrap gap-2.5">
            <legend className="sr-only">{t('Which letters', 'أي الحروف')}</legend>
            {[
              { id: 'arabic', name: t('Arabic letters', 'حروف عربية') },
              { id: 'english', name: t('English letters', 'حروف إنجليزية') },
              { id: 'numbers', name: t('Numbers', 'أرقام') },
            ].map((item) => (
              <label key={item.id} className="relative">
                <input type="radio" name="letters" className="peer sr-only" checked={script === item.id} onChange={() => go({ kind: 'trace', letters: item.id })} />
                <span className={`chip peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-crayon-blue ${script === item.id ? 'bg-crayon-yellow' : ''}`}>{item.name}</span>
              </label>
            ))}
          </fieldset>
          <Tiles refs={traceRefs[script]} />
        </>
      )}
      {kind === 'word' && <Tiles refs={lang === 'ar' ? wordRefs.ar : wordRefs.en} />}
      {kind === 'dots' && <Tiles refs={dotRefs} />}
      <Dock />
    </div>
  )
}
