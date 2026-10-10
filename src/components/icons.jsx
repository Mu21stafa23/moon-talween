const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const Check = (props) => (
  <svg {...base} strokeWidth={3.5} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export const Menu = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Close = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const Up = (props) => (
  <svg {...base} {...props}>
    <path d="M6 14l6-6l6 6" />
  </svg>
)

export const Down = (props) => (
  <svg {...base} {...props}>
    <path d="M6 10l6 6l6-6" />
  </svg>
)

/** The site's mark: a crescent being colored in. */
export const Mark = ({ size = 40 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
    <path d="M23 6a14 14 0 1 0 11 19A11 11 0 0 1 23 6z" fill="#ffc83d" stroke="#211c17" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M8 33l9-9" stroke="#f2553d" strokeWidth="5" strokeLinecap="round" />
    <path d="M5.5 35.5l2.5-2.5" stroke="#211c17" strokeWidth="5" strokeLinecap="round" />
  </svg>
)
