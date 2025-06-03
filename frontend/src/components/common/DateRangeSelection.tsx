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
  const mainStyle = "cursor-pointer rounded bg-blue-500 px-3 py-1 text-white";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={handleLastWeek}
        className={`${mainStyle} hover:bg-blue-600`}
      >
        Última semana
      </button>
      <button
        onClick={handleLastMonth}
        className={`${mainStyle} hover:bg-blue-600`}
      >
        Último mês
      </button>

      <button
        onClick={clearFilters}
        disabled={noFiltersApplied}
        className={`rounded bg-blue-500 px-3 py-1 text-white ${noFiltersApplied ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-blue-600"} `}
      >
        Limpar filtros
      </button>
    </div>
  );
}
