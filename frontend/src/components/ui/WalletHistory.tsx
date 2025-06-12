"use client";
import React, { useEffect, useState } from "react";

import { useTransactionStore } from "@/src/store/useTransactionStore";

import DateRangeSelector from "../common/DateRangeSelection";
import TransactionsList from "./TransactionsList";
import DateFilters from "../common/DateFilters";
import Pagination from "../common/Pagination";

export interface WalletHistoryProps {
  bankId: string;
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (d: Date | null) => void;
  setToDate: (d: Date | null) => void;
  onDelete: (txId: string) => Promise<void>;
}

const PAGE_SIZE = 6;

export default function WalletHistory({
  bankId,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onDelete,
}: WalletHistoryProps) {
  const { transactions, isLoading, listTransactions } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });
    setCurrentPage(1);
  }, [bankId, fromDate, toDate, listTransactions]);

  if (isLoading) return <p className="py-4">Carregando histórico…</p>;

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const pageTxs = transactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
        clearFilters={() => {
          setFromDate(null);
          setToDate(null);
        }}
      />

      {pageTxs.length === 0 ? (
        <p className="text-light/60">Nenhuma transação encontrada.</p>
      ) : (
        <>
          <TransactionsList
            bankId={bankId}
            transactions={pageTxs}
            onDelete={onDelete}
          />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              goToPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
