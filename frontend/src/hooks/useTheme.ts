"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
    } else {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mql.matches ? "light" : "dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
