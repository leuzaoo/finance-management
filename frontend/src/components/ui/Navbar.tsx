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
    <header className="bg-dark hidden h-20 w-full justify-end p-4 lg:flex">
      <Link href="/profile" className="flex items-center gap-2">
        <ThemeToggle />
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
