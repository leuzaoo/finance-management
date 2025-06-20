"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

import { useDashboardHistory } from "@/src/hooks/useDashboardHistory";
import { Bank, useBankStore } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import BalanceChart from "@/src/components/ui/BalanceChart";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";
import MoneyCard from "@/src/components/ui/MoneyCard";

const DashboardPage = () => {
  const [currency, setCurrency] = useState<"BRL" | "USD" | "GBP">("BRL");

  const history = useDashboardHistory(currency);

  const [isModalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const banksOfCurrency = banks.filter((b) => b.currencyType === currency);

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
          onCurrencyChange={setCurrency}
        />

        <div className="bg-dark/50 mt-4 max-w-full rounded-lg p-4">
          <div className="flex items-center gap-4 overflow-auto pb-4">
            {banksOfCurrency.map((bank: Bank) => (
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

          <div className="bg-dark/50 mt-6 rounded-lg p-4">
            <BalanceChart data={history} />
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
