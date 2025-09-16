import React from "react";
import Image from "next/image";

import { CircleFadingPlusIcon } from "lucide-react";

import { formatCurrency } from "@/src/utils/format-currency";
import { Bank } from "@/src/store/useBankStore";

import TitlePage from "../common/TitlePage";

interface Props {
  banks: Bank[];
  currency?: string;
  currencies?: string[];
  onCurrencyChange?: (c: string) => void;
  onOpenAdd?: () => void;
}

const ALL = "Todas";

const flagMap: Record<string, string> = {
  BRL: "/brazil-flag.png",
  GBP: "/uk-flag.png",
  USD: "/usa-flag.png",
  EUR: "/euro-flag.png",
};

export default function DashboardMoneyCard({
  banks,
  currencies = [ALL],
  onOpenAdd,
}: Props) {
  if (!banks || banks.length === 0) {
    return (
      <>
        <div className="mt-5">
          <TitlePage text="Banco" />
        </div>
        <div className="mt-2 h-32 w-full cursor-pointer rounded-lg border border-dashed border-neutral-300 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:opacity-50 dark:border-neutral-700 dark:bg-dark/60">
          <button
            type="button"
            onClick={() => onOpenAdd?.()}
            className="flex h-full w-full flex-col items-center justify-center gap-2"
          >
            <div>
              <CircleFadingPlusIcon size={32} />
            </div>
            <span className="font-semibold">Adicionar banco</span>
          </button>
        </div>
      </>
    );
  }

  const totalsByCurrency = banks.reduce<Record<string, number>>((acc, b) => {
    acc[b.currencyType] = (acc[b.currencyType] || 0) + b.currencyValue;
    return acc;
  }, {});

  const currencyList = (currencies ?? []).filter((c) => c !== ALL);

  return (
    <>
      <div className="mt-4">
        <div className="flex gap-3 overflow-x-auto pb-3">
          {currencyList.map((c) => {
            const amount = totalsByCurrency[c] ?? 0;
            const flag = flagMap[c];

            return (
              <div
                key={c}
                className="flex h-32 min-w-[9rem] flex-col justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-dark/70"
              >
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    {flag ? (
                      <Image
                        src={flag}
                        alt={`${c} flag`}
                        width={36}
                        height={24}
                        className="rounded-sm"
                      />
                    ) : (
                      <div className="h-9 w-12 rounded-sm bg-neutral-300 dark:bg-neutral-800" />
                    )}
                    <span className="font-medium">{c}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-dm_sans text-xl font-bold">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="h-32 min-w-[9rem] rounded-lg border border-dashed border-neutral-300 bg-white p-4 text-center shadow-sm dark:border-neutral-700 dark:bg-dark/60">
            <button
              type="button"
              onClick={() => onOpenAdd?.()}
              className="flex h-full w-full flex-col items-center justify-center gap-2"
            >
              <div>
                <CircleFadingPlusIcon size={32} />
              </div>
              <span className="font-semibold">Novo</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
