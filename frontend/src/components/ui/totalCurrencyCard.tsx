"use client";

import React, { useEffect, useMemo } from "react";

import { useRatesStore } from "@/src/store/useRatesStore";
import { useBankStore } from "@/src/store/useBankStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { sumToBase } from "@/src/utils/sumToBase";

const fmt = (n: number, c: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: c }).format(n);

const TotalCurrencyCard = () => {
  const { user } = useAuthStore();
  const userBase = (user?.primaryCurrency || "BRL").toUpperCase();

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
    fetchRates(userBase);
    const id = setInterval(() => fetchRates(userBase), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchRates, userBase]);

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

  const totalInBase = useMemo(
    () => sumToBase(balancesByCurrency, userBase, rates),
    [balancesByCurrency, userBase, rates],
  );

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:bg-dark">
      <div className="text-sm opacity-70">Total ({userBase})</div>
      <div className="mt-1 text-3xl font-semibold">
        {fmt(totalInBase, userBase)}
      </div>
      <div className="mt-2 text-xs opacity-60">
        {fxError
          ? "Erro ao atualizar cotações"
          : fxLoading
            ? "Atualizando cotações..."
            : updatedAt
              ? `Cotação de ${new Date(updatedAt).toLocaleString("pt-BR")}${
                  base && base !== userBase ? ` · base atual: ${base}` : ""
                }`
              : "—"}
      </div>
    </div>
  );
};

export default TotalCurrencyCard;
