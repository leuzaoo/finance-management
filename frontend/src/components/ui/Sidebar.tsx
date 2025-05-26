"use client";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  UserSquare2Icon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";

import { LoaderIcon } from "../../assets/icons/LoaderCircleIcon";

const menuItems = [
  {
    id: 0,
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  { id: 1, label: "Cartões", href: "/cards", icon: <WalletIcon /> },
  { id: 2, label: "Configurações", href: "/settings", icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <ToastContainer autoClose={1500} position="top-left" />
      <aside
        className={`bg-dark-light transition-width flex h-screen flex-col overflow-hidden duration-300 ${collapsed ? "w-16" : "w-64"} `}
      >
        <div
          className={`flex w-full ${collapsed ? "justify-center" : "justify-end"}`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="cursor-pointer p-2"
          >
            {collapsed ? (
              <ChevronRightIcon className="text-light" />
            ) : (
              <ChevronLeftIcon className="text-light" />
            )}
          </button>
        </div>

        {!collapsed ? (
          <div className="text-light mt-4 flex flex-col px-4">
            <div className="flex items-end">
              <UserSquare2Icon size={60} strokeWidth={1} />
              <Link
                href="/profile"
                className="flex items-center gap-2 p-2 text-sm"
              >
                Ver perfil <ChevronRightIcon width={16} />
              </Link>
            </div>
            <p className="mt-2">
              Olá,{" "}
              <span className="font-bold capitalize">{user?.firstName}</span>
            </p>
            <p className="text-light/60 text-xs">{user?.email}</p>
          </div>
        ) : (
          ""
        )}

        <nav className="mt-6 flex flex-1 flex-col justify-between">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${collapsed && "justify-center"} ${
                    pathname === item.href
                      ? "bg-light/10 text-light"
                      : "text-light/40 hover:bg-light/5"
                  } `}
                >
                  {item.icon}
                  {!collapsed && (
                    <span
                      className={`font-medium transition-opacity duration-300 ${collapsed ? "pointer-events-none opacity-0 delay-0" : "pointer-events-auto opacity-100 delay-300"}`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mb-4 px-2">
            {isLoading ? (
              <div className="flex justify-center py-2">
                <LoaderIcon />
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center justify-center rounded-md bg-red-600 py-2 hover:bg-red-400"
              >
                {!collapsed ? "Sair" : <LogOutIcon strokeWidth={1.5} />}
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
