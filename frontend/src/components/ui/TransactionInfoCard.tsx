import React from "react";
import { XIcon } from "lucide-react";

import type { Transaction } from "@/src/store/useTransactionStore";
import type { Bank } from "@/src/store/useBankStore";

import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import { formatCurrency } from "@/src/utils/format-currency";

type ResolveBankFn = (tx: Transaction) => {
  bankName: string | null;
  bankCurrency: string | null;
};

interface Props {
  transaction: Transaction;
  onClose: () => void;
  resolveBankInfo?: ResolveBankFn;
  banks?: Bank[];
}

export default function TransactionInfoCard({
  transaction,
  onClose,
  resolveBankInfo,
}: Props) {
  const tx = transaction;

  let bankName: string | null = null;
  let bankCurrency: string | null = null;
  if (resolveBankInfo) {
    const info = resolveBankInfo(tx);
    bankName = info.bankName;
    bankCurrency = info.bankCurrency;
  } else if (tx.bank && typeof tx.bank === "object") {
    const b = tx.bank as any;
    bankName = b.bankName ?? null;
    bankCurrency = b.currencyType ?? null;
  }

  const amountFormatted = formatCurrency(tx.amount);
  const sign = tx.type === "expense" ? "-" : "+";
  const categoryLabel = getCategoryLabel(tx.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-dark/90">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{categoryLabel}</h3>
            {transaction.description && (
              <p className="mt-1 text-sm text-neutral-500">
                {transaction.description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="ml-4 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <XIcon />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="font-dm_sans text-2xl font-bold">
            {sign} {amountFormatted} {bankCurrency ?? ""}
          </div>
          <div className="text-sm text-neutral-500">{bankName ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
