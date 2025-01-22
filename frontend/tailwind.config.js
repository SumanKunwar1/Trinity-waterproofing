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
    keyframes: {
      scroll: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
    animation: {
      scroll: "scroll 20s linear infinite",
    },
  },
  plugins: ["tailwindcss-animate", require("@tailwindcss/typography")],
};
