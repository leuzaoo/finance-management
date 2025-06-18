import { useEffect, useMemo } from "react";

import { useTransactionStore } from "@/src/store/useTransactionStore";
import { buildFullChartData } from "@/src/utils/chart-utils";
import { useBankStore } from "@/src/store/useBankStore";

export function useDashboardHistory() {
  const { banks, listBanks } = useBankStore();
  const { transactions, listTransactions } = useTransactionStore();

  useEffect(() => {
    (async () => {
      await listBanks();
      for (const b of banks) {
        await listTransactions(b.id);
      }
    })();
  }, [banks.length, listBanks, listTransactions]);

  const perBankSeries = useMemo(() => {
    return banks.map((b) => {
      const txs = transactions.filter((t) => t.bank === b.id);
      return buildFullChartData(b.createdAt, b.currencyValue, txs);
    });
  }, [banks, transactions]);

  const mergedSeries = useMemo(() => {
    const map = new Map<string, number>();
    for (const series of perBankSeries) {
      for (const pt of series) {
        map.set(pt.date, (map.get(pt.date) || 0) + pt.balance);
      }
    }
    return Array.from(map.entries())
      .map(([date, balance]) => ({ date, balance }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [perBankSeries]);

  return mergedSeries;
}
