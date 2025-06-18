"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

import { Bank, useBankStore } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";
import MoneyCard from "@/src/components/ui/MoneyCard";

const DashboardPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
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
    return <p>Carregando seus bancos...</p>;
  }

  return (
    <>
      <BankModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <section>
        <TitlePage text="Dashboard" />

        <DashboardMoneyCard banks={banks} />

        <div className="bg-dark/50 mt-4 max-w-max rounded-lg p-4">
          <div className="flex items-center justify-between">
            <TitlePage text="Meu cartões" />
            <button
              className="bg-light text-dark cursor-pointer rounded-md hover:opacity-80"
              onClick={() => setModalOpen(true)}
            >
              <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium">
                Adicionar
                <PlusCircleIcon size={20} strokeWidth={1.5} />
              </div>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 overflow-auto pb-4">
            {banks.map((bank: Bank) => (
              <Link href={`/wallets/${bank.id}`} key={bank.id}>
                <MoneyCard
                  label={bank.bankName}
                  value={formatCurrency(bank.currencyValue)}
                  currency={bank.currencyType}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
