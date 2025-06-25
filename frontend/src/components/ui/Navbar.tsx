"use client";

import React, { useEffect } from "react";
import { UserIcon } from "lucide-react";

import { useUserStore } from "@/src/store/useUserStore";

const Navbar = () => {
  const { profile: user, getProfile } = useUserStore();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <header className="bg-dark hidden h-20 w-full justify-end p-4 lg:flex">
      <div className="flex items-center gap-2">
        <UserIcon size={36} strokeWidth={1.5} />
        <div className="flex flex-col">
          <span>{user?.firstName}</span>
          <span className="text-xs">{user?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
