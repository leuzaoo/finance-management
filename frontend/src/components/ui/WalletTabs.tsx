"use client";

import React from "react";

export interface Wallet {
  id: number;
  name: string;
  slug: string;
  income: number;
  expense: number;
  currencyType: string;
}

interface WalletTabsProps {
  list: Wallet[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export function WalletTabs({ list, activeSlug, onSelect }: WalletTabsProps) {
  return (
    <div className="bg-dark inline-flex space-x-2 rounded-lg p-1">
      {list.map((w) => {
        const isActive = w.slug === activeSlug;

        return (
          <button
            key={w.id}
            onClick={() => onSelect(w.slug)}
            className={`cursor-pointer rounded-md px-8 py-1 transition ${
              isActive
                ? "text-dark bg-white font-semibold"
                : "text-light/60 hover:bg-light/10 hover:text-light"
            } `}
          >
            {w.name}
          </button>
        );
      })}
    </div>
  );
}
