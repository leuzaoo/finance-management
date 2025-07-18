"use client";

import BottomNav from "@/src/components/ui/BottomNav";
import Sidebar from "@/src/components/ui/Sidebar";
import Navbar from "@/src/components/ui/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex-shrink-0">
          <Navbar />
        </header>

        <main className="border-dark/20 2md:pb-0 dark:bg-light/10 dark:border-light/10 flex-1 overflow-y-auto border-t bg-light p-4 pb-20 text-dark transition-all duration-1000 dark:text-light">
          {children}
        </main>
      </div>
      <BottomNav />
    </main>
  );
}
