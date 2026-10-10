import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LangProvider } from '../lib/i18n.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

/** The frame around every page, in one language. */
export default function Layout({ lang }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <LangProvider lang={lang}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-xl focus:border-[3px] focus:border-ink focus:bg-white focus:px-4 focus:py-2 focus:font-bold">
        {lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LangProvider>
  )
}
