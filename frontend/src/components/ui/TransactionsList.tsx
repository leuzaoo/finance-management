"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { format } from "date-fns";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import { formatCurrency } from "@/src/utils/format-currency";
import {
  useTransactionStore,
  type Transaction,
} from "@/src/store/useTransactionStore";

type Props = {
  bankId: string;
  transactions: Transaction[];
};

export default function TransactionsList({ bankId, transactions }: Props) {
  const router = useRouter();
  const { listTransactions, deleteTransaction } = useTransactionStore();
  const { getBankById } = useBankStore();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState<Bank | null>(null);

  const fetchBank = useCallback(async () => {
    if (!bankId) return;
    setLoading(true);
    try {
      const data = await getBankById(bankId);
      setBank(data);
    } catch (e) {
      console.error(e);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [bankId, getBankById, router]);

  const loadTransactions = useCallback(() => {
    listTransactions(bankId, {
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
    });
  }, [bankId, fromDate, toDate, listTransactions]);

  if (transactions.length === 0) {
    return <p className="text-light/60">Nenhuma transação encontrada.</p>;
  }

  return (
    <ul className="space-y-4">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="bg-dark/50 border-light/20 relative flex flex-col justify-between rounded-lg border px-4 py-2"
        >
          <div className="flex w-full justify-between">
            <span
              className={`text-xl font-semibold ${
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
                  fetchBank();
                  loadTransactions();
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
            <p className="text-light/60 text-sm font-light first-letter:capitalize">
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
