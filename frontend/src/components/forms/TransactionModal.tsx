"use client";

import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import { X } from "lucide-react";

import ModalOverlay from "@/src/components/ui/ModalOverlay";
import { TRANSACTION_CATEGORIES } from "@/src/utils/transaction.categories";
import { useTransactionStore } from "@/src/store/useTransactionStore";
import TitlePage from "../common/TitlePage";
import InputField from "../ui/InputField";

interface TransactionModalProps {
  bankId: string;
  isOpen: boolean;
  currencyType: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type TransactionType = "expense" | "income";

export default function TransactionModal({
  bankId,
  isOpen,
  currencyType,
  onClose,
  onSuccess,
}: TransactionModalProps) {
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const isLoading = useTransactionStore((s) => s.isLoading);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | null>(new Date());

  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
    date?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setType("expense");
      setAmount(0);
      setCategory("");
      setDescription("");
      setDate(new Date());
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let hasError = false;
    if (amount == null || isNaN(amount) || amount <= 0) {
      setErrors({ amount: "Insira um valor válido maior que zero." });
      return;
    }
    if (!category) {
      setErrors((prev) => ({ ...prev, category: "Categoria é obrigatória." }));
      hasError = true;
    }
    if (!date) {
      setErrors((prev) => ({ ...prev, date: "Data é obrigatória." }));
      hasError = true;
    }
    if (hasError) return;

    try {
      await addTransaction(bankId, {
        type,
        amount: amount!,
        category,
        description: description.trim() || undefined,
        date: date!,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  if (!isOpen) return null;

  const chipBase =
    "flex-1 rounded-md border px-4 py-2 text-center text-sm font-semibold shadow-sm transition";
  const chipActive =
    "border-blue-500 bg-blue-50 text-blue-700 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300";
  const chipIdle =
    "border-black/10 bg-white/50 text-black/80 hover:bg-black/5 dark:border-white/15 dark:bg-white/5 dark:text-white/80";

  return (
    <ModalOverlay onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0b0e12]/70"
      >
        <div className="mb-2 flex items-center justify-between">
          <TitlePage text="Nova transação" />
          <button
            onClick={onClose}
            type="button"
            aria-label="Fechar"
            className="rounded-md p-1 text-black/60 transition hover:bg-black/5 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white/70 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-4 flex space-x-2 rounded-full bg-dark/5 p-1 shadow-sm dark:bg-dark-light">
          {(["expense", "income"] as TransactionType[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setType(opt)}
              className={`flex-1 cursor-pointer rounded-full py-2 text-center transition-all duration-200 ${
                type === opt
                  ? "bg-white text-xl font-semibold text-dark"
                  : "font-semibold text-dark/50 hover:bg-light/10 dark:text-light/50"
              }`}
            >
              {opt === "expense" ? "Saída" : "Entrada"}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-col space-y-3">
          <div>
            <label className="mb-1 block text-sm text-black/70 dark:text-white">
              Valor *
            </label>
            <NumericFormat
              displayType="input"
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              suffix={` ${currencyType}`}
              className="w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 font-dm_sans font-bold text-black shadow-sm outline-none backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white"
              value={amount}
              onValueChange={(values) =>
                setAmount(values.floatValue ?? undefined)
              }
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-black/70 dark:text-white">
              Descrição
            </label>
            <InputField
              type="text"
              placeholder="(opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-black/10 bg-white/70 shadow-sm backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-black/70 dark:text-white">
            Categoria *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full rounded-md border border-black/10 bg-white/70 px-1 py-2 text-dark shadow-sm backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white ${errors.category ? "ring-1 ring-red-500" : ""} `}
          >
            <option
              value=""
              className="text-dark dark:bg-dark/90 dark:text-white"
            >
              Selecionar categoria…
            </option>
            {TRANSACTION_CATEGORIES.map((c) => (
              <option
                key={c.value}
                value={c.value}
                className="text-dark dark:bg-dark/90 dark:text-white"
              >
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm text-black/70 dark:text-white">
            Data *
          </label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-dark shadow-sm outline-none backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white"
            dateFormat="dd/MM/yyyy"
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date}</p>
          )}
        </div>

        {/* ações */}
        <div className="flex w-full justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-black/50 px-4 py-2 text-black transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:translate-y-[-1px] hover:opacity-90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
