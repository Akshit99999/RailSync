/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'station-yellow': {
          DEFAULT: '#ffd200',
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#ffd200',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          dim: '#cba800',
          hover: '#f5c500',
        },
        'rail-black': '#000000',
        'rail-dark': '#09090b',
        'rail-surface': '#121215',
        'rail-elevated': '#18181b',
        'rail-border-dark': '#27272a',
        'rail-border-light': '#e2e8f0',
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
