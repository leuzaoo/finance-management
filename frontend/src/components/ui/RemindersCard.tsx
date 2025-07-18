"use client";

import React from "react";
import { format } from "date-fns";

import { Reminder } from "@/src/store/useReminderStore";

interface RemindersCardProps {
  reminder: Reminder;
  onClick: (reminder: Reminder) => void;
}

export default function RemindersCard({
  reminder,
  onClick,
}: RemindersCardProps) {
  return (
    <li
      onClick={() => onClick(reminder)}
      className="dark:bg-light/10 font-inter hover:dark:bg-light/20 flex max-w-max cursor-pointer flex-col gap-1 rounded-md bg-light px-3 py-2 shadow-md transition-all duration-1000 hover:opacity-60"
    >
      <span className="font-zona-pro font-medium md:text-lg">
        {reminder.title}
      </span>
      {reminder.description && (
        <p className="text-dark/50 dark:text-light/40 font-archivo text-xs transition-all duration-1000 md:text-sm">
          {reminder.description}
        </p>
      )}
      <span className="dark:text-light/60 text-dark/70 text-xs font-medium transition-all duration-1000">
        {format(new Date(reminder.date), "dd/MM/yyyy")}
      </span>
    </li>
  );
}
