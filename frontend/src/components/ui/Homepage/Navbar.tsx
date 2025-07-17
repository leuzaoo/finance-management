"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

import TitlePage from "../../common/TitlePage";
import ThemeToggle from "../ThemeSwitch";

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
      <div className="flex items-center justify-between p-4 text-dark">
        <Link href="/" className="dark:text-light">
          <TitlePage text="FinSafe" />
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`z-50 cursor-pointer rounded-xl p-2 shadow-sm ${open ? "bg-green-dark/30 dark:bg-light" : "bg-gray-100"}`}
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
        className={`fixed right-0 top-0 h-full w-64 transform bg-white transition-transform duration-300 dark:bg-dark ${open ? "translate-x-0" : "translate-x-full"} `}
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
                  className={`block rounded-xl px-4 py-2 text-lg font-medium text-dark transition-colors ${
                    isActive
                      ? "bg-green-dark text-light shadow-md dark:bg-light dark:text-dark"
                      : "hover:bg-dark/10 text-dark/30 dark:text-light/50 hover:text-dark"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full rounded-lg bg-green-dark px-5 py-2 text-center text-sm font-semibold text-light transition-all duration-300 hover:opacity-50 dark:bg-light dark:text-dark"
            >
              Minha conta
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
};

const DesktopNavbar = () => {
  const pathname = usePathname() || "/";
  return (
    <header className="mx-auto hidden max-w-7xl text-dark md:block">
      <nav className="p-4">
        <div className="mx-auto flex items-center justify-between">
          <Link href="/" className="dark:text-light">
            <TitlePage text="FinSafe" />
          </Link>
          <div className="flex space-x-4">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`rounded px-4 py-2 transition-colors dark:text-light ${
                    isActive ? "font-bold" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/register"
              className="rounded-lg bg-white px-5 py-2 text-sm shadow-sm"
            >
              Registrar
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-green-dark px-5 py-2 text-sm text-white shadow-sm"
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
