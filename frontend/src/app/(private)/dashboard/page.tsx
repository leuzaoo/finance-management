"use client";
import { useEffect, useState } from "react";
import { PlusIcon, UserCircle2Icon } from "lucide-react";

import { useReminderStore, type Reminder } from "@/src/store/useReminderStore";
import { useUserStore } from "@/src/store/useUserStore";
import { useBankStore } from "@/src/store/useBankStore";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
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
  const { profile: user } = useUserStore();

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

  if (banksLoading) return <LoaderIcon />;

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

      <div className="w-full gap-10 pb-5 lg:grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section>
            <div className="mb-5 flex w-full items-end justify-between">
              <p className="text-lg">
                Olá, <span className="font-bold">{user?.firstName}</span>.
              </p>
              <UserCircle2Icon size={60} strokeWidth={1} />
            </div>

            <DashboardMoneyCard
              banks={banks}
              currency={currency}
              currencies={currencies}
              onCurrencyChange={setCurrency}
              onOpenAdd={() => setModalOpen(true)}
            />
          </section>
        </div>

        <section className="mt-6 w-full max-w-sm rounded-xl lg:mt-0">
          <div className="flex items-center justify-between">
            <TitlePage text="Lembretes" />
            <button
              onClick={() => {
                setEditingRem(undefined);
                setRemModalOpen(true);
              }}
            >
              <div className="flex cursor-pointer items-center gap-2 rounded-full bg-dark p-1 text-light transition-all duration-1000 hover:opacity-60 dark:bg-light dark:text-dark">
                <PlusIcon size={20} />
              </div>
            </button>
          </div>
          {remLoading ? (
            <p className="mt-2">Carregando lembretes…</p>
          ) : reminders.length === 0 ? (
            <p className="mt-2 rounded-xl bg-white p-3 text-dark/50 shadow-md transition-all duration-1000 dark:bg-dark/50 dark:text-light/40">
              Nenhum lembrete adicionado.
            </p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2 rounded-xl bg-white p-3 transition-all duration-1000 dark:bg-dark/50">
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
      </div>
    </>
  );
}
