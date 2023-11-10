/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      orange: {
        500: "#FF6C0A",
        600: "#EC6409",
        700: "#B84900",
      },
      dark: "#2a2a2a",
      light: "#f2f2f2",
      white: "#FFFFFF",
    },
    fontFamily: {
      serif: ["Lora", "ui-serif", "serif"],
    },
  },
  plugins: [],
};
