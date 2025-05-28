"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
  basePath?: string;
}

export function WalletTabs({ list, basePath = "/wallets" }: WalletTabsProps) {
  const params = useSearchParams();
  const active = params.get("")?.toLowerCase() ?? "";

  return (
    <div className="bg-dark inline-flex space-x-2 rounded-lg p-1">
      {list.map((w) => {
        const isActive = w.slug === active;

        return (
          <Link
            key={w.id}
            href={`${basePath}?=${w.slug}`}
            className={`rounded-lg px-8 py-1 transition ${
              isActive
                ? "text-dark bg-white font-semibold"
                : "text-light/60 hover:bg-light/10 hover:text-light"
            } `}
          >
            {w.name}
          </Link>
        );
      })}
    </div>
  );
}
