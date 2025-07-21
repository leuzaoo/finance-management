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
          <span className="font-zona-pro text-2xl font-bold sm:text-3xl">
            {formatCurrency(balance)}
          </span>{" "}
          <span className="text-lg opacity-60">({currency})</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="font-light text-light/50 sm:text-lg">Transações</span>
        <button
          onClick={onOpenModal}
          className="flex cursor-pointer items-center justify-end gap-2 rounded bg-light px-3 py-1 text-dark transition-all duration-200 hover:opacity-60"
        >
          Adicionar <PlusCircleIcon size={20} />
        </button>
      </div>
    </div>
  );
}
