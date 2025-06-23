"use client";

import { useEffect } from "react";

import { useBankStore } from "@/src/store/useBankStore";

import WalletCard from "./WalletCard";
import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";

export default function MoneyCard() {
  const { banks, isLoading, listBanks } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  if (isLoading) {
    return <LoaderIcon />;
  }

  return (
    <div className="relative rounded-xl p-4">
      <div className="flex h-full flex-col justify-center">
        {banks.map((bank) => (
          <WalletCard key={bank.id} bank={bank} />
        ))}
      </div>
    </div>
  );
}
