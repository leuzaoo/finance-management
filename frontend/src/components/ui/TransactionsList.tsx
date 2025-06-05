"use client";
import { formatCurrency } from "@/src/utils/format-currency";
import { Trash2Icon } from "lucide-react";
import { format } from "date-fns";

import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import {
  useTransactionStore,
  type Transaction,
} from "@/src/store/useTransactionStore";

type Props = {
  bankId: string;
  transactions: Transaction[];
};

export default function TransactionsList({ bankId, transactions }: Props) {
  const { deleteTransaction } = useTransactionStore();

  if (transactions.length === 0) {
    return <p className="text-light/60">Nenhuma transação encontrada.</p>;
  }

  return (
    <ul className="space-y-4">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="bg-dark/50 border-light/20 relative flex flex-col justify-between space-y-2 rounded-lg border p-4"
        >
          <div className="flex w-full justify-between">
            <span
              className={`text-2xl font-semibold ${
                tx.type === "expense" ? "text-red-500" : "text-green-600"
              }`}
            >
              {tx.type === "expense" ? "-" : "+"}
              {formatCurrency(tx.amount)}
            </span>

            <button
              onClick={async () => {
                if (
                  confirm(
                    `Confirme a exclusão de ${formatCurrency(
                      tx.amount,
                    )} | ${getCategoryLabel(tx.category)}`,
                  )
                ) {
                  await deleteTransaction(bankId, tx._id);
                  window.location.reload();
                }
              }}
              className="text-light/60 cursor-pointer p-1 hover:text-red-500"
              title="Deletar transação"
            >
              <Trash2Icon size={16} strokeWidth={1.5} />
            </button>
          </div>
          <p className="font-medium capitalize">
            {getCategoryLabel(tx.category)}
          </p>
          {tx.description && (
            <p className="text-light/60 font-light first-letter:capitalize">
              {tx.description}
            </p>
          )}
          <span className="text-light/50 absolute right-4 bottom-4 text-xs font-medium">
            {format(new Date(tx.date), "dd/MM/yyyy")}
          </span>
        </li>
      ))}
    </ul>
  );
}
