import Link from "next/link";
import React from "react";
import { Wallet2Icon, ChevronRightIcon } from "lucide-react";

import { formatCurrency } from "@/src/utils/format-currency";
import { Bank } from "@/src/store/useBankStore";

interface Props {
  banks: Bank[];
  currency: string;
  currencies: string[];
  onCurrencyChange: (c: string) => void;
}

const ALL = "Todas";

const DashboardMoneyCard = ({
  banks,
  currency,
  currencies,
  onCurrencyChange,
}: Props) => {
  if (banks.length === 0) {
    return (
      <div className="mt-2">
        <div className="dark:bg-dark/50 2md:w-sm dark:text-light/40 text-dark/50 max-w-sm rounded-xl bg-white p-3 shadow-md transition-all duration-1000">
          Registre um cartão para exibir informações.
        </div>
      </div>
    );
  }

  const totalsByCurrency = banks.reduce<Record<string, number>>((acc, b) => {
    acc[b.currencyType] = (acc[b.currencyType] || 0) + b.currencyValue;
    return acc;
  }, {});

  const totalSingle = currency === ALL ? 0 : (totalsByCurrency[currency] ?? 0);

  return (
    <div className="mt-2 space-y-6">
      <div className="2md:w-sm dark:bg-dark/70 max-w-sm rounded-lg bg-white p-3 transition-all duration-1000">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet2Icon
              className="text-dark/40 dark:text-light/40 transition-all duration-1000"
              width={20}
            />
            <span>Saldo</span>
          </div>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="bg-dark/10 dark:bg-light/10 cursor-pointer rounded px-2 py-1 underline"
          >
            {currencies.map((c) => (
              <option key={c} value={c} className="bg-light dark:bg-dark">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          {currency === ALL ? (
            <ul className="space-y-2">
              {currencies
                .filter((c) => c !== ALL)
                .map((c) => (
                  <li key={c} className="flex justify-between text-lg">
                    <span className="capitalize">{c}</span>
                    <span className="font-zona-pro font-semibold">
                      {formatCurrency(totalsByCurrency[c] || 0)}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="font-zona-pro text-3xl">
              {formatCurrency(totalSingle)}
            </div>
          )}
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
