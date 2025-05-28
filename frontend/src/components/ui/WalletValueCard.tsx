import React from "react";
import CurrencyValue from "../utils/CurrencyValue";

interface Props {
  label: string;
  value: string;
  currencyType: string;
}

export function WalletValueCard({ label, value, currencyType }: Props) {
  return (
    <div className="bg-dark mt-5 flex max-w-max flex-col gap-1 rounded-lg px-5 py-2">
      <span className="text-center text-xs text-white/50">{label}</span>
      <div className="flex items-end gap-5 text-2xl">
        <span className="font-oswald">
          <CurrencyValue value={value} />
        </span>{" "}
        <span className="text-light/50 font-inter font-medium">
          {currencyType}
        </span>
      </div>
    </div>
  );
}
