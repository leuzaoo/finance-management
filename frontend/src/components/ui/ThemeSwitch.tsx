"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", next === "dark");
  root.setAttribute("data-theme", next);
  if (typeof window !== "undefined") {
    const storage = window.localStorage;
    if (storage && typeof storage.setItem === "function") {
      storage.setItem("theme", next);
    }
  }
}

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const initial =
      (root.getAttribute("data-theme") as Theme) ||
      (root.classList.contains("dark") ? "dark" : "light");
    setTheme(initial);
    setMounted(true);

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "theme" &&
        (e.newValue === "dark" || e.newValue === "light")
      ) {
        setTheme(e.newValue as Theme);
        applyTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema claro/escuro"
      title={theme === "dark" ? "Mudar para claro" : "Mudar para escuro"}
      className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-sm backdrop-blur hover:bg-black/5 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
