import React from "react";
import { format } from "date-fns";

import { formatCurrency } from "@/src/utils/format-currency";
import { getCategoryLabel } from "@/src/utils/getCategoryLabels";

import TitlePage from "../common/TitlePage";
import type { Transaction } from "@/src/store/useTransactionStore";

type ResolveBankFn = (tx: Transaction) => {
  bankName: string | null;
  bankCurrency: string | null;
};

type Props = {
  transactions: Transaction[];
  isLoading: boolean;
  resolveBankInfo: ResolveBankFn;
  onOpen: (tx: Transaction) => void;
};

export default function TransactionsSection({
  transactions,
  isLoading,
  resolveBankInfo,
  onOpen,
}: Props) {
  return (
    <>
      <TitlePage text="Transações" />

      {isLoading ? (
        <div className="my-5 space-y-2">
          <div className="h-14 animate-pulse rounded-xl border border-black/10 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/10" />
          <div className="h-14 animate-pulse rounded-xl border border-black/10 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/10" />
          <div className="h-14 animate-pulse rounded-xl border border-black/10 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/10" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="mt-2 rounded-xl border border-black/10 bg-white/70 p-4 text-sm text-black/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          Nenhuma transação recente.
        </div>
      ) : (
        <ul className="mt-2 space-y-2">
          {transactions.map((tx) => {
            const { bankName, bankCurrency } = resolveBankInfo(tx);
            const isExpense = tx.type === "expense";

            return (
              <li
                key={tx._id}
                className="cursor-pointer rounded-xl border border-transparent bg-white/60 p-3 transition-all hover:translate-y-[-1px] hover:border-black/10 hover:bg-white/75 hover:shadow-sm dark:bg-white/10 dark:hover:border-white/15 dark:hover:bg-white/15"
                onClick={() => onOpen(tx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onOpen(tx);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">
                    {getCategoryLabel(tx.category)}
                  </span>

                  <span
                    className={`font-dm_sans text-sm font-bold ${
                      isExpense ? "text-[#d48e62]" : "text-green-600"
                    }`}
                  >
                    {isExpense ? "-" : "+"}
                    {formatCurrency(tx.amount)} {bankCurrency ?? ""}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs opacity-70">
                  <div className="flex items-center gap-1">
                    <span>{isExpense ? "Saiu" : "Entrou"}</span>
                    <span>• {format(new Date(tx.date), "dd/MM/yyyy")}</span>
                  </div>
                  <span className="truncate">{bankName ?? "—"}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
