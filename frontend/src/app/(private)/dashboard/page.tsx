"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import { useReminderStore, type Reminder } from "@/src/store/useReminderStore";
import { useBankStore } from "@/src/store/useBankStore";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import ReminderModal from "@/src/components/forms/ReminderModal";
import RemindersCard from "@/src/components/ui/RemindersCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";
import WalletCard from "@/src/components/ui/WalletCard";

const ALL = "Todas";

export default function DashboardPage() {
  const [currency, setCurrency] = useState<string>(ALL);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRemModalOpen, setRemModalOpen] = useState(false);
  const [editingRem, setEditingRem] = useState<Reminder | undefined>(undefined);

  const { banks, isLoading: banksLoading, listBanks, addBank } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const currencies = [
    ALL,
    ...Array.from(new Set(banks.map((b) => b.currencyType))).sort(),
  ];

  const banksOfCurrency =
    currency === ALL ? banks : banks.filter((b) => b.currencyType === currency);

  const {
    reminders,
    isLoading: remLoading,
    listReminders,
    createReminder,
    updateReminder,
    deleteReminder,
  } = useReminderStore();

  useEffect(() => {
    listReminders();
  }, [listReminders]);

  const handleCreate = async (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => {
    await addBank(data.bankName, data.currencyType, data.initialValue);
    setModalOpen(false);
  };

  if (banksLoading) return <p>Carregando seus bancos…</p>;

  return (
    <>
      <BankModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ReminderModal
        isOpen={isRemModalOpen}
        reminder={editingRem}
        onClose={() => {
          setRemModalOpen(false);
          setEditingRem(undefined);
        }}
        onSubmit={async (data) => {
          if (editingRem) {
            await updateReminder(editingRem._id, data);
          } else {
            await createReminder(data);
          }
          setRemModalOpen(false);
          setEditingRem(undefined);
        }}
        onDelete={async (id) => {
          await deleteReminder(id);
          setRemModalOpen(false);
          setEditingRem(undefined);
        }}
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

      <section className="bg-dark/50 mt-6 w-full max-w-sm rounded-xl p-4">
        <div className="flex items-center justify-between">
          <TitlePage text="Lembretes" />
          <button
            onClick={() => {
              setEditingRem(undefined);
              setRemModalOpen(true);
            }}
          >
            <div className="bg-light text-dark hover:bg-light/80 flex cursor-pointer items-center gap-2 rounded-full p-1">
              <PlusIcon size={20} />
            </div>
          </button>
        </div>
        {remLoading ? (
          <p className="mt-4">Carregando lembretes…</p>
        ) : reminders.length === 0 ? (
          <p className="text-light/60 mt-4">Nenhum lembrete foi adicionado.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {reminders.map((r) => (
              <RemindersCard
                key={r._id}
                reminder={r}
                onClick={(rem) => {
                  setEditingRem(rem);
                  setRemModalOpen(true);
                }}
              />
            ))}
          </ul>
        )}
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
    </>
  );
}
