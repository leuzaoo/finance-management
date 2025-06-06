import React from "react";
import { MoreVerticalIcon } from "lucide-react";

import { formatCurrency } from "@/src/utils/format-currency";

const samples = [
  {
    id: 0,
    platform: "Netflix",
    amount: 24.9,
    currencyType: "BRL",
  },
  {
    id: 1,
    platform: "Disney",
    amount: 29.9,
    currencyType: "BRL",
  },
];

const SubscriptionsCard = () => {
  return (
    <div className="mt-6">
      <ul>
        {samples.map((item) => (
          <li key={item.id} className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span
                className="h-4 w-4 rounded-full bg-blue-500"
                aria-hidden="true"
              />
              <span>{item.platform}</span>
            </div>

            <div className="flex items-center gap-4">
              <span>
                {formatCurrency(item.amount)} {item.currencyType}
              </span>
              <button className="text-light/50 hover:text-light cursor-pointer">
                <MoreVerticalIcon size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionsCard;
