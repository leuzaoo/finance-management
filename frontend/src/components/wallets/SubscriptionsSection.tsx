import React from "react";
import { PlusCircleIcon } from "lucide-react";

import { Subscription } from "@/src/store/useSubscriptionStore";

import SubscriptionsCard from "@/src/components/ui/SubscriptionsCard";
import TitlePage from "@/src/components/common/TitlePage";

interface Props {
  bankId: string;
  currencyType: string;
  onAdd: () => void;
  onEdit: (sub: Subscription) => void;
  onDelete: (subId: string) => void;
}

export function SubscriptionsSection({
  bankId,
  currencyType,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="mt-6 rounded-lg bg-white p-4 shadow-md transition-all duration-300 dark:bg-dark/50">
      <div className="flex items-center justify-between">
        <TitlePage text="Assinaturas" />
        <button
          onClick={onAdd}
          className="cursor-pointer text-dark transition-all duration-300 hover:text-light dark:text-light/50"
        >
          <PlusCircleIcon />
        </button>
      </div>

      <SubscriptionsCard
        bankId={bankId}
        currencyType={currencyType}
        onEdit={(sub) => {
          onEdit(sub);
        }}
        onDelete={(id) => {
          onDelete(id);
        }}
      />
    </section>
  );
}
