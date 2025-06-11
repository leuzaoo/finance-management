"use client";
import { useEffect, useState, useCallback } from "react";

import { useTransactionStore } from "@/src/store/useTransactionStore";

import DateRangeSelector from "../common/DateRangeSelection";
import TransactionsList from "./TransactionsList";
import DateFilters from "../common/DateFilters";
import Pagination from "../common/Pagination";

interface Props {
  bankId: string;
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (d: Date | null) => void;
  setToDate: (d: Date | null) => void;
}
const PAGE_SIZE = 6;

export default function WalletHistory({
  bankId,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: Props) {
  const { transactions, isLoading, listTransactions } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);

  const loadTransactions = useCallback(() => {
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });
    setCurrentPage(1);
  }, [bankId, fromDate, toDate, listTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

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

      {isLoading ? (
        <p className="py-4">Carregando histórico…</p>
      ) : paginatedTxs.length === 0 ? (
        <p className="text-light/60">Nenhuma transação encontrada.</p>
      ) : (
        <>
          <TransactionsList transactions={paginatedTxs} bankId={bankId} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              goToPage={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
}
