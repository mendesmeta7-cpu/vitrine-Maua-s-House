/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'maua-bg': '#fafaf9', // stone-50
        'maua-text': '#292524', // stone-800
        'maua-primary': '#fb7185', // rose-400
        'maua-primary-dark': '#e11d48', // rose-600
        'maua-dark': '#1c1917', // stone-900
        'maua-light': '#fff1f2', // rose-50
        'maua-green': '#047857', // emerald-700
        'maua-gold': '#fde68a', // amber-200
        'maua-accent': '#e7e5e4', // stone-200
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
