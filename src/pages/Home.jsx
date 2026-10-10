import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Art from '../components/Art.jsx'
import Tile, { Dock } from '../components/Tile.jsx'
import { drawingById, drawings, groups } from '../drawings/index.js'
import { useTitle } from '../lib/hooks.js'
import { useLang, useT, useTo } from '../lib/i18n.jsx'
import { packs, surprise } from '../lib/packs.js'
import { useStore } from '../lib/store.jsx'
import { count } from '../lib/words.js'

const ageBands = [
  { id: 'all', from: 0, to: 99, name: { ar: 'كل الأعمار', en: 'All ages' } },
  { id: 'little', from: 3, to: 5, name: { ar: '3 إلى 5', en: '3 to 5' } },
  { id: 'middle', from: 6, to: 8, name: { ar: '6 إلى 8', en: '6 to 8' } },
  { id: 'older', from: 9, to: 15, name: { ar: '9 إلى 15', en: '9 to 15' } },
]

function Chips({ legend, name, value, options, onChange }) {
  const lang = useLang()
  return (
    <fieldset className="flex flex-wrap items-center gap-2.5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label key={option.id} className="relative">
          <input type="radio" name={name} className="peer sr-only" checked={value === option.id} onChange={() => onChange(option.id)} />
          <span className={`chip peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-crayon-blue ${value === option.id ? 'chip-on' : ''}`}>{option.name[lang]}</span>
        </label>
      ))}
    </fieldset>
  )
}

export default function Home() {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const navigate = useNavigate()
  const { book, pictures, addPictures, load } = useStore()
  const [params, setParams] = useSearchParams()
  const [note, setNote] = useState('')
  const picker = useRef(null)
  useTitle(t('Moon Talween | Coloring pages ready to print', 'مون تلوين | رسومات تلوين جاهزة للطباعة'))

  // An unknown group or age in the address counts as "all", so an old link still shows drawings.
  const groupId = groups.some((group) => group.id === params.get('group')) ? params.get('group') : 'all'
  const age = ageBands.find((band) => band.id === params.get('age')) ?? ageBands[0]
  const suits = (item) => item.age[0] <= age.to && item.age[1] >= age.from
  const shown = drawings.filter((item) => (groupId === 'all' || item.group === groupId) && suits(item)).map((item) => ({ ...item, kind: 'drawing', ref: item.id }))

  const set = (key, value) => {
    // From the address as it is now, so two quick taps cannot overwrite one another.
    const next = new URLSearchParams(window.location.search)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const make = (refs) => {
    load(refs, { mode: 'book' })
    navigate(to('/book'))
  }
  const pick = async (event) => {
    const files = [...event.target.files]
    event.target.value = ''
    if (files.length === 0) return
    const { added, failed } = await addPictures(files)
    if (failed > 0) setNote(t('Some files are not pictures and were left out.', 'بعض الملفات ليست صوراً فتُركت.'))
    else setNote(t(`${count.pictures(added.length, 'en')} added.`, `أُضيفت ${count.pictures(added.length, 'ar')}.`))
  }

  return (
    <div className={book.length > 0 ? 'pb-28' : ''}>
      <section className="wrap grid items-center gap-8 pb-10 pt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pb-12 lg:pt-8">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem]">{t('Coloring pages ready to print: one sheet for your child, or a whole book with their name on it', 'رسومات تلوين جاهزة للطباعة: ورقة لطفلك، أو كتاب كامل باسمه')}</h1>
          <p className="mt-4 max-w-xl text-xl text-mute">{t('Choose the drawings, say how you want them printed, and get a file made for your paper.', 'اختر الرسومات، حدّد شكل الطباعة، ونزّل ملفاً مضبوطاً على مقاس ورقك.')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#gallery" className="btn-go">
              {t('Choose drawings', 'اختر الرسومات')}
            </a>
            <Link to={to('/how')} className="btn-flat">
              {t('How do I print a book?', 'كيف أطبع كتاباً؟')}
            </Link>
          </div>
        </div>
        <div className="relative hidden h-[23rem] lg:block" aria-hidden="true">
          <div className="absolute start-[46%] top-7 w-60 rotate-[5deg] rounded-xl border-[3px] border-ink bg-white p-4 shadow-hard-lg rtl:-rotate-[5deg]">
            <Art item={drawingById('mandala-3-2')} />
            <p className="text-center text-xl font-extrabold text-mute">{t('Mandala', 'ماندالا')}</p>
          </div>
          <div className="absolute start-[6%] top-1 w-60 -rotate-[5deg] rounded-xl border-[3px] border-ink bg-white p-4 shadow-hard-lg rtl:rotate-[5deg]">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="absolute inset-0">
                <path d="M52 96l92-14l-96 34l104-10l-98 36l96-12l-80 30" fill="none" stroke="#ffb347" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 70l8-22l14 14M150 70l-8-22l-14 14" fill="none" stroke="#ff8db8" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <Art item={drawingById('cat')} className="relative [&_*]:!fill-none [&_.d]:!fill-ink" />
            </div>
            <p className="text-center text-xl font-extrabold">{drawingById('cat').name[lang]}</p>
          </div>
        </div>
      </section>

      <section className="wrap" aria-labelledby="packs-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="packs-title" className="text-3xl">
            {t('Books ready to print', 'كتب جاهزة للطباعة')}
          </h2>
          <button type="button" className="btn-sun" onClick={() => make(surprise(drawings.filter((item) => item.group !== 'arabic' && item.group !== 'english' && item.group !== 'numbers' && suits(item)).map((item) => item.id)))}>
            {t('Surprise me', 'فاجئني')}
          </button>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {packs.map((pack) => (
            <li key={pack.id} className="min-w-0">
              <button type="button" className="card flex h-full w-full flex-col items-center gap-1 p-2.5 text-center transition-transform hover:-translate-y-0.5" onClick={() => make(pack.refs)}>
                <span className="block w-full max-w-[5.5rem]">
                  <Art item={drawingById(pack.cover)} />
                </span>
                <span className="font-bold leading-snug">{pack.name[lang]}</span>
                <span className="text-sm font-semibold text-mute">{count.drawings(pack.refs.length, lang)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section id="gallery" className="wrap mt-12" aria-labelledby="gallery-title">
        <h2 id="gallery-title" className="text-3xl">
          {t('Drawings', 'الرسومات')}
        </h2>
        <div className="mt-3 space-y-2.5">
          <Chips legend={t('Group', 'المجموعة')} name="group" value={groupId} onChange={(value) => set('group', value)} options={[{ id: 'all', name: { ar: 'الكل', en: 'All' } }, ...groups]} />
          <Chips legend={t('Age', 'العمر')} name="age" value={age.id} onChange={(value) => set('age', value)} options={ageBands} />
        </div>
        <p role="status" className="mt-3 font-semibold text-mute" data-count>
          {shown.length === 0 ? t('No drawing in this group suits this age.', 'لا توجد رسمة في هذه المجموعة تناسب هذا العمر.') : count.drawings(shown.length, lang)}
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <li className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-3xl border-[3px] border-dashed border-ink bg-sand p-4 text-center">
            <input ref={picker} id="own" type="file" accept="image/*" multiple className="sr-only" onChange={pick} />
            <label htmlFor="own" className="btn h-16 w-16 cursor-pointer rounded-full p-0 text-4xl leading-none" aria-hidden="true">
              +
            </label>
            <label htmlFor="own" className="cursor-pointer text-xl font-extrabold">
              {t('Add your picture', 'أضف صورتك')}
            </label>
            <p className="text-base font-semibold leading-snug text-mute">{t('Any drawing you have on this device. It stays here and is not uploaded.', 'أي رسمة عندك على جهازك. تبقى عليه ولا تُرفع إلى الموقع.')}</p>
            <p role="status" className="text-base font-bold">
              {note}
            </p>
          </li>
          {pictures.map((picture) => (
            <Tile key={picture.ref} item={{ ...picture, kind: 'picture' }} />
          ))}
          {shown.map((item) => (
            <Tile key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <Dock />
    </div>
  )
}
