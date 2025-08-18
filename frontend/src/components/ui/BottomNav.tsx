"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, WalletIcon, UserIcon } from "lucide-react";

const menuItems = [
  {
    id: 0,
    href: "/dashboard",
    icon: <LayoutDashboardIcon size={32} strokeWidth={1.5} />,
    label: "Início",
  },
  {
    id: 1,
    href: "/wallets",
    icon: <WalletIcon size={32} strokeWidth={1.5} />,
    label: "Cartões",
  },
  {
    id: 2,
    href: "/profile",
    icon: <UserIcon size={32} strokeWidth={1.5} />,
    label: "Perfil",
  },
];

export default function BottomNav() {
  const pathname = usePathname() || "/dashboard";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-dark/10 p-2 backdrop-blur-sm 2md:hidden">
      <h1 className="sr-only">Navbar inferior</h1>
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex w-16 flex-col items-center justify-center rounded-lg py-1 transition-colors ${
              isActive ? "bg-light text-dark" : "text-light hover:bg-light/10"
            } `}
          >
            {item.icon}
            <span className={`text-xs ${isActive && "font-bold"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
