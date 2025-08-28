"use client";
import React, { useEffect, useMemo, useState } from "react";

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

const PAGE_SIZE = 20;

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

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const pageTxs = useMemo(
    () =>
      transactions.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [transactions, currentPage],
  );

  return (
    <div className="mt-4 space-y-4 2md:mt-0">
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

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-black/5 bg-white/60 dark:border-white/10 dark:bg-white/5"
            />
          ))}
        </div>
      ) : pageTxs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center dark:border-white/10">
          <p className="text-lg font-medium">Nenhuma transação encontrada</p>
          <p className="mt-1 text-sm opacity-70">
            Tente ajustar o período nos filtros acima.
          </p>
        </div>
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
