"use client";
import { useTransactionStore } from "@/src/store/useTransactionStore";

type Props = {
  bankId: string;
};

export default function AddTransactionButtons({ bankId }: Props) {
  const { addTransaction } = useTransactionStore();

  return (
    <div className="flex gap-2 pt-4">
      <button
        onClick={() =>
          addTransaction(bankId, {
            type: "expense",
            amount: 50,
            category: "Cinema",
            description: "Ingresso de filme",
            date: new Date(),
          })
        }
        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
      >
        Add despesa R$ 50
      </button>
      <button
        onClick={() =>
          addTransaction(bankId, {
            type: "income",
            amount: 120,
            category: "Salário",
            description: "Recebimento mensal",
            date: new Date(),
          })
        }
        className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
      >
        Add entrada R$ 120
      </button>
    </div>
  );
}
