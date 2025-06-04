"use client";
import { useEffect, useState, useCallback, useMemo } from "react";

import { useTransactionStore } from "@/src/store/useTransactionStore";

import DateRangeSelector from "../common/DateRangeSelection";
import TransactionsList from "./TransactionsList";
import DateFilters from "../common/DateFilters";
import Pagination from "../common/Pagination";
import BalanceChart from "./BalanceChart";

interface Props {
  bankId: string;
  initialBalance: number;
  createdAt: string;
}

const PAGE_SIZE = 6;

export default function WalletHistory({
  bankId,
  initialBalance,
  createdAt,
}: Props) {
  const { transactions, isLoading, listTransactions } = useTransactionStore();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const load = useCallback(() => {
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });
    setCurrentPage(1);
  }, [bankId, fromDate, toDate, listTransactions]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = useMemo(() => {
    const startDate = new Date(createdAt);
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let maxDate = new Date(today);

    for (const tx of transactions) {
      const txDateObj = new Date(tx.date);
      txDateObj.setHours(0, 0, 0, 0);
      if (txDateObj.getTime() > maxDate.getTime()) {
        maxDate = txDateObj;
      }
    }

    const dates: Date[] = [];
    for (
      let d = new Date(startDate);
      d.getTime() <= maxDate.getTime();
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }

    type DeltaMap = Record<string, number>;
    const deltasByDay: DeltaMap = {};
    for (const tx of transactions) {
      const [isoDay] = tx.date.split("T");
      const delta = tx.type === "expense" ? -tx.amount : tx.amount;
      if (!deltasByDay[isoDay]) {
        deltasByDay[isoDay] = delta;
      } else {
        deltasByDay[isoDay] += delta;
      }
    }

    let sumAllDeltas = 0;
    for (const value of Object.values(deltasByDay)) {
      sumAllDeltas += value;
    }
    const balanceAtCreation = initialBalance - sumAllDeltas;

    let runningBalance = balanceAtCreation;
    const result: Array<{ date: string; balance: number }> = [];

    for (const dateObj of dates) {
      const isoDay = dateObj.toISOString().split("T")[0];

      if (deltasByDay[isoDay] !== undefined) {
        runningBalance += deltasByDay[isoDay];
      }

      result.push({
        date: isoDay,
        balance: runningBalance,
      });
    }

    return result;
  }, [transactions, createdAt, initialBalance]);

  if (isLoading) {
    return <p className="py-4">Carregando histórico…</p>;
  }

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginatedTxs = transactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  return (
    <div className="space-y-6">
      <DateRangeSelector
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        clearFilters={clearFilters}
      />

      <DateFilters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />

      <div className="2md:grid-cols-2 grid gap-10">
        <div>
          <TransactionsList transactions={paginatedTxs} bankId={bankId} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              goToPage={goToPage}
            />
          )}
        </div>

        <div className="">
          <p className="mb-4 text-2xl font-semibold">Histórico da conta</p>

          <BalanceChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
