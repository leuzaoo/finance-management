"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { PlusCircleIcon } from "lucide-react";

import { useTransactionStore } from "@/src/store/useTransactionStore";
import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";
import {
  buildFullChartData,
  filterChartDataByRange,
} from "@/src/utils/chart-utils";

import TransactionModal from "@/src/components/forms/TransactionModal";
import SubscriptionsCard from "@/src/components/ui/SubscriptionsCard";
import WalletHistory from "@/src/components/ui/WalletHistory";
import BalanceChart from "@/src/components/ui/BalanceChart";
import TitlePage from "@/src/components/common/TitlePage";

interface Props {
  bankId: string;
}

export default function WalletDetailsClient({ bankId }: Props) {
  const router = useRouter();
  const { getBankById, isLoading: isBankLoading } = useBankStore();
  const { transactions, listTransactions } = useTransactionStore();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBank = useCallback(async () => {
    if (!bankId) return;

    try {
      setLoading(true);
      const data = await getBankById(bankId);
      setBank(data);
    } catch (error: unknown) {
      console.error({ message: "Erro ao buscar dados do banco", error });
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

  const loadTransactions = useCallback(() => {
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });
  }, [bankId, fromDate, toDate, listTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredChartData = useMemo(() => {
    if (!bank) {
      return [];
    }

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
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        currencyType={bank.currencyType}
        onSuccess={() => {
          fetchBank();
          loadTransactions();
        }}
      />

      <div className="2md:grid-cols-2 2md:grid gap-8 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <TitlePage text={bank.bankName} />
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold">
                {formatCurrency(bank.currencyValue)}
              </span>
              <span className="text-lg opacity-60">({bank.currencyType})</span>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <span className="text-light/70 font-light">Transações</span>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-light text-dark 2md:text-base flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1 text-sm transition-all duration-200 hover:opacity-60"
            >
              Adicionar <PlusCircleIcon size={20} />
            </button>
          </div>

          <WalletHistory bankId={bankId} />
        </div>

        <div>
          <section>
            <TitlePage text="Histórico da conta" />
            <BalanceChart data={filteredChartData} />
          </section>

          <section className="bg-dark/50 mt-4 rounded-lg p-4">
            <TitlePage text="Assinaturas" />
            <SubscriptionsCard />
          </section>
        </div>
      </div>
    </>
  );
}
