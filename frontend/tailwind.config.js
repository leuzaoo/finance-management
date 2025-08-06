/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  screens: {
    sm: "640px",
    md: "768px",
    "2md": "54rem",
    lg: "1024px",
    xl: "1280px",
  },
  fontFamily: {
    roboto: ["Roboto"],
    inter: ["Inter"],
    "zona-pro": ["Zona Pro"],
    "zona-pro-light": ["Zona Pro Light"],
  },
  extend: {
    colors: {
      dark: "#010101",
      "dark-light": "#1a1e23",
      light: "#eee",
      "green-dark": "#005760",
    },
  },
};
export const plugins = [];
