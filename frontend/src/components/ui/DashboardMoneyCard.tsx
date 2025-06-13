import { formatCurrency } from "@/src/utils/format-currency";
import { Wallet2Icon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  banks: Bank[];
}

const DashboardMoneyCard = ({ banks }: Props) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("BRL");

  const totalBalance = useMemo(() => {
    return banks
      .filter((b) => b.currencyType === selectedCurrency)
      .reduce((sum, b) => sum + b.currencyValue, 0);
  }, [banks, selectedCurrency]);

  const currencies = useMemo(
    () => Array.from(new Set(banks.map((b) => b.currencyType))),
    [banks],
  );

  return (
    <div className="mt-4 space-y-6">
      <div className="bg-dark/50 w-[20rem] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet2Icon className="text-light/70" width={20} />
            <span>Total</span>
          </div>
          <select
            className="bg-dark/10 cursor-pointer rounded font-medium"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.currentTarget.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur} className="bg-dark">
                {cur}
              </option>
            ))}
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
