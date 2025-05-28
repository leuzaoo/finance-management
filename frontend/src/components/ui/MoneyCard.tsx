"use client";
import { Trash2Icon } from "lucide-react";

import { useBankStore } from "../../store/useBankStore";

import CurrencyValue from "../../components/utils/CurrencyValue";

interface Props {
  bankId: string;
  label: string;
  value: string;
  currency: string;
}

export default function MoneyCard({ bankId, label, value, currency }: Props) {
  const deleteBank = useBankStore((s) => s.deleteBank);
  const isLoading = useBankStore((s) => s.isLoading);

  const handleDelete = async () => {
    if (confirm(`Deseja realmente deletar o banco “${label}”?`)) {
      await deleteBank(bankId);
    }
  };

  return (
    <div className="bg-dark relative h-24 min-w-[14rem] rounded-xl p-3">
      <button
        onClick={handleDelete}
        disabled={isLoading}
        aria-label={`Deletar banco ${label}`}
        className="text-light/60 absolute top-2 right-2 cursor-pointer hover:text-red-400 disabled:opacity-50"
      >
        <Trash2Icon size={20} />
      </button>

      <div className="flex h-full flex-col justify-center">
        <span className="text-light/50 font-medium capitalize">{label}</span>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <CurrencyValue value={value} />
          <span className="text-2xl font-medium font-inter opacity-60">{currency}</span>
        </div>
      </div>
    </div>
  );
}
