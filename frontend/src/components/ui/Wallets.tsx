"use client";
import { useState } from "react";

import { MENU_WALLET_LIST, type Wallet } from "@/src/utils/constants";
import { formatCurrency } from "@/src/utils/format-currency";

import { WalletValueCard } from "./WalletValueCard";
import { WalletTabs } from "./WalletTabs";

export function Wallets() {
  const [activeWallet, setActiveWallet] = useState<Wallet>(MENU_WALLET_LIST[0]);

  const handleSelect = (slug: string) => {
    const found = MENU_WALLET_LIST.find((w) => w.slug === slug);
    if (found) setActiveWallet(found);
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold">Cartões</h1>
      <p className="mb-2 text-sm text-white/50">
        Escolha um para ver mais detalhes
      </p>

      <WalletTabs
        list={MENU_WALLET_LIST}
        activeSlug={activeWallet.slug}
        onSelect={handleSelect}
      />

      <div className="flex items-center gap-8">
        <WalletValueCard
          label="Entradas"
          value={formatCurrency(activeWallet.income)}
          currencyType={activeWallet.currencyType}
        />
        <WalletValueCard
          label="Saídas"
          value={formatCurrency(activeWallet.expense)}
          currencyType={activeWallet.currencyType}
        />
      </div>
    </section>
  );
}
