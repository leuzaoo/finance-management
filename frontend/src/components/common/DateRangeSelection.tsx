"use client";
import { subDays, subMonths } from "date-fns";

type Props = {
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
  clearFilters: () => void;
};

export default function DateRangeSelector({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  clearFilters,
}: Props) {
  const handleLastWeek = () => {
    const today = new Date();
    setFromDate(subDays(today, 7));
    setToDate(today);
  };

  const handleLastMonth = () => {
    const today = new Date();
    setFromDate(subMonths(today, 1));
    setToDate(today);
  };

  const noFiltersApplied = fromDate === null && toDate === null;
  const mainStyle =
    "cursor-pointer rounded text-blue-500 text-sm underline transition-all duration-200";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={handleLastWeek}
        className={`${mainStyle} hover:text-blue-600`}
      >
        Última semana
      </button>
      <button
        onClick={handleLastMonth}
        className={`${mainStyle} hover:text-blue-600`}
      >
        Último mês
      </button>

      <button
        onClick={clearFilters}
        disabled={noFiltersApplied}
        className={`${mainStyle} ${noFiltersApplied ? "cursor-not-allowed! no-underline opacity-50" : "cursor-pointer hover:text-blue-600"} `}
      >
        Limpar filtros
      </button>
    </div>
  );
}
