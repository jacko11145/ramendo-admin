/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0C0C0C', light: '#1A1A1A' },
        red: { DEFAULT: '#C8201A', dark: '#8B1410', light: '#E63B35' },
        cream: { DEFAULT: '#F0E9D6', dark: '#DDD3B8' },
        'site-white': '#FAFAF7',
        'site-gray': { DEFAULT: '#3A3A3A', light: '#6B6B6B', lighter: '#9B9B9B' },
        sidebar: '#111111',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Noto Sans TC"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
