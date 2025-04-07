/** @type {import('tailwindcss').Config} */
const url = import.meta.env.VITE_CLIENT_URL

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'kitchen-table': `url(${url}/kitchen-table-bg.jpg')`,
        'buffet': `url(${url}/buffet.jpeg')`,
        'kitchen-table-2': `url(${url}/cLe5TRIh.jpeg)`,
      },
    },
  },
  plugins: [],
}

