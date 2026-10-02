/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fk: {
          blue: '#2874f0',
          darkblue: '#0047ba',
          lightblue: '#f0f5ff',
          yellow: '#ffe500',
          orange: '#ff9f00',
          actionorange: '#fb641b',
          green: '#388e3c',
          bg: '#f1f3f6',
          text: '#212121',
          muted: '#878787',
          border: '#e0e0e0',
          card: '#ffffff',
          footer: '#172337',
          footerbottom: '#212121',
          assurance: '#f4f8ff'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Roboto"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'fk': '0 1px 2px 0 rgba(0,0,0,0.12)',
        'fk-hover': '0 3px 16px 0 rgba(0,0,0,0.11)',
        'fk-modal': '0 4px 20px 0 rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
};
