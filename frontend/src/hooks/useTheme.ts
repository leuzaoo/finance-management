"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
    } else {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mql.matches ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggle };
}
