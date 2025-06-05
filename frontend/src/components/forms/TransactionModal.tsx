"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";

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
      setErrors((prev) => ({ ...prev, category: "Categoria é obrigatório." }));
      hasError = true;
    }
    if (!date) {
      setErrors((prev) => ({ ...prev, category: "Data é obrigatório." }));
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

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-dark relative z-10 w-full max-w-md rounded-lg border border-white/30 p-4 text-white"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-red-600"
        >
          ✕
        </button>

        <TitlePage text="Nova transação" />

        <div className="bg-dark-light my-4 flex space-x-2 rounded-full p-1">
          {(["expense", "income"] as TransactionType[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setType(opt)}
              className={`flex-1 cursor-pointer rounded-full py-2 text-center transition-all duration-200 ${
                type === opt
                  ? "text-dark bg-white text-xl font-semibold"
                  : "text-light/50 hover:bg-light/10"
              }`}
            >
              {opt === "expense" ? "Saída" : "Entrada"}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium">Valor *</label>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              suffix={` ${currencyType}`}
              className="font-inter mt-1 w-full rounded border px-3 py-2 outline-none"
              placeholder={`1.00 ${currencyType}`}
              required
              value={amount}
              onValueChange={(values) => {
                setAmount(values.floatValue ?? undefined);
              }}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <InputField
              type="text"
              placeholder="(opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Categoria *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`bg-dark-light border-light/10 mt-1 w-full rounded border px-3 py-2 text-white ${
              errors.category ? "border-red-500" : ""
            }`}
          >
            <option value="">Selecionar categoria…</option>
            {TRANSACTION_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Data *</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="bg-dark-light border-light/10 mt-1 w-full rounded border px-3 py-2 text-white"
            dateFormat="dd/MM/yyyy"
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>,
    document.body,
  );
}
