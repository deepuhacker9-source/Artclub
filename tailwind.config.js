/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        clay: "#C56A47",
        espresso: "#3B2D2F",
        canvas: "#F1E9DB"
      },
      boxShadow: {
        "soft-lift": "0 8px 20px rgba(11,9,8,0.08)"
      }
    },
  },
  plugins: [],
}