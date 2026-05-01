/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        artPurple: "#6C5CE7",
        artOrange: "#FF793F",
        artBlue: "#0984E3",
        artGreen: "#00B894",
        artDark: "#121212",
      },
      fontFamily: {
        editorial: ["Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}