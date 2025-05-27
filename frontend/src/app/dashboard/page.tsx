"use client";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useBankStore, Bank } from "../../store/useBankStore";
import { formatCurrency } from "../../utils/format-currency";

import BankModal from "../../components/forms/BankModal";
import MoneyCard from "../../components/ui/MoneyCard";

const DashboardPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  console.log(banks);

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
            <div key={bank.bankName}>
              <MoneyCard
                label={bank.bankName}
                value={formatCurrency(bank.currencyValue)}
                currency={bank.currencyType}
              />
            </div>
          ))}

          <div
            className="bg-light/10 h-24 min-w-56 rounded-xl"
            onClick={() => setModalOpen(true)}
          >
            <div className="flex flex-col p-3">
              <div className="text-light/50 mt-2 flex flex-col items-center gap-1">
                Adicionar cartão
                <PlusCircleIcon />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
