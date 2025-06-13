import Link from "next/link";
import React from "react";
import { Wallet2Icon, ChevronRightIcon } from "lucide-react";

import { formatCurrency } from "@/src/utils/format-currency";

interface Props {
  totalBalance: number;
}

const DashboardMoneyCard = ({ totalBalance }: Props) => {
  return (
    <div className="space-y-6">
      <div className="bg-dark/50 w-[20rem] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet2Icon className="text-light/70" width={20} />
            <span>Total</span>
          </div>
          <select className="bg-dark/10 cursor-pointer">
            <option className="bg-dark">BRL</option>
            <option className="bg-dark">USD</option>
            <option className="bg-dark">GBP</option>
          </select>
        </div>
        <div className="mt-6">
          <span className="text-3xl font-semibold">
            {formatCurrency(totalBalance)}
          </span>
        </div>
        <Link
          href={"/wallets"}
          className="mt-4 flex items-center justify-end gap-1 text-sm text-blue-500 underline hover:text-blue-400"
        >
          Carteira <ChevronRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
};

export default DashboardMoneyCard;
