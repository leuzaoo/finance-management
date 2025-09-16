"use client";
import { useEffect, useState } from "react";
import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";

import { useReminderStore, type Reminder } from "@/src/store/useReminderStore";
import { useBankStore } from "@/src/store/useBankStore";
import {
  useTransactionStore,
  type Transaction,
} from "@/src/store/useTransactionStore";

import { useResolveBankInfo } from "@/src/hooks/useResolveBankInfo";
import { useBanksBalances } from "@/src/hooks/useBanksBalances";
import { useModalState } from "@/src/hooks/useModalState";
import { useFxPolling } from "@/src/hooks/useFxPolling";

import TransactionsSection from "@/src/components/sections/TransactionsSection";
import TransactionInfoCard from "@/src/components/ui/TransactionInfoCard";
import RemindersSection from "@/src/components/sections/RemindersSection";
import DashboardHeader from "@/src/components/ui/DashboardHeader";
import MoneySection from "@/src/components/sections/MoneySection";
import ReminderModal from "@/src/components/forms/ReminderModal";
import BankModal from "@/src/components/forms/BankModal";

const ALL = "Todas";

export default function DashboardPage() {
  const [currency, setCurrency] = useState<string>(ALL);

  const { recentTransactions, listRecentTransactions, isRecentLoading } =
    useTransactionStore();
  const { listBanks, addBank, isLoading: banksLoading } = useBankStore();
  const { listReminders, createReminder, updateReminder, deleteReminder } =
    useReminderStore();

  const { currencies, banks } = useBanksBalances();
  const resolveBankInfo = useResolveBankInfo();
  useFxPolling("BRL");

  const bankModal = useModalState();
  const remModal = useModalState<Reminder>();
  const txModal = useModalState<Transaction>();

  useEffect(() => {
    listRecentTransactions();
  }, [listRecentTransactions]);

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  useEffect(() => {
    listReminders();
  }, [listReminders]);

  const handleCreateBank = async (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => {
    await addBank(data.bankName, data.currencyType, data.initialValue);
    bankModal.onClose();
  };

  if (banksLoading) return <LoaderIcon />;

  return (
    <>
      <BankModal
        isOpen={bankModal.open}
        onClose={bankModal.onClose}
        onSubmit={handleCreateBank}
      />

      <ReminderModal
        isOpen={remModal.open}
        reminder={remModal.data}
        onClose={remModal.onClose}
        onSubmit={async (data) => {
          if (remModal.data) {
            await updateReminder(remModal.data._id, data);
          } else {
            await createReminder(data);
          }
          remModal.onClose();
        }}
        onDelete={async (id) => {
          await deleteReminder(id);
          remModal.onClose();
        }}
      />

      {txModal.open && txModal.data && (
        <TransactionInfoCard
          transaction={txModal.data}
          onClose={txModal.onClose}
          resolveBankInfo={resolveBankInfo}
        />
      )}

      <div className="mx-auto mt-5 w-full max-w-5xl 2md:mt-10">
        <DashboardHeader />
      </div>

      <div className="mx-auto w-full max-w-5xl gap-10 pb-5 2md:mt-10 lg:grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MoneySection
            banks={banks}
            currencies={[ALL, ...currencies]}
            selectedCurrency={currency}
            onCurrencyChange={setCurrency}
            onOpenAdd={bankModal.onOpen}
          />

          <section className="mt-5">
            <TransactionsSection
              transactions={recentTransactions}
              isLoading={isRecentLoading}
              resolveBankInfo={resolveBankInfo}
              onOpen={(tx) => txModal.onOpen(tx)}
            />
          </section>
        </div>

        <section className="mt-6 w-full max-w-sm rounded-xl lg:mt-0">
          <RemindersSection
            onCreate={() => remModal.onOpen(undefined)}
            onEdit={(rem) => remModal.onOpen(rem)}
          />
        </section>
      </div>
    </>
  );
}
