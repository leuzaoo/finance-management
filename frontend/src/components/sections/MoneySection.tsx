"use client";
import React from "react";

import type { Bank } from "@/src/store/useBankStore";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import TotalCurrencyCard from "@/src/components/ui/totalCurrencyCard";

type Props = {
  banks: Bank[];
  currencies: string[];
  selectedCurrency: string;
  onCurrencyChange: (c: string) => void;
  onOpenAdd: () => void;
};

export default function MoneySection({
  banks,
  currencies,
  selectedCurrency,
  onCurrencyChange,
  onOpenAdd,
}: Props) {
  return (
    <section>
      <h1 className="sr-only">Moeda</h1>
      <TotalCurrencyCard />
      <DashboardMoneyCard
        banks={banks}
        currency={selectedCurrency}
        currencies={currencies}
        onCurrencyChange={onCurrencyChange}
        onOpenAdd={onOpenAdd}
      />
    </section>
  );
}
