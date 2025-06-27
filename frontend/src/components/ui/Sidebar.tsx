"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "@/src/store/useUserStore";

import { LoaderIcon } from "../../assets/icons/LoaderCircleIcon";

const menuItems = [
  {
    id: 0,
    label: "Visão geral",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  { id: 1, label: "Cartões", href: "/wallets", icon: <WalletIcon /> },
  { id: 2, label: "Configurações", href: "/settings", icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { logout, isLoading } = useAuthStore();
  const { profile: user, getProfile } = useUserStore();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`border-light/20 transition-width 2md:flex hidden h-screen flex-col overflow-hidden border-r duration-300 ${collapsed ? "w-16" : "w-64"}`}
      >
        <h1 className="sr-only">Menu</h1>
        <div
          className={`border-light/20 flex w-full border-b ${collapsed ? "justify-center" : "justify-end"}`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="h-20 cursor-pointer"
          >
            {collapsed ? (
              <ChevronRightIcon className="text-light" />
            ) : (
              <ChevronLeftIcon className="text-light" />
            )}
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-light/10 text-light"
                        : "text-light/40 hover:bg-light/5"
                    }`}
                  >
                    {item.icon}
                    {!collapsed && (
                      <span
                        className={`font-medium transition-opacity duration-300 ${
                          collapsed
                            ? "pointer-events-none opacity-0 delay-0"
                            : "pointer-events-auto opacity-100 delay-300"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mb-4 px-2">
            {isLoading ? (
              <div className="flex justify-center py-2">
                <LoaderIcon />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 rounded-md p-2 transition-colors lg:hidden ${
                    collapsed ? "justify-center" : ""
                  } ${
                    pathname.startsWith("/profile")
                      ? "bg-light/10 text-light"
                      : "text-light/40 hover:bg-light/10"
                  }`}
                >
                  <UserIcon size={32} strokeWidth={1.5} />
                  {!collapsed && (
                    <div className="flex flex-col">
                      <span
                        className={`font-medium transition-opacity duration-300 ${
                          collapsed
                            ? "pointer-events-none opacity-0 delay-0"
                            : "pointer-events-auto opacity-100 delay-300"
                        }`}
                      >
                        {user?.firstName}
                      </span>
                      <span className="text-xs">{user?.email}</span>
                    </div>
                  )}
                </Link>
                <button
                  title="Sair da conta"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center justify-center rounded-md bg-red-600 py-2 hover:bg-red-400"
                >
                  {!collapsed ? "Sair" : <LogOutIcon strokeWidth={1.5} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
