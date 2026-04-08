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
          green: '#00F5A0',
          'green-deep': '#00A854',
          black: '#000000',
          'black-soft': '#0A0A0A',
          card: '#111111',
          white: '#FFFFFF',
          'white-soft': '#E8E8E8',
          'white-ghost': '#9A9A9A',
        },
        primary: {
          DEFAULT: '#00F5A0',
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
