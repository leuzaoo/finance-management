"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

interface Props {
  bank: Bank;
}

const flagByCurrency: Record<string, string> = {
  BRL: "/brazil-flag.png",
  GBP: "/uk-flag.png",
  USD: "/usa-flag.png",
  EUR: "/euro-flag.png",
};

const WalletCard = ({ bank }: Props) => {
  const { deleteBank, listBanks } = useBankStore();

  const handleDelete = async () => {
    if (confirm(`Confirme a exclusão de ${bank.bankName}`)) {
      try {
        await deleteBank(bank.id);
        await listBanks();
      } catch (err) {
        console.error("Erro ao deletar banco:", err);
      }
    }
  };

  const flag = flagByCurrency[(bank.currencyType || "").toUpperCase()] ?? "💳";

  return (
    <div
      className="group relative flex h-[196px] flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
      role="article"
      aria-label={`Cartão ${bank.bankName}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-emerald-500/10 blur-xl transition duration-300 group-hover:from-blue-500/20 group-hover:to-emerald-500/20" />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={flag}
            alt={`flag`}
            width={28}
            height={16}
            className="rounded-sm"
          />
          <h2 className="text-lg font-semibold capitalize tracking-tight">
            {bank.bankName}
          </h2>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-md p-1 text-black/50 transition hover:bg-black/5 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white/60 dark:hover:bg-white/10"
          title="Excluir"
          aria-label={`Excluir ${bank.bankName}`}
        >
          <Trash2Icon size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="mt-1 flex items-end justify-between">
        <div className="font-dm_sans text-3xl font-semibold leading-none">
          {formatCurrency(bank.currencyValue)}
        </div>
        <span className="rounded-full border border-black/10 px-2 py-0.5 text-sm font-medium tracking-wide text-black/70 dark:border-white/15 dark:text-white/80">
          {bank.currencyType.toUpperCase()}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Image
          src="/mastercard.png"
          width={40}
          height={16}
          alt="Mastercard"
          className="opacity-80 transition group-hover:opacity-100"
        />
        <Link
          href={`/wallets/${bank.id}`}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-blue-600 underline-offset-4 transition hover:underline hover:underline-offset-4 dark:text-sky-400"
          aria-label={`Ver detalhes de ${bank.bankName}`}
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;
