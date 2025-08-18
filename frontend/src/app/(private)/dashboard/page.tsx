"use client";
import { useEffect, useState } from "react";
import { PlusIcon, UserCircle2Icon } from "lucide-react";
import { format } from "date-fns";

import { useReminderStore, type Reminder } from "@/src/store/useReminderStore";
import { useTransactionStore } from "@/src/store/useTransactionStore";
import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import { formatCurrency } from "@/src/utils/format-currency";
import { useUserStore } from "@/src/store/useUserStore";
import { useBankStore } from "@/src/store/useBankStore";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import ReminderModal from "@/src/components/forms/ReminderModal";
import RemindersCard from "@/src/components/ui/RemindersCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";

const ALL = "Todas";

export default function DashboardPage() {
  const [currency, setCurrency] = useState<string>(ALL);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRemModalOpen, setRemModalOpen] = useState(false);
  const [editingRem, setEditingRem] = useState<Reminder | undefined>(undefined);
  const { recentTransactions, listRecentTransactions, isRecentLoading } =
    useTransactionStore();

  const { banks, isLoading: banksLoading, listBanks, addBank } = useBankStore();
  const { profile: user } = useUserStore();

  useEffect(() => {
    listRecentTransactions();
  }, [listRecentTransactions]);

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  const currencies = [
    ALL,
    ...Array.from(new Set(banks.map((b) => b.currencyType))).sort(),
  ];

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

      <div className="mx-auto w-full max-w-5xl gap-10 pb-5 lg:grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section>
            <h1 className="sr-only">Moeda</h1>
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

          <section className="mt-5">
            <TitlePage text="Transações" />
            {isRecentLoading ? (
              <p className="my-5">Carregando transações…</p>
            ) : recentTransactions.length === 0 ? (
              <p className="my-5 text-dark/50">Nenhuma transação recente.</p>
            ) : (
              <ul className="my-5 space-y-3">
                {recentTransactions.map((tx) => {
                  let bankCurrency: string | undefined;

                  if (tx.bank && typeof tx.bank === "object") {
                    bankCurrency = (tx.bank as any).currencyType;
                  } else if (typeof tx.bank === "string") {
                    const b = banks.find(
                      (bb) => bb.id === tx.bank || bb.id === tx.bank,
                    );
                    bankCurrency = b?.currencyType;
                  }

                  return (
                    <li key={tx._id} className="py-2">
                      <div className="flex w-full justify-between font-inter">
                        <span className="font-semibold">
                          {getCategoryLabel(tx.category)}
                        </span>
                        <span className="font-semibold">
                          <span className="font-zona-pro font-bold">
                            {formatCurrency(tx.amount)}
                          </span>{" "}
                          {bankCurrency ?? ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-light">
                            {tx.type === "expense" ? "Saiu" : "Entrou"}
                          </span>
                          <span className="text-xs font-light">
                            • {format(new Date(tx.date), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <span className="text-xs">
                          {(tx.bank as any)?.bankName ?? "—"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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
