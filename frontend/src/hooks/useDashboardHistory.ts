import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export interface Point {
  date: string;
  balance: number;
}
type Tx = {
  bank: string;
  type: "expense" | "income";
  amount: number;
  date: string;
};
type Bank = {
  _id: string;
  id: string;
  currencyType: string;
  currencyValue: number;
  createdAt: string;
};

const toIso = (d: Date) => {
  d = new Date(d);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

export function useDashboardHistory(currencyFilter?: string): Point[] {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [txMap, setTxMap] = useState<Record<string, Tx[]>>({});

  useEffect(() => {
    axios
      .get<Bank[]>("/api/v1/banks")
      .then((r) => setBanks(r.data.map((b) => ({ ...b, id: b._id }))))
      .catch(console.error);
  }, []);

  useEffect(() => {
    banks
      .filter((b) => !currencyFilter || b.currencyType === currencyFilter)
      .forEach((b) => {
        axios
          .get<Tx[]>(`/api/v1/transactions/${b.id}/history`)
          .then((r) => setTxMap((m) => ({ ...m, [b.id]: r.data })))
          .catch(console.error);
      });
  }, [banks, currencyFilter]);

  return useMemo(() => {
    const byDay = new Map<string, number>();

    banks
      .filter((b) => !currencyFilter || b.currencyType === currencyFilter)
      .forEach((b) => {
        const txs = (txMap[b.id] || [])
          .slice()
          .sort(
            (a, z) => new Date(a.date).getTime() - new Date(z.date).getTime(),
          );

        const net = txs.reduce(
          (s, t) => s + (t.type === "expense" ? -t.amount : t.amount),
          0,
        );

        let running = b.currencyValue - net;

        const start = toIso(new Date(b.createdAt));
        byDay.set(start, (byDay.get(start) || 0) + running);

        txs.forEach((t) => {
          running += t.type === "expense" ? -t.amount : t.amount;
          const day = toIso(new Date(t.date));
          byDay.set(day, (byDay.get(day) || 0) + running);
        });
      });

    return Array.from(byDay.entries())
      .map(([date, balance]) => ({ date, balance }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [banks, txMap, currencyFilter]);
}
