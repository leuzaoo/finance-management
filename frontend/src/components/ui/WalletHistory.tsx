"use client";

import { useEffect, useState, useCallback } from "react";
import { useTransactionStore } from "@/src/store/useTransactionStore";

import DateRangeSelector from "../common/DateRangeSelection";
import TransactionsList from "./TransactionsList";
import DateFilters from "../common/DateFilters";
import Pagination from "../common/Pagination";

interface Props {
  bankId: string;
}

const PAGE_SIZE = 6;

export default function WalletHistory({ bankId }: Props) {
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
    <div className="mt-4 space-y-4">
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

      <DateFilters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />

      <DateRangeSelector
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        clearFilters={clearFilters}
      />
    </div>
  );
}
