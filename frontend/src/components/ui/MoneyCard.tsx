"use client";

import CurrencyValue from "../../components/utils/CurrencyValue";

interface Props {
  label: string;
  value: string;
  currency: string;
}

export default function MoneyCard({ label, value, currency }: Props) {
  return (
    <div className="bg-dark/50 relative h-24 min-w-[14rem] rounded-xl p-3">
      <div className="flex h-full flex-col justify-center">
        <span className="text-light/50 font-medium capitalize">{label}</span>
        <div className="mt-2 flex items-baseline justify-between gap-3 font-semibold">
          <CurrencyValue value={value} />
          <span className="text-2xl font-medium opacity-60">{currency}</span>
        </div>
      </div>
    </div>
  );
}
