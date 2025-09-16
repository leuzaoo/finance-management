"use client";
import { useCallback } from "react";

import type { Transaction } from "@/src/store/useTransactionStore";
import { useBankStore } from "@/src/store/useBankStore";

export function useResolveBankInfo() {
  const { banks } = useBankStore();

  return useCallback(
    (tx: Transaction) => {
      if (tx.bank && typeof tx.bank === "object") {
        const b = tx.bank as any;
        return {
          bankName: b.bankName ?? null,
          bankCurrency: b.currencyType ?? null,
        };
      }
      const bankId =
        typeof tx.bank === "string" ? tx.bank : (tx.bank as any)?._id;
      const found = banks.find((bb) => String(bb.id) === String(bankId));
      return {
        bankName: found?.bankName ?? null,
        bankCurrency: found?.currencyType ?? null,
      };
    },
    [banks],
  );
}
