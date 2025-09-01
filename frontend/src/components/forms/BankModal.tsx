"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";

import { NumericFormat } from "react-number-format";
import { X } from "lucide-react";

import ModalOverlay from "@/src/components/ui/ModalOverlay";
import InputField from "../ui/InputField";

export interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => void;
}

const CURRENCIES = ["BRL", "USD", "EUR", "GBP"] as const;
const flags: Record<(typeof CURRENCIES)[number], string> = {
  BRL: "/brazil-flag.png",
  USD: "/usa-flag.png",
  EUR: "/euro-flag.png",
  GBP: "/uk-flag.png",
};

export default function BankModal({
  isOpen,
  onClose,
  onSubmit,
}: BankModalProps) {
  const [bankName, setBankName] = useState("");
  const [currencyType, setCurrencyType] =
    useState<(typeof CURRENCIES)[number]>("BRL");
  const [initialValue, setInitialValue] = useState<number>(0);
  const canSubmit = bankName.trim().length >= 2;

  useEffect(() => {
    if (isOpen) {
      setBankName("");
      setCurrencyType("BRL");
      setInitialValue(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ bankName: bankName.trim(), currencyType, initialValue });
  };

  return (
    <ModalOverlay onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0b0e12]/70"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight text-dark dark:text-white">
            Cadastrar Banco
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-black/60 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white/70 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-dark opacity-70 dark:text-white">
              Nome
            </label>
            <InputField
              type="text"
              placeholder="Nubank, Itaú, Wise"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="bg-white/70 dark:border-white/15 dark:bg-white/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-dark opacity-70 dark:text-white">
              Moeda
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CURRENCIES.map((c) => {
                const active = currencyType === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrencyType(c)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-sm font-medium shadow-sm transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300"
                        : "border-black/10 bg-white/50 text-black/80 hover:bg-black/5 dark:border-white/15 dark:bg-white/5 dark:text-white/80"
                    } `}
                  >
                    <Image
                      src={flags[c]}
                      alt={`Bandeira ${c}`}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-dark opacity-70 dark:text-white">
              Saldo Inicial (opcional)
            </label>
            <NumericFormat
              name="initialValue"
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              suffix={` ${currencyType}`}
              className="w-full rounded-md border border-dark/20 bg-white/70 px-3 py-2 text-dark shadow-sm outline-none backdrop-blur focus:ring-1 focus:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white"
              placeholder="0"
              value={initialValue}
              onValueChange={(values) => {
                setInitialValue(values.floatValue ?? 0);
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex w-full justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/50 px-4 py-2 text-dark transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-white transition hover:translate-y-[-1px] hover:opacity-90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black"
          >
            Salvar
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
