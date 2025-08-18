"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, WalletIcon, UserIcon } from "lucide-react";

const menuItems = [
  {
    id: 0,
    href: "/dashboard",
    icon: <LayoutDashboardIcon size={20} strokeWidth={1.5} />,
    label: "Início",
  },
  {
    id: 1,
    href: "/wallets",
    icon: <WalletIcon size={20} strokeWidth={1.5} />,
    label: "Cartões",
  },
  {
    id: 2,
    href: "/profile",
    icon: <UserIcon size={20} strokeWidth={1.5} />,
    label: "Perfil",
  },
];

export default function BottomNav() {
  const pathname = usePathname() || "/dashboard";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white p-2 transition-all duration-1000 dark:bg-dark 2md:hidden">
      <h1 className="sr-only">Navbar inferior</h1>
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex w-16 flex-col items-center justify-center rounded-lg transition-all duration-1000 ${
              isActive
                ? "text-dark dark:text-light"
                : "text-dark/40 hover:bg-light/10 dark:text-light/40 dark:hover:bg-dark/10"
            } `}
          >
            {item.icon}
            <span
              className={`text-[10px] transition-all duration-1000 ${isActive && "font-semibold"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
