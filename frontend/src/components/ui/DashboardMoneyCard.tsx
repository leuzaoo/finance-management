import { formatCurrency } from "@/src/utils/format-currency";
import { Wallet2Icon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Bank } from "@/src/store/useBankStore";

interface Props {
  banks: Bank[];
  currency: string;
  currencies: string[];
  onCurrencyChange: (c: string) => void;
}

const DashboardMoneyCard = ({
  banks,
  currency,
  currencies,
  onCurrencyChange,
}: Props) => {
  const total =
    currency === "Todas"
      ? banks.reduce((sum, b) => sum + b.currencyValue, 0)
      : banks
          .filter((b) => b.currencyType === currency)
          .reduce((sum, b) => sum + b.currencyValue, 0);

  return (
    <div className="space-y-6">
      <div className="bg-dark/50 w-[20rem] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet2Icon className="text-light/70" width={20} />
            <span>Total</span>
          </div>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="bg-dark/10 cursor-pointer rounded px-2 py-1"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <span className="text-3xl font-semibold">
            {formatCurrency(total)}
          </span>
        </div>

        <Link
          href={"/wallets"}
          className="mt-4 flex items-center justify-end gap-1 text-sm text-blue-500 underline hover:text-blue-400"
        >
          Carteira <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
};

export default DashboardMoneyCard;
