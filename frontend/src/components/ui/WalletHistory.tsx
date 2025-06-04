"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { useTransactionStore } from "@/src/store/useTransactionStore";
import {
  buildFullChartData,
  filterChartDataByRange,
} from "@/src/utils/chart-utils";

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

  const filteredChartData = useMemo(() => {
    const complete = buildFullChartData(
      createdAt,
      initialBalance,
      transactions,
    );

    return filterChartDataByRange(complete, fromDate, toDate);
  }, [transactions, createdAt, initialBalance, fromDate, toDate]);

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

      <div className="2md:grid grid-cols-2 gap-10">
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

        <div>
          <p className="mb-4 text-2xl font-semibold">Histórico da conta</p>
          <BalanceChart data={filteredChartData} />
        </div>
      </div>
    </div>
  );
}
