/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bv: {
          green: 'var(--bv-accent)',
          'green-deep': 'var(--bv-accent-deep)',
          black: '#141414',
          'black-soft': '#1A1A1A',
          card: '#121212',
          white: '#FFFFFF',
          'white-soft': '#E8E8E8',
          'white-ghost': '#9A9A9A',
        },
        primary: {
          DEFAULT: 'var(--bv-accent)',
          foreground: '#000000',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
