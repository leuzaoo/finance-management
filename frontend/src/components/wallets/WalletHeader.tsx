import React from "react";
import { PlusCircleIcon } from "lucide-react";

import { formatCurrency } from "@/src/utils/format-currency";

import TitlePage from "@/src/components/common/TitlePage";

export function WalletHeader({
  bankName,
  balance,
  currency,
  onOpenModal,
}: {
  bankName: string;
  balance: number;
  currency: string;
  onOpenModal: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <TitlePage text={bankName} />
        <div>
          <span className="font-dm_sans text-2xl font-bold sm:text-3xl">
            {formatCurrency(balance)}
          </span>{" "}
          <span className="text-lg opacity-60">({currency})</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="font-light text-dark/50 transition-all duration-300 dark:text-light/50 sm:text-lg">
          Transações
        </span>
        <button
          onClick={onOpenModal}
          className="flex cursor-pointer items-center justify-end gap-2 rounded bg-dark/90 px-3 py-1 text-sm text-light shadow-md transition-all duration-300 hover:opacity-60 dark:bg-light dark:text-dark"
        >
          Adicionar <PlusCircleIcon size={16} />
        </button>
      </div>
    </div>
  );
}
