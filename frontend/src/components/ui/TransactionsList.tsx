"use client";
import React from "react";
import { Trash2Icon } from "lucide-react";
import { format } from "date-fns";

import { type Transaction } from "@/src/store/useTransactionStore";
import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import { formatCurrency } from "@/src/utils/format-currency";

type Props = {
  bankId: string;
  transactions: Transaction[];
  onDelete: (txId: string) => Promise<void>;
};

const badgeStyles: Record<string, string> = {
  expense:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900",
  income:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900",
};

export default function TransactionsList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center dark:border-white/10">
        <p className="text-lg font-medium">Nenhuma transação encontrada</p>
        <p className="mt-1 text-sm opacity-70">
          Ajuste os filtros de data ou adicione uma nova transação.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map((tx) => {
        const isExpense = tx.type === "expense";
        const amountColor = isExpense ? "text-amber-600" : "text-emerald-600";
        const sign = isExpense ? "-" : "+";

        return (
          <li
            key={tx._id}
            className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 ${isExpense ? "bg-amber-400/80" : "bg-emerald-400/80"}`}
            />

            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-black/5 to-black/0 blur-xl transition duration-300 group-hover:from-black/10 dark:from-white/10 dark:to-transparent" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badgeStyles[tx.type]}`}
                  >
                    {tx.type === "expense" ? "Saída" : "Entrada"}
                  </span>
                  <span className="text-xs text-black/50 dark:text-white/60">
                    {format(new Date(tx.date), "dd/MM/yyyy")}
                  </span>
                </div>

                <p className="mt-1 truncate text-sm font-semibold">
                  {getCategoryLabel(tx.category)}
                </p>

                {tx.description && (
                  <p className="mt-0.5 line-clamp-2 text-sm text-black/60 dark:text-white/70">
                    {tx.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`font-dm_sans text-xl font-bold leading-none ${amountColor}`}
                >
                  {sign}
                  {formatCurrency(tx.amount)}
                </span>

                <button
                  onClick={async () => {
                    if (
                      confirm(
                        `Deseja excluir ${formatCurrency(tx.amount)} | ${getCategoryLabel(tx.category)}?`,
                      )
                    ) {
                      await onDelete(tx._id);
                    }
                  }}
                  className="rounded-md p-1 text-black/50 transition hover:bg-black/5 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white/60 dark:hover:bg-white/10"
                  title="Deletar transação"
                  aria-label="Deletar transação"
                >
                  <Trash2Icon size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
