import { useEffect, useState } from 'react'
import { fontsReady, renderPage } from '../lib/render.js'

/**
 * A planned page, drawn small. It is made by the same code that prints, so the picture on
 * screen is the page that will come out.
 */
export default function Preview({ page, options, width = 300, label, className = '' }) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    let current = true
    fontsReady(options.sample).then(() => {
      if (!current) return
      const pixels = width * Math.min(2, window.devicePixelRatio || 1)
      const canvas = renderPage(page, { ...options, dpi: (pixels / page.width) * 25.4 })
      setUrl(canvas.toDataURL('image/png'))
    })
    return () => {
      current = false
    }
  }, [page, options, width])

  return (
    <div className={`overflow-hidden rounded-md border-[2.5px] border-ink bg-white ${className}`} style={{ aspectRatio: `${page.width} / ${page.height}` }}>
      {url && <img src={url} alt={label} className="block h-full w-full" />}
    </div>
  )
}
