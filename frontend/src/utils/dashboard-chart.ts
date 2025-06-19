// src/utils/dashboard-chart.ts
import {
  toIsoDateString,
  getDateRange,
  groupDeltasByDay,
  getMaxDate,
} from "./chart-utils";

export interface Point {
  date: string;
  balance: number;
}

/**
 * Monta a série histórica agregada de TODOS os bancos,
 * a partir de createdAt, saldo inicial e lista de transações.
 */
export function buildDashboardChartData(
  bankHistories: Array<{
    createdAt: string;
    initialBalance: number;
    transactions: Array<{
      date: string;
      amount: number;
      type: "expense" | "income";
    }>;
  }>,
): Point[] {
  // 1) gera série individual para cada wallet
  const perBankSeries: Point[][] = bankHistories.map(
    ({ createdAt, initialBalance, transactions }) => {
      const start = new Date(createdAt);
      start.setHours(0, 0, 0, 0);

      const maxDate = getMaxDate(transactions);
      const allDates = getDateRange(start, maxDate);
      const deltas = groupDeltasByDay(transactions);

      let running = initialBalance;
      return allDates.map((d) => {
        const iso = toIsoDateString(d);
        if (deltas[iso] != null) running += deltas[iso];
        return { date: iso, balance: running };
      });
    },
  );

  // 2) agrega ponto a ponto somando saldos
  const map = new Map<string, number>();
  perBankSeries.forEach((series) =>
    series.forEach(({ date, balance }) => {
      map.set(date, (map.get(date) || 0) + balance);
    }),
  );

  // 3) ordena e retorna
  return Array.from(map.entries())
    .map(([date, balance]) => ({ date, balance }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
