"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";

import { Reminder } from "@/src/store/useReminderStore";

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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border bg-light p-4 text-dark dark:border-light/20 dark:bg-dark dark:text-light"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-2 cursor-pointer text-red-500"
        >
          ✕
        </button>
        <TitlePage text={reminder ? "" : "Novo Lembrete"} />
        <div className="mt-4 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 flex w-full flex-col items-center justify-center rounded-lg border-b border-dark/20 py-1 pl-2 text-2xl font-bold text-dark shadow-md outline-none placeholder:text-base placeholder:font-normal dark:border-light/20 dark:bg-dark-light dark:text-light"
              placeholder="Título do lembrete"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          <div>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => d && setDate(d)}
              className="mt-2 w-28 rounded-lg border-b border-dark/20 px-2 py-1 text-lg font-medium text-dark shadow-md outline-none dark:border-light/20 dark:bg-dark-light dark:text-light"
              dateFormat="dd/MM/yyyy"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-dark/20 bg-dark/10 p-2 text-dark shadow-md outline-none dark:border-light/20 dark:bg-dark-light dark:text-light"
              placeholder="Observações (opcional)"
              rows={2}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          {reminder && (
            <button
              type="button"
              onClick={() => {
                onDelete(reminder._id);
                onClose();
              }}
              className="flex-1 cursor-pointer rounded border border-red-500 py-2 text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
            >
              Finalizar & Excluir
            </button>
          )}
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-lg bg-dark py-2 text-white transition-all duration-200 hover:opacity-80 dark:bg-white dark:text-dark"
          >
            {reminder ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
