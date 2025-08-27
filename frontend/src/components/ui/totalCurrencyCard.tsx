import React, { useEffect, useMemo } from "react";

import { useRatesStore } from "@/src/store/useRatesStore";
import { useBankStore } from "@/src/store/useBankStore";
import { sumToBase } from "@/src/utils/sumToBase";

const fmt = (n: number, c = "BRL") =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: c }).format(n);

const TotalCurrencyCard = () => {
  const {
    base,
    rates,
    updatedAt,
    isLoading: fxLoading,
    error: fxError,
    fetchRates,
  } = useRatesStore();

  const { banks } = useBankStore();

  useEffect(() => {
    fetchRates("BRL");
    const id = setInterval(() => fetchRates("BRL"), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchRates]);

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

  const totalBRL = useMemo(
    () => sumToBase(balancesByCurrency, "BRL", rates),
    [balancesByCurrency, rates],
  );

  return (
    <>
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:bg-dark">
        <div className="text-sm opacity-70">Total (BRL)</div>
        <div className="mt-1 text-3xl font-semibold">
          {fmt(totalBRL, "BRL")}
        </div>
        <div className="mt-2 text-xs opacity-60">
          {fxError
            ? "Erro ao atualizar cotações"
            : fxLoading
              ? "Atualizando cotações..."
              : updatedAt
                ? `Cotação de ${new Date(updatedAt).toLocaleString("pt-BR")}`
                : "—"}
        </div>
      </div>
    </>
  );
};

export default TotalCurrencyCard;
