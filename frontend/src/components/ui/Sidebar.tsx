"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Wallet,
  LogOut,
  User,
} from "lucide-react";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useUserStore } from "@/src/store/useUserStore";

const MENU = [
  { id: 0, label: "Visão geral", href: "/dashboard", Icon: LayoutDashboard },
  { id: 1, label: "Cartões", href: "/wallets", Icon: Wallet },
  { id: 2, label: "Configurações", href: "/settings", Icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const { logout } = useAuthStore();
  const { profile: user, getProfile } = useUserStore();

  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleLogout = async () => {
    setLeaving(true);
    await logout();
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const widthClass = collapsed ? "w-16" : "w-72";

  return (
    <aside
      className={`hidden h-screen flex-col overflow-hidden bg-white transition-all dark:bg-dark 2md:flex ${widthClass} duration-300`}
    >
      <div className="absolute inset-0 -z-10 hidden bg-[rgba(11,14,18,0.65)] backdrop-blur-md dark:block" />

      <div className="absolute inset-0 -z-10 block backdrop-blur-md dark:hidden" />

      <div className="pointer-events-none absolute inset-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/10 dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] dark:ring-white/10" />

      <div
        className={`flex h-16 items-center ${
          collapsed ? "justify-center" : "justify-end pr-3"
        }`}
      >
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="group rounded-xl border border-black/10 bg-white/60 p-2 text-black/70 backdrop-blur hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 transition-transform group-active:scale-95" />
          ) : (
            <ChevronLeft className="h-5 w-5 transition-transform group-active:scale-95" />
          )}
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-2">
        {MENU.map(({ id, href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={id}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm transition-all ${collapsed ? "justify-center" : ""} ${
                active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/70 hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
              } `}
              title={collapsed ? label : undefined}
            >
              <Icon
                size={active ? 24 : 20}
                strokeWidth={active ? 2 : 1.5}
                className={`${active ? "" : "opacity-80"} shrink-0`}
              />

              {!collapsed && (
                <span
                  className={`truncate transition-opacity ${
                    collapsed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {label}
                </span>
              )}

              <span
                className={`absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full transition-all ${active ? "bg-white dark:bg-black" : "w-0"} `}
              />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 p-2">
        <Link
          href="/profile"
          className={`group relative flex items-center gap-3 rounded-xl border border-black/20 px-3 py-2 text-sm transition-all dark:border-white/20 ${collapsed ? "justify-center" : ""} ${
            isActive("/profile")
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white/50 text-black/80 hover:bg-white/70 dark:bg-white/10 dark:text-white/85 dark:hover:bg-white/15"
          } `}
          title={collapsed ? "Perfil" : undefined}
        >
          <User size={22} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate font-medium">
                {user?.firstName || "Usuário"}
              </div>
              <div className="truncate text-[12px] opacity-70">
                {user?.email || "—"}
              </div>
            </div>
          )}
        </Link>

        <button
          onClick={handleLogout}
          disabled={leaving}
          aria-busy={leaving}
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 ${collapsed ? "py-2" : "py-2"} `}
          title={collapsed ? "Sair" : undefined}
        >
          {leaving ? (
            <LoaderIcon />
          ) : collapsed ? (
            <LogOut size={22} strokeWidth={1.5} />
          ) : (
            <>
              <LogOut size={22} strokeWidth={1.5} />
              Sair
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
