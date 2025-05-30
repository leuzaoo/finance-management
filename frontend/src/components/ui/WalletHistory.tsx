"use client";
import { useEffect, useState } from "react";

import { useTransactionStore } from "@/src/store/useTransactionStore";

type Props = { bankId: string };

export default function WalletHistory({ bankId }: Props) {
  const { transactions, isLoading, listTransactions, addTransaction } =
    useTransactionStore();
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  useEffect(() => {
    listTransactions(bankId, { from, to });
  }, [bankId, from, to, listTransactions]);

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div>
      <input
        type="date"
        onChange={(e) => setFrom(e.target.valueAsDate || undefined)}
      />
      <input
        type="date"
        onChange={(e) => setTo(e.target.valueAsDate || undefined)}
      />

      <ul>
        {transactions.map((tx) => (
          <li key={tx._id}>
            <span>
              {new Date(tx.date).toLocaleDateString()} –{" "}
              {tx.type === "expense" ? "-" : "+"}
              {tx.amount.toFixed(2)} {tx.category}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          addTransaction(bankId, {
            type: "expense",
            amount: 50,
            category: "Cinema",
            description: "Ingresso",
            date: new Date(),
          })
        }
      >
        Adicionar despesa de R$50
      </button>
    </div>
  );
}
