import { lines } from '../lib/paper.js'

/** A drawing or one of the visitor's pictures, as it is shown on screen. */
export default function Art({ item, line = 'medium', className = '' }) {
  if (item.kind === 'picture') return <img src={item.url} alt="" className={`block aspect-square w-full object-contain ${className}`} />
  return <svg viewBox="0 0 200 200" className={`art ${className}`} style={{ '--line': lines[line] }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: item.art }} />
}
