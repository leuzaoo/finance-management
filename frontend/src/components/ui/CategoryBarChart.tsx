"use client";
import React, { useMemo } from "react";

import { getCategoryLabel } from "@/src/utils/getCategoryLabels";
import { formatCurrency } from "@/src/utils/format-currency";

import TitlePage from "../common/TitlePage";

export interface CategorySummary {
  category: string;
  total: number;
}

interface Props {
  data: CategorySummary[];
  currencyType: string;
  isLoading: boolean;
}

export default function CategoryBarChart({
  data,
  isLoading,
  currencyType,
}: Props) {
  if (isLoading) {
    return (
      <section className="bg-dark/50 mt-6 space-y-4 rounded-lg p-4">
        <TitlePage text="Gastos por Categoria" />
        <p className="text-light/60">Carregando resumo por categoria…</p>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="bg-dark/50 mt-6 space-y-4 rounded-lg p-4">
        <TitlePage text="Gastos por Categoria" />
        <p className="text-light/60">Nenhuma despesa neste período.</p>
      </section>
    );
  }

  const sumTotal = useMemo(
    () => data.reduce((acc, c) => acc + c.total, 0),
    [data],
  );

  return (
    <section className="bg-dark/50 mt-6 space-y-4 rounded-lg p-4">
      <TitlePage text="Gastos por Categoria" />
      <ul className="space-y-2 text-sm">
        {data.map((d) => {
          const pct = sumTotal > 0 ? (d.total / sumTotal) * 100 : 0;
          const widthPct = `${Math.round(pct)}%`;
          return (
            <li key={d.category} className="flex items-center gap-1">
              <span className="w-20 font-medium capitalize">
                {getCategoryLabel(d.category)}
              </span>
              <div className="bg-light/10 relative h-3 flex-1 overflow-hidden rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500"
                  style={{ width: widthPct }}
                />
              </div>
              <span className="font-zona-pro w-20 text-right text-xs">
                {formatCurrency(d.total)}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="text-light/50 flex items-center justify-end text-sm font-light">
        <p>
          Total:{" "}
          <span className="font-zona-pro text-base font-medium">
            {formatCurrency(sumTotal)}
          </span>
        </p>
        <span className="ml-1">{currencyType}</span>
      </div>
    </section>
  );
}
