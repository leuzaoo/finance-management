"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, WalletIcon, UserIcon } from "lucide-react";

const menuItems = [
  {
    id: 0,
    href: "/dashboard",
    icon: <LayoutDashboardIcon size={32} strokeWidth={1.5} />,
    label: "Dashboard",
  },
  {
    id: 1,
    href: "/wallets",
    icon: <WalletIcon size={32} strokeWidth={1.5} />,
    label: "Carteiras",
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
    <nav className="bg-dark/10 2md:hidden fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around p-2 backdrop-blur-sm">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center rounded-lg p-1 transition-colors ${
              isActive
                ? "text-light bg-green-800"
                : "hover:bg-light/10 text-green-700"
            } `}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}
