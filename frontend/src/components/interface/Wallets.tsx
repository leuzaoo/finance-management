"use client";
import { useEffect } from "react";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";

import WalletCard from "../ui/WalletCard";

export function Wallets() {
  const { banks, isLoading, listBanks } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  if (isLoading) {
    return <LoaderIcon />;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Meus Cartões</h1>
      <div className="mt-2 flex w-full flex-wrap gap-4">
        {banks.map((bank: Bank) => (
          <WalletCard key={bank.id} bank={bank} />
        ))}
      </div>
    </section>
  );
}
