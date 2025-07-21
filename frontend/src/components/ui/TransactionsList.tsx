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

export default function TransactionsList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return <p className="text-light/60">Nenhuma transação encontrada.</p>;
  }

  return (
    <ul className="space-y-4">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="relative flex flex-col justify-between rounded-lg bg-dark/50 px-4 py-2"
        >
          <div className="flex w-full justify-between">
            <span
              className={`font-zona-pro text-xl font-bold ${
                tx.type === "expense" ? "text-[#d48e62]" : "text-green-600"
              }`}
            >
              {tx.type === "expense" ? "-" : "+"}
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
              className="cursor-pointer p-1 text-light/60 hover:text-red-500"
              title="Deletar transação"
            >
              <Trash2Icon size={16} strokeWidth={1.5} />
            </button>
          </div>

          <p className="font-medium capitalize">
            {getCategoryLabel(tx.category)}
          </p>
          {tx.description && (
            <p className="text-sm font-light text-light/60 first-letter:capitalize">
              {tx.description}
            </p>
          )}

          <span className="absolute bottom-4 right-4 text-xs text-light/50">
            {format(new Date(tx.date), "dd/MM/yyyy")}
          </span>
        </li>
      ))}
    </ul>
  );
}
