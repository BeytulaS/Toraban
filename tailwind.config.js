/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      orange: {
        DEFAULT: "#FF6C0A",
        600: "#EC6409",
        700: "#B84900",
      },
      dark: {
        DEFAULT: "#2a2a2a",
        100: "#4d4d4d",
        200: "#3c3c3c",
        300: "#1a1a1a",
        400: "#0a0a0a",
      },
      light: {
        DEFAULT: "#f2f2f2",
        100: "#f1f1f1",
        200: "#ebebeb",
        300: "#e0e0e0",
        400: "#d6d6d6",
      },
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
      red: "#FF0000",
      yellow: "#FFFF00",
      lime: "#00FF00",
      green: "#008000",
      cyan: "#00FFFF",
      blue: "#0000FF",
      purple: "#800080",
      pink: "#ff007f",
    },
    fontFamily: {
      serif: ["Lora", "ui-serif", "serif"],
    },
  },
  plugins: [],
};
