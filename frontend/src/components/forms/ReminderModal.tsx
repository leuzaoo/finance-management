// src/components/forms/ReminderModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TitlePage from "../common/TitlePage";
import { Reminder } from "@/src/store/useReminderStore";

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
    if (!date) errs.date = "Data é obrigatória.";
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
        className="bg-light text-dark relative z-10 w-full max-w-md rounded-lg border p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
        <TitlePage text={reminder ? "Editar Lembrete" : "Novo Lembrete"} />
        <div className="mt-4 space-y-4">
          <div>
            <label className="block font-medium">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-dark mt-1 w-full rounded border px-3 py-2 outline-none"
              placeholder="Ex: Pagar fatura"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Data *</label>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => d && setDate(d)}
              className="text-dark mt-1 w-full rounded border px-3 py-2 outline-none"
              dateFormat="dd/MM/yyyy"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-dark mt-1 w-full rounded border px-3 py-2 outline-none"
              placeholder="Observações (opcional)"
              rows={3}
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
              className="flex-1 rounded border border-red-500 py-2 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Excluir
            </button>
          )}
          <button
            type="submit"
            className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            {reminder ? "Salvar" : "Criar"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
