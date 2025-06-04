"use client";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "lucide-react";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import { useBankStore } from "@/src/store/useBankStore";

import BankModal from "../forms/BankModal";
import WalletCard from "../ui/WalletCard";

export function Wallets() {
  const [modalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const handleCreate = async (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => {
    await addBank(data.bankName, data.currencyType, data.initialValue);
    setModalOpen(false);
  };

  if (isLoading) {
    return <LoaderIcon />;
  }

  return (
    <section>
      <div className="flex max-w-80 items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Cartões</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-light text-dark flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1 text-lg hover:opacity-60"
        >
          Novo <PlusCircleIcon size={20} />
        </button>
      </div>
      <BankModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
      <div className="mt-2 flex w-full flex-wrap gap-4">
        {banks.map((bank) => (
          <WalletCard key={bank.id} bank={bank} />
        ))}
      </div>
    </section>
  );
}
