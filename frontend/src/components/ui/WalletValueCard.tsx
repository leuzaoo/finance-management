import React from "react";
import CurrencyValue from "../utils/CurrencyValue";

interface Props {
  label: string;
  currencyValue: string;
  currencyType: string;
}

const WalletValueCard = ({ label, currencyValue, currencyType }: Props) => {
  return (
    <div className="bg-dark mt-5 flex max-w-max flex-col gap-1 rounded-lg px-5 py-2">
      <p className="text-center text-sm text-white/50">{label}</p>
      <div className="flex items-end gap-5 text-2xl">
        <span className="font-oswald">
          <CurrencyValue value={currencyValue} />
        </span>{" "}
        <span className="text-light/50 font-inter font-medium">
          {currencyType}
        </span>
      </div>
    </div>
  );
};

export default WalletValueCard;
