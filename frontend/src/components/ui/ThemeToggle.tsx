"use client";
import { useTheme } from "@/src/hooks/useTheme";
import { SunIcon, MoonIcon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="rounded-full bg-gray-200 p-2 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
