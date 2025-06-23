import React from "react";
import { PlusCircleIcon } from "lucide-react";

import { type Subscription } from "@/src/store/useSubscriptionStore";

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
    <section className="bg-dark/50 mt-6 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <TitlePage text="Assinaturas" />
        <button
          onClick={onAdd}
          className="text-light/50 hover:text-light cursor-pointer"
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
