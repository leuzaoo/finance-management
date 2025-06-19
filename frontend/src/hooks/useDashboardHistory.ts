// src/hooks/useDashboardHistory.ts
import { useEffect, useMemo } from "react";
import { useBankStore } from "@/src/store/useBankStore";
import { useTransactionStore } from "@/src/store/useTransactionStore";
import { buildFullChartData } from "@/src/utils/chart-utils";

export function useDashboardHistory() {
  const { banks, listBanks } = useBankStore();
  const { transactions, listTransactions } = useTransactionStore();

  // 1) Carrega bancos e transações
  useEffect(() => {
    (async () => {
      await listBanks();
      for (const b of banks) {
        await listTransactions(b.id);
      }
    })();
  }, [banks.length, listBanks, listTransactions]);

  // 2) Para cada banco, calcula saldo inicial e série histórica
  const perBankSeries = useMemo(() => {
    return banks.map((b) => {
      // filtra as transações desse banco e ordena ASC por data
      const txs = transactions
        .filter((t) => t.bank === b.id)
        .sort((a, z) => new Date(a.date).getTime() - new Date(z.date).getTime());

      // calcula o efeito líquido de todas as txs: receitas são +, despesas são -
      const netTx = txs.reduce(
        (acc, t) => acc + (t.type === "expense" ? -t.amount : t.amount),
        0
      );

      // saldo inicial = saldo atual - soma líquida das txs
      const initialBalance = b.currencyValue - netTx;

      // gera a série histórica corretamente
      return buildFullChartData(b.createdAt, initialBalance, txs);
    });
  }, [banks, transactions]);

  // 3) mescla ponto a ponto somando os saldos de todas as carteiras
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
