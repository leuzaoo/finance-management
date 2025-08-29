"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, WalletIcon, UserIcon } from "lucide-react";

const menuItems = [
  { id: 0, href: "/dashboard", Icon: LayoutDashboardIcon, label: "Início" },
  { id: 1, href: "/wallets", Icon: WalletIcon, label: "Cartões" },
  { id: 2, href: "/profile", Icon: UserIcon, label: "Perfil" },
];

export default function BottomNav() {
  const pathname = usePathname() || "/dashboard";

  return (
    <nav
      role="navigation"
      aria-label="Barra de navegação inferior"
      className={[
        "fixed inset-x-0 bottom-0 z-50 2md:hidden",
        "border-t border-black/10 dark:border-white/10",
        "bg-white/95 dark:bg-dark/95",
        "supports-[backdrop-filter:blur(0)]:bg-white/75",
        "supports-[backdrop-filter:blur(0)]:backdrop-blur-md",
        "dark:supports-[backdrop-filter:blur(0)]:bg-dark/60",
      ].join(" ")}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        WebkitBackdropFilter: "blur(2px)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-2 py-2">
        {menuItems.map(({ id, href, Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={id}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex min-w-[88px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span
                aria-hidden
                className={[
                  "absolute inset-0 rounded-xl transition",
                  isActive
                    ? "bg-black/5 dark:bg-white/10"
                    : "opacity-0 group-hover:bg-black/5 group-hover:opacity-100 dark:group-hover:bg-white/5",
                ].join(" ")}
              />
              <Icon
                size={20}
                strokeWidth={1.6}
                className={[
                  "relative transition",
                  isActive
                    ? "text-blue-600 dark:text-sky-400"
                    : "text-black/60 dark:text-white/60",
                ].join(" ")}
              />
              <span
                className={[
                  "relative font-medium tracking-tight",
                  isActive
                    ? "text-blue-700 dark:text-sky-300"
                    : "text-black/60 dark:text-white/60",
                ].join(" ")}
              >
                {label}
              </span>

              <span
                aria-hidden
                className={[
                  "absolute -bottom-0.5 h-1 w-5 rounded-full transition",
                  isActive
                    ? "scale-100 bg-blue-600 dark:bg-sky-400"
                    : "scale-0",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
