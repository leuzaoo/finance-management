// pages/dashboard.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

import { useDashboardHistory } from "@/src/hooks/useDashboardHistory";
import { Bank, useBankStore } from "@/src/store/useBankStore";
import { formatCurrency } from "@/src/utils/format-currency";

import DashboardMoneyCard from "@/src/components/ui/DashboardMoneyCard";
import TitlePage from "@/src/components/common/TitlePage";
import BankModal from "@/src/components/forms/BankModal";
import MoneyCard from "@/src/components/ui/MoneyCard";
import BalanceChart from "@/src/components/ui/BalanceChart";

const DashboardPage = () => {
  const history = useDashboardHistory();
  const [range, setRange] = useState<"7D" | "1M" | "3M" | "ALL">("7D");
  const [isModalOpen, setModalOpen] = useState(false);
  const { banks, isLoading, listBanks, addBank } = useBankStore();

  // re-carrega lista de bancos
  useEffect(() => {
    listBanks();
  }, [listBanks]);

  // filtra período
  const filtered = (() => {
    if (range === "ALL") return history;
    const now = Date.now();
    const cutoff = {
      "7D": now - 7 * 24 * 3600 * 1e3,
      "1M": now - 30 * 24 * 3600 * 1e3,
      "3M": now - 90 * 24 * 3600 * 1e3,
    }[range];
    return history.filter((pt) => new Date(pt.date).getTime() >= cutoff);
  })();

  const handleCreate = async (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => {
    await addBank(data.bankName, data.currencyType, data.initialValue);
    setModalOpen(false);
  };

  if (isLoading) return <p>Carregando seus bancos…</p>;

  return (
    <>
      <BankModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <section>
        <TitlePage text="Dashboard" />

        <DashboardMoneyCard banks={banks} />

        <div className="bg-dark/50 mt-4 rounded-lg p-4">
          <div className="flex gap-2">
            {(["7D", "1M", "3M", "ALL"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded px-2 py-1 ${range === r ? "bg-blue-600 text-white" : "bg-dark/30"}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="bg-dark/50 mt-4 rounded-lg p-4">
            <BalanceChart data={filtered} />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <TitlePage text="Meus cartões" />
            <button
              className="bg-light text-dark rounded-md hover:opacity-80"
              onClick={() => setModalOpen(true)}
            >
              <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium">
                Adicionar <PlusCircleIcon size={20} strokeWidth={1.5} />
              </div>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4 overflow-auto pb-4">
            {banks.map((b: Bank) => (
              <Link href={`/wallets/${b.id}`} key={b.id}>
                <MoneyCard
                  label={b.bankName}
                  value={formatCurrency(b.currencyValue)}
                  currency={b.currencyType}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
