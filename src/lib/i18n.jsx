import { createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'

// Arabic is the default language and lives at the root; English pages live under /en.
const LangContext = createContext('ar')

export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

/** A helper that picks the right language: t('Print', 'اطبع') or t(drawing.name). */
export function useT() {
  const lang = useContext(LangContext)
  return (en, ar) => (typeof en === 'object' && en !== null ? en[lang] : lang === 'ar' ? (ar ?? en) : en)
}

/** Turns a site path like "/book" into the address for the current language. */
export function useTo() {
  const lang = useContext(LangContext)
  return (path) => localize(path, lang)
}

export function localize(path, lang) {
  if (lang === 'ar') return path
  return path === '/' ? '/en' : `/en${path}`
}

/** The same page in the other language, keeping whatever follows the "?". */
export function useOtherLanguage() {
  const lang = useContext(LangContext)
  const { pathname, search } = useLocation()
  const bare = lang === 'en' ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : pathname
  const other = lang === 'en' ? 'ar' : 'en'
  return { lang: other, to: `${localize(bare, other)}${search}` }
}
