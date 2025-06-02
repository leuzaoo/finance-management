"use client";
import { subDays, subMonths } from "date-fns";

type Props = {
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
};

export default function DateRangeSelector({ setFromDate, setToDate }: Props) {
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

  const mainStyle =
    "cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button onClick={handleLastWeek} className={mainStyle}>
        Última semana
      </button>
      <button onClick={handleLastMonth} className={mainStyle}>
        Último mês
      </button>
    </div>
  );
}
