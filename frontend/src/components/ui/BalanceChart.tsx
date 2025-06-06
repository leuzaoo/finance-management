"use client";
import React from "react";
import { formatCurrency } from "@/src/utils/format-currency";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: Array<{ date: string; balance: number }>;
  dateFormatter?: (dt: string) => string;
  tooltipFormatter?: (value: number) => string;
}

export default function BalanceChart({
  data,
  dateFormatter,
  tooltipFormatter,
}: Props) {
  if (!data || data.length === 0) {
    return <p className="text-light/60">Não há dados para o gráfico.</p>;
  }

  const defaultDateFormatter = (dt: string) => {
    return format(new Date(dt), "dd/MM/yy");
  };

  const defaultTooltipFormatter = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div className="bg-dark/50 border-light/20 mt-2 h-64 w-full rounded-lg border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 24, right: 40, left: 0, bottom: 16 }}
        >
          <CartesianGrid stroke="#202020" strokeDasharray="8 8" />
          <XAxis
            dataKey="date"
            tickFormatter={dateFormatter || defaultDateFormatter}
            stroke="#aaa"
            fontSize={"12px"}
          />
          <YAxis
            tickFormatter={(value) =>
              (tooltipFormatter || defaultTooltipFormatter)(value)
            }
            stroke="#aaa"
            width={80}
            fontSize={"12px"}
          />
          <Tooltip
            labelFormatter={dateFormatter || defaultDateFormatter}
            formatter={(value: number) => [
              (tooltipFormatter || defaultTooltipFormatter)(value),
              "Saldo",
            ]}
            contentStyle={{
              backgroundColor: "#222",
              borderColor: "#555",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ r: 2, fill: "#4ade80" }}
            activeDot={{ r: 4, fill: "#4ade80" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
