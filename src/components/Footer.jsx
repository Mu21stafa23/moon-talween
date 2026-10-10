import { Link } from 'react-router-dom'
import { useT, useTo } from '../lib/i18n.jsx'

export default function Footer() {
  const t = useT()
  const to = useTo()
  return (
    <footer className="mt-16 border-t-[3px] border-ink bg-sand">
      <div className="wrap flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl font-semibold text-mute">
          {t(
            'All drawings on Moon Talween are original and free to print at home or in class. Pictures you add stay on your device.',
            'كل رسومات مون تلوين أصلية، وطباعتها مجانية للبيت والصف. والصور التي تضيفها تبقى على جهازك.',
          )}
        </p>
        <nav aria-label={t('Footer', 'روابط أسفل الصفحة')} className="flex gap-5">
          <Link to={to('/')} className="link inline-block py-2">
            {t('Drawings', 'الرسومات')}
          </Link>
          <Link to={to('/how')} className="link inline-block py-2">
            {t('How to print', 'كيف أطبع؟')}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
