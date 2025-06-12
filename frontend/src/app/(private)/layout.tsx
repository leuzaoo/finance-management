"use client";

import Sidebar from "@/src/components/ui/Sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="bg-light/10 flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
