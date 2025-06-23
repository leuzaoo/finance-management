"use client";

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

        <main className="bg-light/10 border-light/10 flex-1 overflow-y-auto border-t p-4">
          {children}
        </main>
      </div>
    </main>
  );
}
