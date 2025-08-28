"use client";

import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { CalendarIcon, XIcon } from "lucide-react";

type Props = {
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
};

const dateFormat = "dd/MM/yyyy";

const DateInput = forwardRef<
  HTMLButtonElement,
  {
    value?: string;
    onClick?: () => void;
    placeholder?: string;
    onClear?: () => void;
    label?: string;
  }
>(function DateInput({ value, onClick, placeholder, onClear }, ref) {
  const hasValue = !!value;
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-black/[0.02] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <CalendarIcon size={16} className="opacity-70" />
      <span
        className={`min-w-[92px] text-left ${hasValue ? "" : "opacity-50"}`}
      >
        {hasValue ? value : placeholder}
      </span>
      {hasValue && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="ml-1 inline-flex rounded-md p-1 text-black/60 transition hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white/70 dark:hover:bg-white/10"
          aria-label="Limpar data"
          title="Limpar data"
        >
          <XIcon size={14} />
        </span>
      )}
    </button>
  );
});

export default function DateFilters({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="opacity-70">De:</span>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          customInput={
            <DateInput
              placeholder="dd/mm/aaaa"
              onClear={() => setFromDate(null)}
            />
          }
          dateFormat={dateFormat}
          shouldCloseOnSelect
          showPopperArrow={false}
          popperClassName="z-50"
          calendarClassName="rounded-xl border border-black/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#0f1115]"
          dayClassName={() =>
            "rounded-md hover:bg-black/5 focus:outline-none dark:hover:bg-white/10"
          }
          weekDayClassName={() => "text-xs opacity-60"}
          wrapperClassName="inline-block"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="opacity-70">Até:</span>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          customInput={
            <DateInput
              placeholder="dd/mm/aaaa"
              onClear={() => setToDate(null)}
            />
          }
          dateFormat={dateFormat}
          shouldCloseOnSelect
          showPopperArrow={false}
          popperClassName="z-50"
          calendarClassName="rounded-xl border border-black/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#0f1115]"
          dayClassName={() =>
            "rounded-md hover:bg-black/5 focus:outline-none dark:hover:bg-white/10"
          }
          weekDayClassName={() => "text-xs opacity-60"}
          wrapperClassName="inline-block"
        />
      </div>
    </div>
  );
}
