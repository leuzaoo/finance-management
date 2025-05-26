"use client";

import Sidebar from "../../components/ui/Sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-full">
      <div>
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-4 bg-light/10">{children}</main>
    </div>
  );
}
