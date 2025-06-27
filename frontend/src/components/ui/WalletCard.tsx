"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";

import { useBankStore, type Bank } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

interface Props {
  bank: Bank;
}

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

  return (
    <div className="border-light/15 flex aspect-video w-full max-w-96 min-w-[16rem] flex-shrink-0 flex-col justify-between gap-4 rounded-lg border p-3">
      <div className="flex justify-between">
        <h2 className="font-medium capitalize">{bank.bankName}</h2>
        <button
          onClick={handleDelete}
          className="text-light/60 cursor-pointer p-1 hover:text-red-500"
          title="Deletar banco"
        >
          <Trash2Icon size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="font-semibold text-3xl">
          {formatCurrency(bank.currencyValue)}
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
  );
};

export default WalletCard;
