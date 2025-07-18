"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";

import { useUserStore } from "@/src/store/useUserStore";

import ThemeToggle from "./ThemeSwitch";

const Navbar = () => {
  const { profile: user, getProfile } = useUserStore();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <header className="2md:flex hidden h-20 w-full justify-end bg-light p-4 text-dark transition-all duration-1000 dark:bg-dark dark:text-light">
      <ThemeToggle />
      <Link href="/profile" className="flex items-center gap-2">
        <UserIcon size={36} strokeWidth={1.5} />
        <div className="flex flex-col">
          <span>{user?.firstName}</span>
          <span className="text-xs">{user?.email}</span>
        </div>
      </Link>
    </header>
  );
};

export default Navbar;
