"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const { deleteSubscription, listSubscriptions } = useSubscriptionStore();
  const { getBankById, isLoading: isBankLoading } = useBankStore();
  const {
    transactions,
    listTransactions,
    getCategorySummary,
    categorySummary,
    isCategoryLoading,
  } = useTransactionStore();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBank = useCallback(async () => {
    if (!bankId) return;
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
    if (!bankId) {
      router.push("/dashboard/wallets");
      return;
    }
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

  const filteredChartData = useMemo(() => {
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
  }, [transactions, bank, fromDate, toDate]);

  if (loading || isBankLoading) {
    return <div>Carregando dados do banco…</div>;
  }
  if (!bank) {
    return <div>Banco não encontrado.</div>;
  }

  return (
    <>
      <ToastContainer autoClose={2000} />

      <TransactionModal
        bankId={bankId}
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
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
        isOpen={subscriptionModalOpen || !!editingSub}
        onClose={() => {
          setSubscriptionModalOpen(false);
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
                  setSubscriptionModalOpen(true);
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
                setSubscriptionModalOpen(true);
              }}
              onDelete={(subId) => deleteSubscription(bankId, subId)}
            />
          </section>
        </div>
      </div>
    </>
  );
}
