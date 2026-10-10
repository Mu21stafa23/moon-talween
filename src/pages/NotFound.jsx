import { Link } from 'react-router-dom'
import { useTitle } from '../lib/hooks.js'
import { useT, useTo } from '../lib/i18n.jsx'

export default function NotFound() {
  const t = useT()
  const to = useTo()
  useTitle(t('Page not found | Moon Talween', 'الصفحة غير موجودة | مون تلوين'))
  return (
    <div className="wrap py-14">
      <h1 className="text-4xl sm:text-5xl">{t('This page does not exist', 'هذه الصفحة غير موجودة')}</h1>
      <p className="mt-3 max-w-xl text-xl text-mute">{t('The link may be old or mistyped.', 'ربما كان الرابط قديماً أو فيه خطأ.')}</p>
      <Link to={to('/')} className="btn-go mt-6">
        {t('See the drawings', 'شاهد الرسومات')}
      </Link>
    </div>
  )
}
