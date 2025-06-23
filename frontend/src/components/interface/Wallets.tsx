"use client";
import { useEffect, useState } from "react";
import { PlusCircleIcon, PlusIcon } from "lucide-react";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import { useBankStore } from "@/src/store/useBankStore";

import BankModal from "../forms/BankModal";
import WalletCard from "../ui/WalletCard";
import TitlePage from "../common/TitlePage";

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
        <TitlePage text="Cartões" />
        <button onClick={() => setModalOpen(true)} className="cursor-pointer">
          <div className="bg-light text-dark hover:bg-light/80 flex items-center gap-2 rounded-full p-1">
            <PlusIcon size={20} />
          </div>
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
