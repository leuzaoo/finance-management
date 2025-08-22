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
      className="flex max-w-max cursor-pointer flex-col gap-1 rounded-md bg-light px-3 py-2 shadow-md transition-all duration-1000 hover:opacity-60 dark:bg-light/10 hover:dark:bg-light/20"
    >
      <span className="font-zona-pro font-medium md:text-lg">
        {reminder.title}
      </span>
      {reminder.description && (
        <p className="font-archivo text-xs text-dark/50 transition-all duration-1000 dark:text-light/40 md:text-sm">
          {reminder.description}
        </p>
      )}
      <span className="text-xs font-medium text-dark/70 transition-all duration-1000 dark:text-light/60">
        {format(new Date(reminder.date), "dd/MM/yyyy")}
      </span>
    </li>
  );
}
