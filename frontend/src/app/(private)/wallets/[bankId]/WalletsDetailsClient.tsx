"use client";
import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ToastContainer } from "react-toastify";
import { PlusCircleIcon } from "lucide-react";

import { useTransactionStore } from "@/src/store/useTransactionStore";
import { useBankStore, type Bank } from "@/src/store/useBankStore";
import {
  useSubscriptionStore,
  type Subscription,
} from "@/src/store/useSubscriptionStore";

import { formatCurrency } from "@/src/utils/format-currency";
import {
  buildFullChartData,
  filterChartDataByRange,
} from "@/src/utils/chart-utils";

import SubscriptionModal from "@/src/components/forms/SubscriptionModal";
import TransactionModal from "@/src/components/forms/TransactionModal";
import SubscriptionsCard from "@/src/components/ui/SubscriptionsCard";
import CategoryBarChart from "@/src/components/ui/CategoryBarChart";
import WalletHistory from "@/src/components/ui/WalletHistory";
import BalanceChart from "@/src/components/ui/BalanceChart";
import TitlePage from "@/src/components/common/TitlePage";

interface Props {
  bankId: string;
}

export default function WalletDetailsClient({ bankId }: Props) {
  const router = useRouter();
  const { listSubscriptions, deleteSubscription } = useSubscriptionStore();
  const { getBankById, isLoading: isBankLoading } = useBankStore();

  const {
    transactions,
    listTransactions,
    getCategorySummary,
    isLoading: isCategoryLoading,
    categorySummary,
  } = useTransactionStore();

  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);


  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [isTxModalOpen, setTxModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBank = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBankById(bankId);
      setBank(data);
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [bankId, getBankById, router]);

  useEffect(() => {
    if (!bankId) return router.push("/dashboard");
    fetchBank();
  }, [bankId, fetchBank, router]);

  useEffect(() => {
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });

    getCategorySummary(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });
  }, [bankId, fromDate, toDate, listTransactions, getCategorySummary]);

  const filteredChartData = React.useMemo(() => {
    if (!bank) return [];
    const fullData = buildFullChartData(
      bank.createdAt,
      bank.currencyValue,
      transactions.map((tx) => ({
        date: tx.date,
        amount: tx.amount,
        type: tx.type,
      })),
    );
    return filterChartDataByRange(fullData, fromDate, toDate);
  }, [bank, transactions, fromDate, toDate]);

  if (loading || isBankLoading) return <div>Carregando dados…</div>;
  if (!bank) return <div>Banco não encontrado.</div>;

  return (
    <>
      <ToastContainer autoClose={2000} />

      <TransactionModal
        bankId={bankId}
        isOpen={isTxModalOpen}
        onClose={() => setTxModalOpen(false)}
        currencyType={bank.currencyType}
        onSuccess={() => {
          fetchBank();
          listTransactions(bankId, {
            from: fromDate ?? undefined,
            to: toDate ?? undefined,
          });
        }}
      />

      <SubscriptionModal
        bankId={bankId}
        isOpen={subModalOpen || !!editingSub}
        onClose={() => {
          setSubModalOpen(false);
          setEditingSub(null);
        }}
        currencyType={bank.currencyType}
        subscriptionToEdit={editingSub ?? undefined}
        onSuccess={() => {
          fetchBank();
          listSubscriptions(bankId);
        }}
      />

      <div className="2md:grid grid-cols-2 gap-8 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <TitlePage text={bank.bankName} />
            <div>
              <span className="text-3xl font-semibold">
                {formatCurrency(bank.currencyValue)}
              </span>{" "}
              <span className="text-lg opacity-60">({bank.currencyType})</span>
            </div>
          </div>


          <div className="mt-4 flex items-end justify-between">
            <span className="text-light/70 font-light">Transações</span>
            <button
              onClick={() => setTransactionModalOpen(true)}
              className="bg-light text-dark flex items-center gap-2 rounded-sm px-3 py-1 text-sm hover:opacity-60"
            >
              Adicionar <PlusCircleIcon size={20} />
            </button>
          </div>

          <WalletHistory
            bankId={bankId}
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </div>

        <div>
          <section className="mt-6">
            <TitlePage text="Histórico da conta" />
            <BalanceChart data={filteredChartData} />
          </section>

          <CategoryBarChart
            data={categorySummary}
            currencyType={bank.currencyType}
            isLoading={isCategoryLoading}
          />

          <section className="bg-dark/50 mt-6 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <TitlePage text="Assinaturas" />
              <button
                onClick={() => {
                  setSubModalOpen(true);
                  setEditingSub(null);
                }}
                className="text-light/50 hover:text-light"
              >
                <PlusCircleIcon />
              </button>
            </div>
            <SubscriptionsCard
              bankId={bankId}
              currencyType={bank.currencyType}
              onEdit={(sub) => {
                setEditingSub(sub);
                setSubModalOpen(true);
              }}
              onDelete={(subId) => deleteSubscription(bankId, subId)}
            />
          </section>
        </div>
      </div>
    </>
  );
}
