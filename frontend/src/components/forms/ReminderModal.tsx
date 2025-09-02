"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { X } from "lucide-react";

import { type Reminder } from "@/src/store/useReminderStore";
import ModalOverlay from "@/src/components/ui/ModalOverlay";
import TitlePage from "../common/TitlePage";

interface ReminderModalProps {
  isOpen: boolean;
  reminder?: Reminder;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; date: Date }) => void;
  onDelete: (id: string) => void;
}

export default function ReminderModal({
  isOpen,
  reminder,
  onClose,
  onSubmit,
  onDelete,
}: ReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({});

  useEffect(() => {
    if (!isOpen) return;
    setTitle(reminder?.title ?? "");
    setDescription(reminder?.description ?? "");
    setDate(reminder ? new Date(reminder.date) : new Date());
    setErrors({});
  }, [isOpen, reminder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = "Título é obrigatório.";
    if (!date) errs.date = "Insira uma data.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-2xl border border-black/10 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0b0e12]/70"
      >
        <div className="mb-2 flex items-center justify-between">
          <TitlePage text={reminder ? "" : "Novo Lembrete"} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-black/60 transition hover:bg-black/5 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white/70 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-2 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do lembrete"
              className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-lg font-semibold text-black shadow-sm outline-none backdrop-blur placeholder:font-normal focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => d && setDate(d)}
              dateFormat="dd/MM/yyyy"
              className="w-36 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-base font-medium text-black shadow-sm outline-none backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Observações (opcional)"
              className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-black shadow-sm outline-none backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {reminder && (
            <button
              type="button"
              onClick={() => {
                onDelete(reminder._id);
                onClose();
              }}
              className="flex-1 rounded-xl border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-300 dark:hover:bg-red-500/20 dark:hover:text-red-200"
            >
              Finalizar & Excluir
            </button>
          )}

          <button
            type="submit"
            className="flex-1 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:translate-y-[-1px] hover:opacity-90 active:translate-y-0 dark:border-white dark:bg-white dark:text-black"
          >
            {reminder ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
