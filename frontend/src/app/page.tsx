"use client";
import { useEffect } from "react";

import { useTheme } from "../hooks/useTheme";

import HeroSection from "../components/ui/Homepage/HeroSection";
import Navbar from "../components/ui/Homepage/Navbar";

export default function Home() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <main className="text-black bg-white dark:text-white dark:bg-black h-screen w-full">
        <Navbar />
        <HeroSection />
      </main>
    </>
  );
}
