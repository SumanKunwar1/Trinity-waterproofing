/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#293855",
        primary: "#4165D5",
        secondary: "#F1AC20",
        tertiary: "#ffbf00",
        button: "#9CBBFC",
        hover: "#F6E8DF",
      },
    },
  },
  plugins: ["tailwindcss-animate"],
};