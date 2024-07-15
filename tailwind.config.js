/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'mini':'350px',
        "lt":"400px",
        'xs':'420px',
        'sm': '640px',
        'sm-max': '768px',
        'md': '950px',
        'md-max': '1150px',
        'lg': '1200px',
        'lg-max': '1350px',
        'xl': '1540px',
        'h-sm': { 'raw': '(min-height: 660px)' },
        'h-sm-max': { 'raw': '(min-height: 715px)' },
        'h-md': { 'raw': '(min-height: 790px)' },
        'h-lg': { 'raw': '(min-height: 1024px)' },
        'h-xl': { 'raw': '(min-height: 1280px)' },
      },
      colors: {
        'blue-p':"#291BDB",
        'blue-l':"#392BEC",
        'blue-d':"#1F14AF",
        "blue-d2":"#2619C9",
        'blue-hover':"#F0EFFF",
        "yellow-p":"#D7FF1D",
        "black-l":'#343434',
        "black-2l":'#606060',
      },
      fontFamily: {
        "inter": ["Inter", "sans-serif"],
        "j-sans": ["Josefin Sans", "sans-serif"],
      },
      boxShadow: {
        'card':'0px 4px 40px 0px rgba(0,0,0,0.02)',
        'card-2':'0px 4px 23px 0px rgba(0,0,0,0.07)',
        "top":"0px -8px 10px 0px rgba(0,0,0,0.05)",
        "top-lg":"0px -10px 25px 10px rgba(0,0,0,0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}