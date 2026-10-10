import { useLang } from '../lib/i18n.jsx'
import { lines } from '../lib/paper.js'
import { artOf, boxOf } from '../lib/render.js'

/**
 * A drawing or one of the visitor's pictures, as it is shown on screen. It always takes a
 * square, so tiles line up; a page that is taller or wider than a square sits inside it.
 */
export default function Art({ item, line = 'medium', className = '' }) {
  const lang = useLang()
  if (item.kind === 'picture') return <img src={item.url} alt="" className={`block aspect-square w-full object-contain ${className}`} />
  const box = boxOf(item)
  return (
    <svg
      viewBox={`0 0 ${box[0]} ${box[1]}`}
      className={`art aspect-square ${className}`}
      style={{ '--line': lines[line] * (item.weight ?? 1) }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: artOf(item, lang) }}
    />
  )
}
