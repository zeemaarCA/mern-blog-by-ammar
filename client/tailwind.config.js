const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar'), require('@tailwindcss/typography'), require('@tailwindcss/forms'),],
}