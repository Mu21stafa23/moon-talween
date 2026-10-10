import { Link } from 'react-router-dom'
import { useTitle } from '../lib/hooks.js'
import { useLang, useT, useTo } from '../lib/i18n.jsx'
import { toolAdvice } from '../lib/words.js'

export default function How() {
  const lang = useLang()
  const t = useT()
  const to = useTo()
  useTitle(t('How to print | Moon Talween', 'كيف أطبع؟ | مون تلوين'))

  const ways = [
    {
      title: t('One drawing, right now', 'رسمة واحدة الآن'),
      text: t('Press “Print it now” under any drawing. Choose whether it fills the sheet or sits inside a margin with its name, then print or download the PDF.', 'اضغط «اطبعها الآن» تحت أي رسمة. اختر أن تملأ الورقة أو أن تكون داخل هامش مع اسمها، ثم اطبع أو نزّل ملف PDF.'),
    },
    {
      title: t('A coloring book', 'كتاب تلوين'),
      text: t('Add drawings to your book, write your child’s name for the cover, and print on both sides. The site puts the pages in the right places, so folding the sheets in half gives a book that reads in order.', 'أضف الرسومات إلى كتابك، واكتب اسم طفلك للغلاف، واطبع على الوجهين. الموقع يضع كل صفحة في مكانها، فيصير الورق بعد طيّه من المنتصف كتاباً بالتسلسل الصحيح.'),
    },
    {
      title: t('Two drawings on a sheet', 'رسمتان في الورقة'),
      text: t('Half the paper for the same number of drawings. Cut each sheet along the dashed line.', 'نصف الورق لعدد الرسومات نفسه. قصّ كل ورقة على الخط المتقطع.'),
    },
  ]
  const duplex = [
    t('In the print window, choose the paper size you picked on the site and keep the scale at “actual size” or 100%.', 'في نافذة الطباعة اختر مقاس الورق الذي حدّدته في الموقع، واترك المقياس على «الحجم الفعلي» أو 100%.'),
    t('Turn on printing on both sides and choose “flip on short edge”.', 'فعّل الطباعة على الوجهين واختر «القلب على الحافة القصيرة».'),
    t('If your printer prints one side only: print the odd pages, put the stack back in the tray the other way up, then print the even pages. Try with two sheets first.', 'إن كانت طابعتك تطبع وجهاً واحداً: اطبع الصفحات الفردية، ثم أعد الرزمة إلى الدرج مقلوبة واطبع الزوجية. جرّب بورقتين أولاً.'),
    t('Keep the sheets in the order they came out, fold them in half together, and staple along the fold.', 'اترك الأوراق بترتيب خروجها، واطوِها معاً من المنتصف، ثم دبّس على خط الطي.'),
  ]
  const toolNames = { pencil: t('Pencils', 'أقلام خشبية'), crayon: t('Crayons', 'ألوان شمعية'), marker: t('Felt pens', 'فلوماستر'), water: t('Watercolors', 'ألوان مائية') }

  return (
    <div className="wrap pb-6 pt-2">
      <h1 className="text-4xl sm:text-5xl">{t('How to print', 'كيف أطبع؟')}</h1>
      <p className="mt-3 max-w-2xl text-xl text-mute">{t('Three ways to print, and the two settings that matter in the print window.', 'ثلاث طرق للطباعة، وإعدادان مهمّان في نافذة الطباعة.')}</p>

      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {ways.map((way) => (
          <li key={way.title} className="card p-5">
            <h2 className="text-2xl">{way.title}</h2>
            <p className="mt-2">{way.text}</p>
          </li>
        ))}
      </ul>

      <section className="mt-12 grid gap-8 lg:grid-cols-2" aria-labelledby="book-steps">
        <div>
          <h2 id="book-steps" className="text-3xl">
            {t('Printing the book, step by step', 'طباعة الكتاب خطوة بخطوة')}
          </h2>
          <ol className="mt-4 space-y-3">
            {duplex.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-bold text-white">{index + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-2 rounded-3xl border-[3px] border-ink bg-white p-6">
          <h2 className="text-3xl">{t('A book from a printer that prints one side only', 'كتاب بطابعة تطبع وجهاً واحداً')}</h2>
          <p className="mt-2 max-w-3xl">
            {t(
              'When setting up a book, choose “One side only”. Each sheet then carries two pages side by side. Fold every sheet in half on its own with the drawings outside, stack the folded sheets in order, and staple the open edges. No sheet goes back into the printer. It takes twice the paper, and felt pens cannot soak through to the next drawing.',
              'عند تجهيز الكتاب اختر «وجه واحد فقط». تحمل كل ورقة عندها صفحتين متجاورتين. اطوِ كل ورقة لوحدها من المنتصف والرسم إلى الخارج، ورتّب الأوراق المطوية بالتسلسل، ثم دبّس الأطراف المفتوحة. لا تعود أي ورقة إلى الطابعة. يحتاج ضعف الورق، ولا ينفذ الفلوماستر إلى الرسمة التالية.',
            )}
          </p>
        </div>
        <div>
          <h2 className="text-3xl">{t('Which paper for which colors', 'أي ورق لأي ألوان')}</h2>
          <dl className="mt-4 divide-y-2 divide-dashed divide-ink/30 rounded-3xl border-[3px] border-ink bg-white px-5">
            {Object.keys(toolNames).map((id) => (
              <div key={id} className="py-3.5">
                <dt className="text-xl font-extrabold">{toolNames[id]}</dt>
                <dd className="mt-0.5 text-mute">{toolAdvice[id][lang]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-12 rounded-3xl border-[3px] border-dashed border-ink bg-sand p-6" aria-labelledby="own-title">
        <h2 id="own-title" className="text-3xl">
          {t('Printing a picture of your own', 'طباعة صورة من عندك')}
        </h2>
        <p className="mt-2 max-w-3xl">
          {t(
            '“Add your picture” on the drawings page takes any picture from your device and prints it the same way: filling the sheet, two to a sheet, or inside a book. The picture is opened by your browser only. It is not uploaded, and it is gone when you close the page.',
            '«أضف صورتك» في صفحة الرسومات يأخذ أي صورة من جهازك ويطبعها بالطريقة نفسها: تملأ الورقة، أو رسمتان في الورقة، أو داخل كتاب. الصورة يفتحها متصفحك فقط. لا تُرفع إلى أي مكان، وتختفي عند إغلاق الصفحة.',
          )}
        </p>
        <Link to={to('/')} className="btn-go mt-5">
          {t('Go to the drawings', 'اذهب إلى الرسومات')}
        </Link>
      </section>
    </div>
  )
}
