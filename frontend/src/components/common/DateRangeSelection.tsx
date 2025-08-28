"use client";
import { subDays, subMonths } from "date-fns";
import { CalendarClock, CalendarRange, RefreshCcw } from "lucide-react";

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

  const baseBtn =
    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500";
  const enabled =
    "border-black/10 bg-white text-blue-600 hover:bg-blue-50 dark:border-white/15 dark:bg-white/5 dark:text-sky-400 dark:hover:bg-white/10";
  const disabled =
    "cursor-not-allowed border-black/10 bg-white text-black/40 dark:border-white/10 dark:bg-white/5 dark:text-white/30";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleLastWeek}
        className={`${baseBtn} ${enabled}`}
        title="Filtrar pela última semana"
      >
        <CalendarClock size={16} />
        Última semana
      </button>

      <button
        onClick={handleLastMonth}
        className={`${baseBtn} ${enabled}`}
        title="Filtrar pelo último mês"
      >
        <CalendarRange size={16} />
        Último mês
      </button>

      <button
        onClick={clearFilters}
        disabled={noFiltersApplied}
        className={`${baseBtn} ${noFiltersApplied ? disabled : enabled}`}
        aria-disabled={noFiltersApplied}
        title="Limpar filtros"
      >
        <RefreshCcw
          size={16}
          className={!noFiltersApplied ? "animate-none" : ""}
        />
        Limpar filtros
      </button>
    </div>
  );
}
