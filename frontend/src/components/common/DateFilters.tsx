"use client";
import DatePicker from "react-datepicker";

type Props = {
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
};

const mainInputStyle =
  "border-light/30 w-full transition-all duration-1000 rounded border p-1 text-sm bg-white border-dark/10 shadow-sm dark:bg-dark/50";
const dateInputFormat = "dd/MM/yy";

export default function DateFilters({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: Props) {
  return (
    <div className="flex items-center gap-4 font-light">
      <label className="flex flex-col text-sm">
        <div className="flex items-center space-x-2">
          <span>De:</span>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            isClearable
            className={`${mainInputStyle}`}
            dateFormat={`${dateInputFormat}`}
          />
        </div>
      </label>
      <label className="flex flex-col text-sm">
        <div className="flex items-center space-x-2">
          <span>Até:</span>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            isClearable
            className={`${mainInputStyle}`}
            dateFormat={`${dateInputFormat}`}
          />
        </div>
      </label>
    </div>
  );
}
