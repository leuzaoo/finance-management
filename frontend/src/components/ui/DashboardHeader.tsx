import React from "react";
import { UserCircle2Icon } from "lucide-react";

import { useUserStore } from "@/src/store/useUserStore";

const DashboardHeader = () => {
  const { profile: user } = useUserStore();

  return (
    <div className="mb-5 flex w-full items-center gap-2">
      <UserCircle2Icon size={52} strokeWidth={1} />
      <p className="text-lg">
        Olá, <span className="font-bold">{user?.firstName}</span>.
      </p>
    </div>
  );
};

export default DashboardHeader;
