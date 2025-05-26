import { PlusCircleIcon } from "lucide-react";

import { formatCurrency } from "../../utils/format-currency";

import MoneyCard from "../../components/ui/MoneyCard";

const DashboardPage = () => {
  return (
    <>
      <section>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <MoneyCard
            label="Nubank"
            value={formatCurrency(1432865)}
            currency="BRL"
          />

          <MoneyCard
            label="Wise"
            value={formatCurrency(15124)}
            currency="GBP"
          />

          <div className="bg-light/10 h-24 w-56 rounded-xl">
            <div className="flex flex-col p-3">
              <div className="text-light/50 mt-2 flex flex-col items-center gap-1">
                Adicionar cartão
                <PlusCircleIcon />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
