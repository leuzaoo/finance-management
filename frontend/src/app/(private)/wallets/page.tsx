"use client";
import React from "react";

import { formatCurrency } from "@/src/utils/format-currency";
import { WalletTabs, type Wallet } from "@/src/components/ui/WalletTabs";

import WalletValueCard from "@/src/components/ui/WalletValueCard";
import { useSearchParams } from "next/navigation";

const MENU_WALLET_LIST = [
  {
    id: 0,
    name: "Nubank",
    slug: "nubank",
    income: 1000,
    expense: 500,
    currencyType: "BRL",
  },
  {
    id: 1,
    name: "Itaú",
    slug: "itau",
    income: 1200,
    expense: 300,
    currencyType: "BRL",
  },
  {
    id: 2,
    name: "Wise",
    slug: "wise",
    income: 600,
    expense: 50,
    currencyType: "GBP",
  },
];

const WalletsPage = () => {
  const params = useSearchParams();
  const activeSlug = params.get("") ?? "";

  const wallet: Wallet =
    MENU_WALLET_LIST.find((w) => w.slug === activeSlug) ?? MENU_WALLET_LIST[0];

  return (
    <section>
      <h1 className="text-2xl font-semibold">Cartões</h1>
      <p className="text-sm text-white/50">Escolha um para ver mais detalhes</p>
      <div className="mt-2 flex items-center gap-2 overflow-auto">
        <WalletTabs list={MENU_WALLET_LIST} />
      </div>
      <div className="flex items-center gap-8">
        <WalletValueCard
          label="Entradas"
          currencyValue={formatCurrency(wallet.income)}
          currencyType={wallet.currencyType}
        />
        <WalletValueCard
          label="Saídas"
          currencyValue={formatCurrency(wallet.expense)}
          currencyType={wallet.currencyType}
        />
      </div>
    </section>
  );
};

export default WalletsPage;
