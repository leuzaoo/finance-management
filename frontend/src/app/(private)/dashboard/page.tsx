"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import { useBankStore } from "@/src/store/useBankStore";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";
import WalletCard from "@/src/components/ui/WalletCard";

const ALL = "Todas";

const remindersContent = [
  {
    id: "1",
    title: "Pagar fatura de crédito",
    date: "2023-10-15",
    description: "Não esqueça de pagar a fatura do cartão de crédito.",
  },
  {
    id: "2",
    title: "Vencimento do aluguel",
    date: "2023-10-20",
    description:
      "O aluguel vence no dia 20. Verifique se o pagamento está agendado.",
  },
];

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
        <TitlePage text="Visão geral" />

        <DashboardMoneyCard
          banks={banks}
          currency={currency}
          currencies={currencies}
          onCurrencyChange={setCurrency}
        />
      </section>

      <section className="bg-dark/50 mt-6 max-w-max rounded-xl p-4">
        <div className="flex items-center justify-between">
          <TitlePage text="Cartões" />
          <button onClick={() => setModalOpen(true)} className="cursor-pointer">
            <div className="bg-light text-dark hover:bg-light/80 flex items-center gap-2 rounded-full p-1">
              <PlusIcon size={20} />
            </div>
          </button>
        </div>

        <div className="mt-2 flex flex-nowrap items-start gap-4 overflow-x-auto pb-2">
          {banksOfCurrency.map((bank) => (
            <WalletCard key={bank.id} bank={bank} />
          ))}
        </div>
      </section>

      <section className="bg-dark/50 mt-6 w-full max-w-sm rounded-xl p-4">
        <div className="flex items-center justify-between">
          <TitlePage text="Lembretes" />
          <button className="cursor-pointer">
            <div className="bg-light text-dark hover:bg-light/80 flex items-center gap-2 rounded-full p-1">
              <PlusIcon size={20} />
            </div>
          </button>
        </div>
        {remindersContent.length <= 0 ? (
          "Nenhum lembrete foi adicionado."
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {remindersContent.map((reminder) => (
              <li
                key={reminder.id}
                className="bg-light/10 mb-2 max-w-max cursor-pointer rounded-md px-3 py-1"
              >
                <span>{reminder.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
