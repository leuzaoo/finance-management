"use client";
import { useEffect, useMemo, useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

import { Bank, useBankStore } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import BankModal from "@/src/components/forms/BankModal";
import MoneyCard from "@/src/components/ui/MoneyCard";

const DashboardPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const totalBalance = useMemo(() => {
    return banks.reduce((sum, b) => sum + b.currencyValue, 0);
  }, [banks]);

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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
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

          <button
            className="bg-light/10 h-24 min-w-56 cursor-pointer rounded-xl hover:opacity-80"
            onClick={() => setModalOpen(true)}
          >
            <div className="flex flex-col p-3">
              <div className="text-light/50 mt-2 flex flex-col items-center gap-1">
                Adicionar cartão
                <PlusCircleIcon />
              </div>
            </div>
          </button>
        </div>
      </section>

      <DashboardMoneyCard totalBalance={totalBalance} />
    </>
  );
};

export default DashboardPage;
