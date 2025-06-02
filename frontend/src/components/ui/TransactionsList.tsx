"use client";
import { formatCurrency } from "@/src/utils/format-currency";
import { format } from "date-fns";

type Transaction = {
  _id: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  category: string;
  description?: string;
  date: string;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionsList({ transactions }: Props) {
  if (transactions.length === 0) {
    return <p className="text-light/60">Nenhuma transação encontrada.</p>;
  }

  return (
    <ul className="space-y-4">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="bg-dark border-light/20 flex flex-col justify-between space-y-2 rounded-lg border p-4"
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
            <p className="text-light/50 text-sm">
              {format(new Date(tx.date), "dd/MM/yyyy")}
            </p>
          </div>
          <p className="font-medium capitalize">{tx.category}</p>
          {tx.description && (
            <p className="text-light/60 font-light first-letter:capitalize">
              {tx.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
