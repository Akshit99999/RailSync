/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ir-navy': '#091730',
        'ir-navy-dark': '#050d1c',
        'ir-navy-surface': '#0f2244',
        'station-yellow': '#ffd200',
        'signal-green': '#10b981',
        'signal-amber': '#f59e0b',
        'signal-red': '#ef4444',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
