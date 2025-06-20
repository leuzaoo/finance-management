// src/utils/dashboard-chart.ts
import { toIsoDateString } from "./chart-utils";

export interface Point {
  date: string;
  balance: number;
}

/**
 * Gera a série de [data, saldo] **só** em transações (mais a data inicial).
 */
export function buildDashboardChartData(
  createdAt: string,
  initialBalance: number,
  transactions: Array<{
    date: string;
    amount: number;
    type: "expense" | "income";
  }>,
): Point[] {
  // 1) ponto inicial
  const series: Point[] = [
    { date: toIsoDateString(new Date(createdAt)), balance: initialBalance },
  ];

  // 2) ordena ascendente por data
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // 3) vai somando/subtraindo e empurrando ponto
  let running = initialBalance;
  for (const tx of sorted) {
    const delta = tx.type === "expense" ? -tx.amount : tx.amount;
    running += delta;
    series.push({ date: toIsoDateString(new Date(tx.date)), balance: running });
  }

  return series;
}
