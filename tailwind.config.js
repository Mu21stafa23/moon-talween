/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fffdf6',
        sand: '#f3ecdc',
        ink: '#211c17',
        mute: '#6b6258',
        crayon: { red: '#f2553d', deep: '#d83f28', yellow: '#ffc83d', green: '#43b972', blue: '#3aa0ee', sky: '#e3f1ff', purple: '#8b63f0', pink: '#ff8db8' },
      },
      fontFamily: {
        sans: ['"Baloo Bhaijaan 2"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        hard: '4px 4px 0 #211c17',
        'hard-lg': '6px 6px 0 #211c17',
      },
    },
  },
  plugins: [],
}
