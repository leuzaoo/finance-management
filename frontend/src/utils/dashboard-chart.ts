import { toIsoDateString } from "./chart-utils";

export interface Point {
  date: string;
  balance: number;
}

export function buildDashboardChartData(
  createdAt: string,
  initialBalance: number,
  transactions: Array<{
    date: string;
    amount: number;
    type: "expense" | "income";
  }>,
): Point[] {
  const series: Point[] = [
    { date: toIsoDateString(new Date(createdAt)), balance: initialBalance },
  ];

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let running = initialBalance;
  for (const tx of sorted) {
    const delta = tx.type === "expense" ? -tx.amount : tx.amount;
    running += delta;
    series.push({ date: toIsoDateString(new Date(tx.date)), balance: running });
  }

  return series;
}
