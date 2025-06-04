export function toIsoDateString(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function groupDeltasByDay(
  transactions: Array<{
    date: string;
    amount: number;
    type: "expense" | "income";
  }>,
): Record<string, number> {
  const deltas: Record<string, number> = {};
  for (const tx of transactions) {
    const isoDay = tx.date.split("T")[0];
    const delta = tx.type === "expense" ? -tx.amount : tx.amount;
    deltas[isoDay] = (deltas[isoDay] || 0) + delta;
  }
  return deltas;
}

export function getMaxDate(
  transactions: Array<{
    date: string;
  }>,
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let maxDate = new Date(today);
  for (const tx of transactions) {
    const d = new Date(tx.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() > maxDate.getTime()) {
      maxDate = d;
    }
  }
  return maxDate;
}

export function buildFullChartData(
  createdAt: string,
  initialBalance: number,
  transactions: Array<{
    date: string;
    amount: number;
    type: "expense" | "income";
  }>,
): Array<{ date: string; balance: number }> {
  const startDate = new Date(createdAt);
  startDate.setHours(0, 0, 0, 0);

  const maxDate = getMaxDate(transactions);

  const allDates = getDateRange(startDate, maxDate);

  const deltasByDay = groupDeltasByDay(transactions);

  let totalDeltas = 0;
  for (const v of Object.values(deltasByDay)) {
    totalDeltas += v;
  }
  const balanceAtCreation = initialBalance - totalDeltas;

  const result: Array<{ date: string; balance: number }> = [];
  let runningBalance = balanceAtCreation;

  for (const dateObj of allDates) {
    const isoDay = toIsoDateString(dateObj);
    if (deltasByDay[isoDay] !== undefined) {
      runningBalance += deltasByDay[isoDay];
    }
    result.push({
      date: isoDay,
      balance: runningBalance,
    });
  }

  return result;
}

export function filterChartDataByRange(
  chartData: Array<{ date: string; balance: number }>,
  fromDate: Date | null,
  toDate: Date | null,
): Array<{ date: string; balance: number }> {
  if (!fromDate && !toDate) {
    return chartData;
  }

  const fromIso = fromDate ? toIsoDateString(new Date(fromDate)) : null;
  const toIso = toDate ? toIsoDateString(new Date(toDate)) : null;

  return chartData.filter((point) => {
    const day = point.date;
    if (fromIso && day < fromIso) return false;
    if (toIso && day > toIso) return false;
    return true;
  });
}
