import React from "react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Props {
  label: string;
  value: string;
  currency: string;
}

function MoneyCard({ label, value, currency }: Props) {
  return (
    <div className={`${roboto.className} bg-light/10 h-24 min-w-56 rounded-xl`}>
      <div className="flex flex-col p-4">
        <span className="text-light/50">{label}</span>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-2xl font-semibold">
            {value} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MoneyCard;
