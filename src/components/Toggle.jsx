import { Check } from './icons.jsx'

/** A yes-or-no choice, drawn as a box with a tick. Behind it is a real checkbox. */
export default function Toggle({ id, checked, onChange, children }) {
  return (
    <label htmlFor={id} className="relative flex min-h-12 cursor-pointer items-center gap-3 text-lg font-bold">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-[3px] border-ink peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-crayon-blue ${checked ? 'bg-crayon-green text-white' : 'bg-white'}`}>
        {checked && <Check width={18} height={18} />}
      </span>
      <span>{children}</span>
    </label>
  )
}
