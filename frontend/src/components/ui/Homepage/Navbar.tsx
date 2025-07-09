"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

import TitlePage from "../../common/TitlePage";

const menuItems = [
  { id: 0, name: "Início", href: "/" },
  { id: 1, name: "Sobre", href: "/about" },
  { id: 2, name: "Recursos", href: "/resources" },
];

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <div className="text-dark flex items-center justify-between p-4">
        <TitlePage text="FinSafe" />
        <button
          onClick={() => setOpen((o) => !o)}
          className={`p- z-50 cursor-pointer rounded-xl p-2 ${open ? "bg-green-dark/30" : "bg-gray-100"}`}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}
        onClick={() => setOpen(false)}
      />

      <nav
        className={`fixed top-0 right-0 h-full w-64 transform bg-white transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"} `}
        style={{ zIndex: 45 }}
      >
        <div className="mt-14 flex flex-col p-4">
          <div className="space-y-4">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-dark block rounded-xl px-4 py-2 text-lg font-medium transition-colors ${
                    isActive
                      ? "bg-green-dark text-white shadow-md"
                      : "hover:bg-dark/10 text-dark/30 hover:text-dark"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-6 flex gap-4">
            <Link
              href="/login"
              className="bg-green-dark/20 text-dark w-full rounded-lg px-5 py-2 text-center text-sm font-semibold transition-all duration-300 hover:opacity-50"
            >
              Minha conta
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

const DesktopNavbar = () => {
  const pathname = usePathname() || "/";
  return (
    <header className="text-dark hidden bg-white md:block">
      <nav className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <TitlePage text="FinSafe" />
          <div className="flex space-x-4">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`rounded px-4 py-2 transition-colors ${
                    isActive ? "font-bold" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="bg-green-dark/20 rounded-lg px-5 py-2 text-sm"
            >
              Registrar
            </Link>
            <Link
              href="/login"
              className="bg-green-dark rounded-lg px-5 py-2 text-sm text-white"
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default function Navbar() {
  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  );
}
