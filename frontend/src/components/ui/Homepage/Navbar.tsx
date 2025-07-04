"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

import TitlePage from "../../common/TitlePage";

const menuItems = [
  {
    id: 0,
    name: "Início",
    href: "/",
  },
  {
    id: 1,
    name: "Sobre",
    href: "/about",
  },
  {
    id: 2,
    name: "Recursos",
    href: "/resources",
  },
];

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);

  const handleCLick = () => {
    setOpen(!open);
  };

  return (
    <div className="text-dark flex items-center justify-between p-4 md:hidden">
      <TitlePage text="FinSafe" />
      <button
        onClick={handleCLick}
        className="bg-light cursor-pointer rounded-xl p-2 shadow-md"
      >
        {open ? <MenuIcon strokeWidth={2.5} /> : <XIcon strokeWidth={2.5} />}
      </button>
    </div>
  );
};

const Navbar = () => {
  const pathname = usePathname() || "/";

  return (
    <>
      <MobileNavbar />
      <header className="hidden md:block">
        <nav className="text-dark p-4">
          <div className="container mx-auto flex items-center justify-between">
            <TitlePage text="FinSafe" />
            <div className="flex space-x-4">
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`rounded px-4 py-2 transition-colors ${
                      isActive ? "font-bold" : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="bg-green-dark/10 rounded-lg px-5 py-2 text-sm"
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
    </>
  );
};

export default Navbar;
