/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "var(--color-dark)",
        "dark-light": "var(--color-dark-light)",
        light: "var(--color-light)",
        "green-dark": "var(--color-green-dark)",
      },
    },
  },
  plugins: [],
};
