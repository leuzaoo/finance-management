"use client";

import { XIcon } from "lucide-react";
import ModalOverlay from "@/src/components/ui/ModalOverlay";

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

  const sign = tx.type === "expense" ? "-" : "+";
  const amountFormatted = formatCurrency(tx.amount);
  const categoryLabel = getCategoryLabel(tx.category);
  const dateStr = tx.date ? new Date(tx.date).toLocaleDateString("pt-BR") : "—";

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0b0e12]/70">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-black dark:text-white">
              {categoryLabel}
            </h3>
            {tx.description && (
              <p className="mt-1 line-clamp-2 text-sm text-black/60 dark:text-white/70">
                {tx.description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="ml-3 rounded-md p-1 text-black/60 transition hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 dark:text-white/70 dark:hover:bg-white/10 dark:focus:ring-white/20"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="mt-4">
          <div className="font-dm_sans text-[28px] font-extrabold leading-none text-black dark:text-white">
            {sign} {amountFormatted}
            {bankCurrency ? (
              <span className="ml-1 align-middle text-base opacity-70">
                {bankCurrency}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-dark opacity-70 dark:text-white">
          <span className="truncate">{bankName ?? "—"}</span>
          <span>{dateStr}</span>
        </div>
      </div>
    </ModalOverlay>
  );
}
