import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/ui/Homepage/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
  },
};

export default config;
