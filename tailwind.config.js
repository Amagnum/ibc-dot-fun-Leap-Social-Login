/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  safelist: [
    "bg-indigo-400/10",
    "text-indigo-400",
    "bg-blue-400/10",
    "text-blue-400",
    "bg-emerald-400/10",
    "text-emerald-400",
    "border-rose-500",
    "border-emerald-500",
    "border-l-8",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "site-bg": "url('/site-bg.svg')",
        "site-bg-2": "url('/site-bg-2.svg')",
        squiggle: "url('/squiggle.svg')",
      },
      fontFamily: {
        sans: ["Jost", "sans-serif"],
      },
      colors: {
        green: {
          300: '#8CE3BF',
          600: '#29A874',
          800: '#165A3E',
          900: '#0D3525',
        },
        gray: {
          50: '#F4F4F4',
          100: '#E8E8E8',
          200: '#D6D6D6',
          400: '#9E9E9E',
          500: '#858585',
          600: '#696969',
          800: '#383838',
          900: '#212121',
          950: '#141414',
        },
        orange: {
          300: '#FFC770',
          600: '#D17F00',
        },
        black: {
          50: '#0000000F',
          100: '#000000',
          DEFAULT: '#000000'
        },
        white: {
          30: '#FFFFFF1E',
          100: '#FFFFFF',
          DEFAULT: '#FFFFFF'
        },
        custom: {
          terra: '#1B45F5',
          avalanche: '#E84970',
          cosmos: '#754F9C'
        }
      }
    }
  },
  plugins: [],
};
