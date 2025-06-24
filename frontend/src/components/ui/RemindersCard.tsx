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
      className="bg-light/10 hover:bg-light/20 flex max-w-max cursor-pointer flex-col gap-1 rounded-md px-3 py-2 transition-colors"
    >
      <span className="font-medium">{reminder.title}</span>
      {reminder.description && (
        <p className="text-light/60 text-xs font-light">
          {reminder.description}
        </p>
      )}
      <span className="text-light/60 text-xs font-semibold">
        {format(new Date(reminder.date), "dd/MM/yyyy")}
      </span>
    </li>
  );
}
