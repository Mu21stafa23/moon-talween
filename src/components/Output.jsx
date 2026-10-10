import { useState } from 'react'
import { useLang, useT } from '../lib/i18n.jsx'
import { makePdf, printPlan, saveFile } from '../lib/output.js'
import { renderOptions } from '../lib/words.js'

/** The two ways out: straight to the printer, or a PDF file to keep or send. */
export default function Output({ thePlan, items, options, fileName }) {
  const lang = useLang()
  const t = useT()
  const [state, setState] = useState('idle')

  const run = async (job) => {
    setState('working')
    try {
      await job(thePlan, renderOptions(items, options, lang))
      setState('idle')
    } catch {
      setState('failed')
    }
  }
  const busy = state === 'working'

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-go" disabled={busy} onClick={() => run(async (planned, how) => saveFile(await makePdf(planned, how), `${fileName}.pdf`))}>
          {t('Download PDF', 'نزّل PDF')}
        </button>
        <button type="button" className="btn" disabled={busy} onClick={() => run(printPlan)}>
          {t('Print now', 'اطبع الآن')}
        </button>
      </div>
      <p role="status" className="mt-2 min-h-7 font-semibold text-mute">
        {busy && t('Getting the pages ready…', 'نجهّز الصفحات…')}
        {state === 'failed' && <span className="text-crayon-deep">{t('The pages could not be made. Try again, or try with fewer drawings.', 'تعذّر تجهيز الصفحات. حاول مرة أخرى، أو جرّب برسومات أقل.')}</span>}
      </p>
    </div>
  )
}
