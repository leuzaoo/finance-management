"use client";
import { useEffect, useMemo, useState } from "react";
import { PlusIcon, UserCircle2Icon } from "lucide-react";
import { format } from "date-fns";

import { useReminderStore, type Reminder } from "@/src/store/useReminderStore";
import {
  useTransactionStore,
  type Transaction,
} from "@/src/store/useTransactionStore";
import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import { formatCurrency } from "@/src/utils/format-currency";
import { useRatesStore } from "@/src/store/useRatesStore";
import { useUserStore } from "@/src/store/useUserStore";
import { useBankStore } from "@/src/store/useBankStore";
import { sumToBase } from "@/src/utils/sumToBase";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import TransactionInfoCard from "@/src/components/ui/TransactionInfoCard";
import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import TotalCurrencyCard from "@/src/components/ui/totalCurrencyCard";
import ReminderModal from "@/src/components/forms/ReminderModal";
import RemindersCard from "@/src/components/ui/RemindersCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";

const ALL = "Todas";

const fmt = (n: number, c = "BRL") =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: c }).format(n);

export default function DashboardPage() {
  const [currency, setCurrency] = useState<string>(ALL);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRemModalOpen, setRemModalOpen] = useState(false);
  const [editingRem, setEditingRem] = useState<Reminder | undefined>(undefined);
  const { recentTransactions, listRecentTransactions, isRecentLoading } =
    useTransactionStore();
  const {
    base,
    rates,
    updatedAt,
    isLoading: fxLoading,
    error: fxError,
    fetchRates,
  } = useRatesStore();

  const { banks, isLoading: banksLoading, listBanks, addBank } = useBankStore();
  const { profile: user } = useUserStore();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [txModalOpen, setTxModalOpen] = useState(false);

  useEffect(() => {
    fetchRates("BRL");
    const id = setInterval(() => fetchRates("BRL"), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchRates]);

  const balancesByCurrency = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const b of banks) {
      const code = (b.currencyType || "").toUpperCase();
      const val = Number(b.currencyValue || 0);
      if (!code) continue;
      acc[code] = (acc[code] || 0) + val;
    }
    return acc;
  }, [banks]);

  const totalBRL = useMemo(
    () => sumToBase(balancesByCurrency, "BRL", rates),
    [balancesByCurrency, rates],
  );

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

  const resolveBankInfo = (tx: Transaction) => {
    if (tx.bank && typeof tx.bank === "object") {
      const b = tx.bank as any;
      return {
        bankName: b.bankName ?? null,
        bankCurrency: b.currencyType ?? null,
      };
    }

    const bankId =
      typeof tx.bank === "string" ? tx.bank : (tx.bank as any)?._id;
    const found = banks.find((bb) => String(bb.id) === String(bankId));
    return {
      bankName: found?.bankName ?? null,
      bankCurrency: found?.currencyType ?? null,
    };
  };

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

      {txModalOpen && selectedTx && (
        <TransactionInfoCard
          transaction={selectedTx}
          onClose={() => {
            setSelectedTx(null);
            setTxModalOpen(false);
          }}
          resolveBankInfo={resolveBankInfo}
        />
      )}

      <div className="mx-auto w-full max-w-5xl gap-10 pb-5 lg:grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section>
            <h1 className="sr-only">Moeda</h1>
            <div className="mb-5 flex w-full items-end gap-2">
              <UserCircle2Icon size={60} strokeWidth={1} />
              <p className="text-lg">
                Olá, <span className="font-bold">{user?.firstName}</span>.
              </p>
            </div>

            <TotalCurrencyCard />

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
                  const { bankName, bankCurrency } = resolveBankInfo(tx);

                  return (
                    <li
                      key={tx._id}
                      className="cursor-pointer py-2 transition-all duration-200 hover:rounded-xl hover:bg-dark/5 hover:px-3 dark:hover:bg-white/5"
                      onClick={() => {
                        setSelectedTx(tx);
                        setTxModalOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedTx(tx);
                          setTxModalOpen(true);
                        }
                      }}
                    >
                      <div className="flex w-full justify-between">
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
                        <span className="text-xs">{bankName ?? "—"}</span>
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
