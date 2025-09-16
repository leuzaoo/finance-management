"use client";
import { useMemo } from "react";

import { useBankStore } from "@/src/store/useBankStore";

export function useBanksBalances() {
  const { banks } = useBankStore();
  const balancesByCurrency = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const b of banks) {
      const code = (b.currencyType || "").toUpperCase();
      const val = Number(b.currencyValue || 0);
      if (!code) continue;
      acc[code] = (acc[code] || 0) + val;
    }
    return acc;
  }, [banks]);

  const currencies = useMemo(
    () => Array.from(new Set(banks.map((b) => b.currencyType))).sort(),
    [banks],
  );

  return { balancesByCurrency, currencies, banks };
}
