"use client";

import HeroSection from "../components/ui/Homepage/HeroSection";
import Navbar from "../components/ui/Homepage/Navbar";

export default function Home() {
  return (
    <>
      <main className="h-screen w-full bg-light text-dark dark:bg-white/10 dark:text-white">
        <Navbar />
        <HeroSection />
      </main>
    </>
  );
}
