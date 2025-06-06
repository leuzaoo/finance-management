"use client";

import React, { useEffect } from "react";
import { MoreVerticalIcon } from "lucide-react";

import { useSubscriptionStore } from "@/src/store/useSubscriptionStore";
import { formatCurrency } from "@/src/utils/format-currency";

interface Props {
  bankId: string;
}

const SubscriptionsCard: React.FC<Props> = ({ bankId }) => {
  const { subscriptions, listSubscriptions, deleteSubscription, isLoading } =
    useSubscriptionStore();

  useEffect(() => {
    if (bankId) {
      listSubscriptions(bankId);
    }
  }, [bankId, listSubscriptions]);

  if (isLoading) {
    return <p>Carregando assinaturas...</p>;
  }

  if (subscriptions.length === 0) {
    return <p className="text-light/60">Nenhuma assinatura cadastrada.</p>;
  }

  return (
    <div className="mt-6">
      <ul>
        {subscriptions.map((item) => (
          <li key={item._id} className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span
                className="h-4 w-4 rounded-full bg-blue-500"
                aria-hidden="true"
              />
              <span>{item.platform}</span>
            </div>

            <div className="flex items-center gap-4">
              <span>{formatCurrency(item.amount)} </span>
              <button
                className="text-light/50 hover:text-light cursor-pointer"
                onClick={() => {
                  if (confirm(`Deseja realmente remover "${item.platform}"?`)) {
                    deleteSubscription(bankId, item._id);
                  }
                }}
              >
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
