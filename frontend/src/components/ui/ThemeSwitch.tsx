"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    }
    return "light";
  });

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <button onClick={toggleTheme} aria-label="Alternar tema claro/escuro">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
