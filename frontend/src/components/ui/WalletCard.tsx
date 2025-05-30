import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/src/utils/format-currency";
import type { Bank } from "@/src/store/useBankStore";

interface Props {
  bank: Bank;
}

const WalletCard = ({ bank }: Props) => {
  return (
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
  );
};

export default WalletCard;
