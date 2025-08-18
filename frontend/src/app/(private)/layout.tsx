"use client";

import BottomNav from "@/src/components/ui/BottomNav";
import Sidebar from "@/src/components/ui/Sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto border-t border-dark/20 bg-light p-4 pb-20 text-dark transition-all duration-1000 dark:border-light/10 dark:bg-light/10 dark:text-light 2md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </main>
  );
}
