/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: '#3C4A3E',
          50: '#F4F6F3',
          100: '#E5ECE3',
          200: '#C4D3C2',
          300: '#9EB29C',
          400: '#698167',
          500: '#3C4A3E',
          600: '#344136',
          700: '#2A352A',
          800: '#1F2820',
          900: '#151B15',
          dark: '#2C372D',
          light: '#4B5A4D',
        },
        chilly: {
          DEFAULT: '#D82C20',
          hover: '#B51F14',
          light: '#FDECEB',
          surface: '#FFF8F7',
          border: '#FAC7C3',
          dark: '#93180F',
        },
        sage: {
          DEFAULT: '#C4D3C2',
          light: '#E6EDE4',
          tint: '#F0F4EE',
          dark: '#586A56',
        },
        sand: {
          DEFAULT: '#ECDBC2',
          light: '#F7F0E6',
          dark: '#5A4630',
        },
        clay: {
          DEFAULT: '#E2C8B8',
          light: '#F5ECE6',
          dark: '#593B2F',
        },
        charcoal: {
          DEFAULT: '#1D251E',
          light: '#2E3830',
          muted: '#5F6D61',
        },
        canvas: '#F5F6F2',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(60, 74, 62, 0.05)',
        'card': '0 4px 20px 0 rgba(60, 74, 62, 0.07)',
        'hover': '0 10px 30px 0 rgba(60, 74, 62, 0.12)',
        'card-chilly': '0 4px 20px 0 rgba(216, 44, 32, 0.07)',
        'hover-chilly': '0 10px 30px 0 rgba(216, 44, 32, 0.12)',
      }
    },
  },
  plugins: [],
};
