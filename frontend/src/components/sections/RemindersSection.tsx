"use client";

import { PlusIcon } from "lucide-react";

import { useReminderStore, type Reminder } from "@/src/store/useReminderStore";

import RemindersCard from "../ui/RemindersCard";
import TitlePage from "../common/TitlePage";

type Props = {
  onCreate: () => void;
  onEdit: (rem: Reminder) => void;
};

export default function RemindersSection({ onCreate, onEdit }: Props) {
  const { reminders, isLoading: remLoading } = useReminderStore();

  return (
    <>
      <div className="flex items-center justify-between">
        <TitlePage text="Lembretes" />
        <button
          onClick={onCreate}
          aria-label="Adicionar lembrete"
          className="rounded-full border border-black/10 bg-white/60 p-1 text-black/80 backdrop-blur transition hover:bg-white/80 active:translate-y-[1px] dark:border-white/10 dark:bg-white/10 dark:text-white/85 dark:hover:bg-white/15"
        >
          <PlusIcon size={20} />
        </button>
      </div>

      {remLoading ? (
        <div className="mt-3 space-y-2">
          <div className="h-14 animate-pulse rounded-xl border border-black/10 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/10" />
          <div className="h-14 animate-pulse rounded-xl border border-black/10 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/10" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="mt-3 rounded-xl border border-black/10 bg-white/70 p-4 text-sm text-black/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          Nenhum lembrete adicionado.
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-2 rounded-xl border border-black/10 bg-white/60 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10">
          {reminders.map((r) => (
            <RemindersCard
              key={r._id}
              reminder={r}
              onClick={(rem) => onEdit(rem)}
            />
          ))}
        </ul>
      )}
    </>
  );
}
