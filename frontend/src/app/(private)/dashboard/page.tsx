"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

import { useBankStore } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";
import MoneyCard from "@/src/components/ui/MoneyCard";

const ALL = "Todas";

export default function DashboardPage() {
  const [currency, setCurrency] = useState<string>(ALL);

  const [isModalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const currencies = [
    ALL,
    ...Array.from(new Set(banks.map((b) => b.currencyType))).sort(),
  ];

  const banksOfCurrency =
    currency === ALL ? banks : banks.filter((b) => b.currencyType === currency);

  const handleCreate = async (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => {
    await addBank(data.bankName, data.currencyType, data.initialValue);
    setModalOpen(false);
  };

  if (isLoading) return <p>Carregando seus bancos…</p>;

  return (
    <>
      <BankModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <section>
        <TitlePage text="Dashboard" />
        <DashboardMoneyCard
          banks={banks}
          currency={currency}
          currencies={currencies}
          onCurrencyChange={setCurrency}
        />

        <section className="max-w-max rounded-lg py-4">
          <TitlePage text="Meus cartões" />
          <div className="mt-2 flex items-center gap-4 overflow-auto pb-2">
            {banksOfCurrency.map((bank) => (
              <Link href={`/wallets/${bank.id}`} key={bank.id}>
                <MoneyCard
                  label={bank.bankName}
                  value={formatCurrency(bank.currencyValue)}
                  currency={bank.currencyType}
                />
              </Link>
            ))}
            <button
              className="bg-light/10 h-24 min-w-[12rem] cursor-pointer rounded-xl hover:opacity-80"
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
      </section>
    </>
  );
}
