const config = {
  plugins:
    process.env.NODE_ENV === "development" ? ["@tailwindcss/postcss"] : [],
};

export default config;
