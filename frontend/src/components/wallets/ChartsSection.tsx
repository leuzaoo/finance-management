import React from "react";

import CategoryBarChart from "@/src/components/ui/CategoryBarChart";
import BalanceChart from "@/src/components/ui/BalanceChart";

export function ChartsSection({
  balanceData,
  categoryData,
  currencyType,
  isCategoryLoading,
}: {
  balanceData: any[];
  categoryData: any[];
  currencyType: string;
  isCategoryLoading: boolean;
}) {
  return (
    <div>
      <section className="mt-6">
        <BalanceChart data={balanceData} />
      </section>
      <CategoryBarChart
        data={categoryData}
        currencyType={currencyType}
        isLoading={isCategoryLoading}
      />
    </div>
  );
}
