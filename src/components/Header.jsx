import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useOtherLanguage, useT, useTo } from '../lib/i18n.jsx'
import { useStore } from '../lib/store.jsx'
import { Close, Mark, Menu } from './icons.jsx'

export default function Header() {
  const t = useT()
  const to = useTo()
  const other = useOtherLanguage()
  const { book } = useStore()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { to: to('/'), label: t('Drawings', 'الرسومات'), end: true },
    { to: to('/book'), label: book.length > 0 ? t(`My book (${book.length})`, `كتابي (${book.length})`) : t('My book', 'كتابي') },
    { to: to('/how'), label: t('How to print', 'كيف أطبع؟') },
  ]
  const linkClass = ({ isActive }) => `rounded-xl px-3 py-2 font-bold ${isActive ? 'underline decoration-crayon-red decoration-4 underline-offset-8' : 'hover:bg-sand'}`
  const language = (
    <Link to={other.to} lang={other.lang} hrefLang={other.lang} className="rounded-xl px-3 py-2 font-bold hover:bg-sand">
      {other.lang === 'ar' ? 'العربية' : 'English'}
    </Link>
  )

  return (
    <header className="relative z-30">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Link to={to('/')} className="flex min-h-11 items-center gap-2 rounded-xl text-2xl font-extrabold">
          <Mark />
          {t('Moon Talween', 'مون تلوين')}
        </Link>
        <nav aria-label={t('Main', 'القائمة الرئيسية')} className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {language}
        </nav>
        <button type="button" className="grid h-12 w-12 place-items-center rounded-xl border-[3px] border-ink bg-white md:hidden" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          {open ? <Close /> : <Menu />}
          <span className="sr-only">{open ? t('Close menu', 'أغلق القائمة') : t('Open menu', 'افتح القائمة')}</span>
        </button>
      </div>
      {open && (
        <nav id="menu" aria-label={t('Main', 'القائمة الرئيسية')} className="absolute inset-x-0 top-full border-y-[3px] border-ink bg-paper md:hidden">
          <div className="wrap flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={(state) => `${linkClass(state)} py-3`}>
                {link.label}
              </NavLink>
            ))}
            <Link to={other.to} lang={other.lang} hrefLang={other.lang} className="rounded-xl px-3 py-3 font-bold hover:bg-sand">
              {other.lang === 'ar' ? 'العربية' : 'English'}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
