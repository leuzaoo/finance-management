"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

export function Wallets() {
  const { banks, isLoading, listBanks } = useBankStore();

  useEffect(() => {
    listBanks();
  }, [listBanks]);

  if (isLoading) {
    return <p>Carregando seus bancos...</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Meus Cartões</h1>
      <div className="mt-2 flex w-full flex-wrap gap-4">
        {banks.map((bank: Bank) => (
          <div
            key={bank.id}
            className="border-light/15 flex w-80 flex-col justify-between gap-8 rounded-xl border p-4"
          >
            <h2 className="font-semibold capitalize">{bank.bankName}</h2>

            <div className="flex w-full items-center justify-between">
              <span className="text-3xl font-semibold">
                {formatCurrency(bank.currencyValue)}{" "}
              </span>
              <span className="text-xl font-medium">{bank.currencyType}</span>
            </div>

            <div className="flex w-full items-center justify-between">
              <Image
                src="/mastercard.png"
                width={36}
                height={100}
                alt="Mastercard icon"
              />
              <Link
                href={`/wallets/${bank.id}`}
                className="flex items-center gap-1 text-sky-500 underline"
              >
                <span className="text-sm">Ver detalhes</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
