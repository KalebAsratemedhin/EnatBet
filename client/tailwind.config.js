/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'kitchen-table': "url('/kitchen-table-bg.jpg')",
        'buffet': "url('/buffet.jpeg')",
        'kitchen-table-2': "url('/cLe5TRIh.jpeg')",
      },
    },
  },
  plugins: [],
}

