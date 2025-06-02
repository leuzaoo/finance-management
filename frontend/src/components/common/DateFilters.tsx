"use client";
import DatePicker from "react-datepicker";

type Props = {
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
};

export default function DateFilters({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 font-light">
      <label className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span>De:</span>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            isClearable
            placeholderText="Data inicial"
            className="border-light/30 w-32 rounded border p-1"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </label>
      <label className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span>Até:</span>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            isClearable
            placeholderText="Data final"
            className="border-light/30 w-32 rounded border p-1"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </label>
    </div>
  );
}
