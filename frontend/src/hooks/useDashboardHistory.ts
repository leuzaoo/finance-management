// src/hooks/useDashboardHistory.ts
import { useEffect, useMemo } from "react";
import { useBankStore } from "@/src/store/useBankStore";
import { useTransactionStore } from "@/src/store/useTransactionStore";
import { buildDashboardChartData, Point } from "@/src/utils/dashboard-chart";

export function useDashboardHistory(): Point[] {
  const { banks, listBanks } = useBankStore();
  const { transactions, listTransactions } = useTransactionStore();

  // 1) carrega bancos → depois para cada banco carrega suas transações
  useEffect(() => {
    listBanks().then(() => {
      banks.forEach((b) => listTransactions(b.id));
    });
  }, [banks.length, listBanks, listTransactions]);

  // 2) monta array com createdAt, saldo inicial e txs ordenadas
  const bankHistories = useMemo(() => {
    return banks.map((b) => {
      const txs = transactions
        .filter((t) => t.bank === b.id)
        .sort(
          (a, z) => new Date(a.date).getTime() - new Date(z.date).getTime(),
        );

      const net = txs.reduce(
        (sum, t) => sum + (t.type === "expense" ? -t.amount : t.amount),
        0,
      );
      const initialBalance = b.currencyValue - net;

      return { createdAt: b.createdAt, initialBalance, transactions: txs };
    });
  }, [banks, transactions]);

  // 3) devolve a série agregada
  return useMemo(() => buildDashboardChartData(bankHistories), [bankHistories]);
}
