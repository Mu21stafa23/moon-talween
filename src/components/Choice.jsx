/**
 * A question with a few answers to pick one from, drawn as large buttons.
 * Behind each button is a real radio input, for the keyboard and for screen readers.
 */
export default function Choice({ legend, name, value, options, onChange, columns = 'grid-cols-3' }) {
  return (
    <fieldset>
      <legend className="text-xl font-extrabold">{legend}</legend>
      <div className={`mt-2.5 grid gap-2.5 ${columns}`}>
        {options.map((option) => (
          <label key={option.id} className="relative block">
            <input type="radio" name={name} className="peer sr-only" checked={value === option.id} onChange={() => onChange(option.id)} />
            <span className={`opt h-full peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-crayon-blue ${value === option.id ? 'opt-on' : ''}`}>
              {option.icon}
              <span>{option.label}</span>
              {option.note && <span className="text-sm font-semibold text-mute">{option.note}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
