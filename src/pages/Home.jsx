import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Art from '../components/Art.jsx'
import { Check } from '../components/icons.jsx'
import { drawingById, drawings, groups } from '../drawings/index.js'
import { useTitle } from '../lib/hooks.js'
import { useLang, useT, useTo } from '../lib/i18n.jsx'
import { useStore } from '../lib/store.jsx'
import { count, nameOf } from '../lib/words.js'

// A chosen tile is tinted, as if someone had started coloring it.
const tints = { characters: '#fff3d6', animals: '#fff3d6', sea: '#e3f1ff', nature: '#e6f6ea', vehicles: '#ffe6e0', space: '#efe7ff', arabic: '#fff3d6', english: '#e3f1ff', numbers: '#e6f6ea', picture: '#f3ecdc' }

function Tile({ item }) {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const { book, toggle } = useStore()
  const inBook = book.includes(item.ref)
  const name = nameOf(item, lang)
  return (
    <li className={`card relative flex min-w-0 flex-col p-3 ${inBook ? 'shadow-hard-lg' : ''}`} style={inBook ? { background: tints[item.group ?? 'picture'] } : undefined}>
      {inBook && (
        <span className="absolute -top-3 start-[-0.75rem] grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-crayon-green text-white" aria-hidden="true">
          <Check width={18} height={18} />
        </span>
      )}
      <Art item={item} />
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2">
        <h3 className="break-words text-xl font-bold">{name}</h3>
        {item.age && <span className="text-sm font-semibold text-mute">{t(`ages ${item.age[0]} to ${item.age[1]}`, `${item.age[0]} إلى ${item.age[1]} سنوات`)}</span>}
      </div>
      <div className="mt-2 grid gap-2 xl:grid-cols-2">
        <Link to={to(`/print/${item.ref}`)} className="btn-sun min-h-11 px-2 text-base shadow-none" aria-label={t(`Print ${name} now`, `اطبع ${name} الآن`)}>
          {t('Print it now', 'اطبعها الآن')}
        </Link>
        <button type="button" className="btn-flat min-h-11 px-2 text-base" aria-pressed={inBook} aria-label={t(`${name}: in my book`, `${name}: في كتابي`)} onClick={() => toggle(item.ref)}>
          {inBook ? t('In my book', 'في كتابي') : t('Add to book', 'أضفها للكتاب')}
        </button>
      </div>
    </li>
  )
}

export default function Home() {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const { book, pictures, addPictures } = useStore()
  const [params, setParams] = useSearchParams()
  const [note, setNote] = useState('')
  const picker = useRef(null)
  useTitle(t('Moon Talween | Coloring pages ready to print', 'مون تلوين | رسومات تلوين جاهزة للطباعة'))

  // An unknown group in the address counts as "all", so an old link still shows drawings.
  const groupId = groups.some((group) => group.id === params.get('group')) ? params.get('group') : 'all'
  const shown = (groupId === 'all' ? drawings : drawings.filter((item) => item.group === groupId)).map((item) => ({ ...item, kind: 'drawing', ref: item.id }))
  const chips = [{ id: 'all', name: { ar: 'الكل', en: 'All' } }, ...groups]

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
      <section className="wrap grid items-center gap-8 pb-10 pt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pb-14 lg:pt-8">
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
            <Art item={{ ...drawingById('heroine'), kind: 'drawing' }} />
            <p className="text-center text-xl font-extrabold text-mute">{drawingById('heroine').name[lang]}</p>
          </div>
          <div className="absolute start-[6%] top-1 w-60 -rotate-[5deg] rounded-xl border-[3px] border-ink bg-white p-4 shadow-hard-lg rtl:rotate-[5deg]">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="absolute inset-0">
                <path d="M52 96l92-14l-96 34l104-10l-98 36l96-12l-80 30" fill="none" stroke="#ffb347" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M50 70l8-22l14 14M150 70l-8-22l-14 14" fill="none" stroke="#ff8db8" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <Art item={{ ...drawingById('cat'), kind: 'drawing' }} className="relative [&_*]:!fill-none [&_.d]:!fill-ink" />
            </div>
            <p className="text-center text-xl font-extrabold">{drawingById('cat').name[lang]}</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="wrap" aria-labelledby="gallery-title">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 id="gallery-title" className="me-2 text-3xl">
            {t('Drawings', 'الرسومات')}
          </h2>
          {chips.map((chip) => (
            <label key={chip.id} className="relative">
              <input
                type="radio"
                name="group"
                className="peer sr-only"
                checked={groupId === chip.id}
                onChange={() => setParams(chip.id === 'all' ? {} : { group: chip.id }, { replace: true, preventScrollReset: true })}
              />
              <span className={`chip peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-crayon-blue ${groupId === chip.id ? 'chip-on' : ''}`}>{chip.name[lang]}</span>
            </label>
          ))}
        </div>
        <p role="status" className="mt-3 font-semibold text-mute">
          {count.drawings(shown.length, lang)}
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

      {book.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-[3px] border-ink bg-crayon-yellow">
          <div className="wrap flex items-center justify-between gap-3 py-3">
            <p className="text-lg font-extrabold sm:text-xl">{t(`${count.drawings(book.length, 'en')} in your book`, `في كتابك ${count.drawings(book.length, 'ar')}`)}</p>
            <Link to={to('/book')} className="btn-go">
              {t('Set up printing', 'جهّز الطباعة')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
