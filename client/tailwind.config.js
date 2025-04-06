/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'kitchen-table': "url('http://localhost:3000/kitchen-table-bg.jpg')",
        'buffet': "url('http://localhost:3000/buffet.jpeg')",
        'kitchen-table-2': "url('http://localhost:3000/cLe5TRIh.jpeg')",
      },
    },
  },
  plugins: [],
}

