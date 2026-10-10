import { Link } from 'react-router-dom'
import { useLang, useT, useTo } from '../lib/i18n.jsx'
import { useStore } from '../lib/store.jsx'
import { nameOf } from '../lib/words.js'
import Art from './Art.jsx'
import { Check } from './icons.jsx'

// A chosen tile is tinted, as if someone had started coloring it.
const tints = { sea: '#e3f1ff', english: '#e3f1ff', maze: '#e3f1ff', nature: '#e6f6ea', numbers: '#e6f6ea', dots: '#e6f6ea', vehicles: '#ffe6e0', occasions: '#ffe6e0', space: '#efe7ff', patterns: '#efe7ff', objects: '#efe7ff', picture: '#f3ecdc' }

export const ageLabel = (age, lang) => (lang === 'ar' ? `${age[0]} إلى ${age[1]} سنة` : `ages ${age[0]} to ${age[1]}`)

/** One drawing in a grid, with its two actions: print it now, or put it in the book. */
export default function Tile({ item, heading: Heading = 'h3' }) {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const { book, toggle } = useStore()
  const inBook = book.includes(item.ref)
  const name = nameOf(item, lang)
  return (
    <li className={`card relative flex min-w-0 flex-col p-3 ${inBook ? 'shadow-hard-lg' : ''}`} style={inBook ? { background: tints[item.group ?? 'picture'] ?? '#fff3d6' } : undefined}>
      {inBook && (
        <span className="absolute -top-3 start-[-0.75rem] grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-crayon-green text-white" aria-hidden="true">
          <Check width={18} height={18} />
        </span>
      )}
      <Art item={item} />
      <div className="mt-1 flex flex-1 flex-wrap items-baseline justify-between gap-x-2">
        <Heading className="break-words text-xl font-bold">{name}</Heading>
        {item.age && <span className="text-sm font-semibold text-mute">{ageLabel(item.age, lang)}</span>}
      </div>
      <div className={`mt-2 grid gap-2 ${item.sheetOnly ? '' : 'xl:grid-cols-2'}`}>
        <Link to={to(`/print/${encodeURIComponent(item.ref)}`)} className="btn-sun min-h-11 px-2 text-base shadow-none" aria-label={t(`Print ${name} now`, `اطبع ${name} الآن`)}>
          {t('Print it now', 'اطبعها الآن')}
        </Link>
        {!item.sheetOnly && (
          <button type="button" className="btn-flat min-h-11 px-2 text-base" aria-pressed={inBook} aria-label={t(`${name}: in my book`, `${name}: في كتابي`)} onClick={() => toggle(item.ref)}>
            {inBook ? t('In my book', 'في كتابي') : t('Add to book', 'أضفها للكتاب')}
          </button>
        )}
      </div>
    </li>
  )
}

/** A drawing shown large beside its actions: used where a page is made on the spot. */
export function Made({ item }) {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  const { book, toggle } = useStore()
  const inBook = book.includes(item.ref)
  return (
    <div className="flex flex-wrap gap-3">
      <Link to={to(`/print/${encodeURIComponent(item.ref)}`)} className="btn-go">
        {t('Print it now', 'اطبعها الآن')}
      </Link>
      {!item.sheetOnly && (
        <button type="button" className="btn" aria-pressed={inBook} onClick={() => toggle(item.ref)}>
          {inBook ? t('In my book', 'في كتابي') : t('Add to book', 'أضفها للكتاب')}
        </button>
      )}
      <span className="sr-only">{nameOf(item, lang)}</span>
    </div>
  )
}

/** The bar at the bottom of the screen that says how many drawings are in the book. */
export function Dock() {
  const t = useT()
  const to = useTo()
  const { book } = useStore()
  if (book.length === 0) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-[3px] border-ink bg-crayon-yellow">
      <div className="wrap flex items-center justify-between gap-3 py-3">
        <p className="text-lg font-extrabold sm:text-xl" data-dock>
          {t(`${book.length === 1 ? '1 drawing' : `${book.length} drawings`} in your book`, `في كتابك ${arabicDrawings(book.length)}`)}
        </p>
        <Link to={to('/book')} className="btn-go">
          {t('Set up printing', 'جهّز الطباعة')}
        </Link>
      </div>
    </div>
  )
}

function arabicDrawings(count) {
  if (count === 1) return 'رسمة واحدة'
  if (count === 2) return 'رسمتان'
  return count <= 10 ? `${count} رسومات` : `${count} رسمة`
}
