import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useTransactionStore } from "@/src/store/useTransactionStore";
import { useBankStore, type Bank } from "@/src/store/useBankStore";
import {
  useSubscriptionStore,
  type Subscription,
} from "@/src/store/useSubscriptionStore";
import {
  buildFullChartData,
  filterChartDataByRange,
} from "@/src/utils/chart-utils";

export function useWalletDetails(bankId: string) {
  const router = useRouter();

  const { getBankById, isLoading: isBankLoading } = useBankStore();
  const {
    transactions,
    listTransactions,
    categorySummary,
    isLoading: isCategoryLoading,
    getCategorySummary,
    deleteTransaction,
  } = useTransactionStore();
  const { listSubscriptions, deleteSubscription } = useSubscriptionStore();

  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

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
    fetchBank();
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });

    getCategorySummary(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });

    listSubscriptions(bankId);
  }, [
    bankId,
    fromDate,
    toDate,
    fetchBank,
    listTransactions,
    getCategorySummary,
    listSubscriptions,
  ]);

  const handleDeleteTx = useCallback(
    async (txId: string) => {
      await deleteTransaction(bankId, txId, {
        from: fromDate ?? undefined,
        to: toDate ?? undefined,
      });
      await fetchBank();
    },
    [bankId, fromDate, toDate, deleteTransaction, fetchBank],
  );

  const handleDeleteSub = useCallback(
    (subId: string) => deleteSubscription(bankId, subId),
    [bankId, deleteSubscription],
  );

  const filteredChartData = useMemo(() => {
    if (!bank) return [];
    const full = buildFullChartData(
      bank.createdAt,
      bank.currencyValue,
      transactions.map(({ date, amount, type }) => ({ date, amount, type })),
    );
    return filterChartDataByRange(full, fromDate, toDate);
  }, [bank, transactions, fromDate, toDate]);

  return {
    bank,
    loading,
    isBankLoading,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    txModalOpen,
    setTxModalOpen,
    subModalOpen,
    setSubModalOpen,
    editingSub,
    setEditingSub,
    transactions,
    categorySummary,
    filteredChartData,
    isCategoryLoading,
    fetchBank,
    listTransactions,
    getCategorySummary,
    listSubscriptions,
    handleDeleteTx,
    handleDeleteSub,
  };
}
