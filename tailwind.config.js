/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#2c5282',
          50: '#ebf4ff',
          100: '#c9ddf8',
          200: '#a7c6f0',
          300: '#85afe8',
          400: '#6398e0',
          500: '#4181d7',
          600: '#2c5282',
          700: '#1e3e6a',
          800: '#102952',
          900: '#02153a',
        },
        'accent': {
          DEFAULT: '#4a5568',
          light: '#a0aec0',
        },
        'background': '#f7fafc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'card': '0.5rem',
      },
    },
  },
  plugins: [],
}; 