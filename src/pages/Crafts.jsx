import Art from '../components/Art.jsx'
import Tile, { Made } from '../components/Tile.jsx'
import { drawingById } from '../drawings/index.js'
import { useTitle } from '../lib/hooks.js'
import { useT } from '../lib/i18n.jsx'
import { useStore } from '../lib/store.jsx'
import { craftRefs, nameRef } from '../makers/index.js'

const tile = (ref) => ({ ...drawingById(ref), kind: 'drawing', ref })

export default function Crafts() {
  const t = useT()
  const { options, setOption } = useStore()
  useTitle(t('Crafts | Moon Talween', 'أشغال يدوية | مون تلوين'))
  const named = [tile(nameRef('cert', options.childName)), tile(nameRef('door', options.childName))]

  return (
    <div className="wrap pb-6 pt-2">
      <h1 className="text-4xl sm:text-5xl">{t('Crafts', 'أشغال يدوية')}</h1>
      <p className="mt-3 max-w-2xl text-xl text-mute">{t('Things to print, color, and then cut or fold. Each one takes a whole sheet.', 'أشياء تُطبع وتُلوَّن ثم تُقص أو تُطوى. كل واحدة تأخذ ورقة كاملة.')}</p>

      <section className="mt-8" aria-labelledby="named">
        <h2 id="named" className="text-3xl">
          {t('With your child’s name', 'باسم طفلك')}
        </h2>
        <div className="mt-3">
          <label htmlFor="craft-name" className="text-xl font-extrabold">
            {t('The name', 'الاسم')} <span className="text-base font-semibold text-mute">({t('optional', 'اختياري')})</span>
          </label>
          <input id="craft-name" type="text" maxLength={20} autoComplete="off" value={options.childName} onChange={(event) => setOption('childName', event.target.value)} className="mt-2.5 block min-h-14 w-full max-w-md rounded-2xl border-[3px] border-ink bg-white px-4 text-xl font-bold" />
        </div>
        <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
          {named.map((item) => (
            <li key={item.ref.split('-')[0]} className="card min-w-0 p-4">
              <Art item={item} className="!aspect-[7/5]" />
              <h3 className="mt-2 text-xl font-bold">{item.ref.startsWith('cert') ? t('Certificate', 'شهادة تقدير') : t('Door sign', 'لوحة باب الغرفة')}</h3>
              <p className="mb-3 text-mute">{item.ref.startsWith('cert') ? t('For a child who finished a drawing or a whole book.', 'لطفل أنهى رسمة أو كتاباً كاملاً.') : t('Color it, cut it out, and hang it on the door.', 'يلوّنها ويقصّها ويعلّقها على باب غرفته.')}</p>
              <Made item={item} />
            </li>
          ))}
        </ul>
      </section>

      {[
        { id: 'cards', title: t('Greeting cards', 'بطاقات معايدة'), text: t('Print, fold along the dashed line, color the front, and write inside.', 'اطبعها واطوِها على الخط المتقطع، ثم يلوّن الطفل وجهها ويكتب داخلها.') },
        { id: 'bookmarks', title: t('Bookmarks', 'فواصل كتب'), text: t('Four on a sheet. Color them, cut them out, and thread a ribbon through the hole.', 'أربعة في الورقة. يلوّنها ويقصّها ويربط شريطاً في الثقب.') },
        { id: 'masks', title: t('Masks', 'أقنعة'), text: t('Thicker paper works best. Cut around the face and tie a string to the two circles.', 'الورق السميك أفضل. يقص حول الوجه ويربط خيطاً في الدائرتين.') },
      ].map((section) => (
        <section key={section.id} className="mt-12" aria-labelledby={section.id}>
          <h2 id={section.id} className="text-3xl">
            {section.title}
          </h2>
          <p className="mt-1 max-w-2xl text-mute">{section.text}</p>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {craftRefs[section.id].map((ref) => (
              <Tile key={ref} item={tile(ref)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
