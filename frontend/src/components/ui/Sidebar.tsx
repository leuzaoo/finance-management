"use client";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import React from "react";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  UserSquare2Icon,
  WalletIcon,
} from "lucide-react";

import { LoaderIcon } from "../../assets/icons/LoaderCircleIcon";
import { useAuthStore } from "../../store/useAuthStore";

const menuItems = [
  {
    id: 0,
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    id: 1,
    label: "Cartões",
    href: "/cards",
    icon: <WalletIcon />,
  },
  {
    id: 2,
    label: "Configurações",
    href: "/settings",
    icon: <SettingsIcon />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    await logout();
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <>
      <ToastContainer autoClose={1500} position="top-left" />
      <aside className="flex h-screen w-64 flex-col p-4">
        <div className="flex w-full flex-col font-light">
          <UserSquare2Icon size={60} strokeWidth={1} />
          <div>
            <p>
              Olá,{" "}
              <span className="font-bold capitalize">{user?.firstName}</span>.
            </p>
            <p className="text-light/60 text-xs">{user?.email}</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col justify-between">
          <ul className="mt-4 space-y-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                    pathname === item.href
                      ? "bg-light/10 text-light"
                      : "text-light/60 hover:bg-light/5"
                  } `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {isLoading ? (
            <LoaderIcon />
          ) : (
            <button
              onClick={handleLogout}
              className="mt-auto flex cursor-pointer items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 font-medium hover:bg-red-400"
            >
              Sair
            </button>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
