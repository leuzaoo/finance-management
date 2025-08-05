import React, { useEffect, useState, FormEvent } from "react";
import { NumericFormat } from "react-number-format";

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

const inputStyle =
  "bg-white border-dark-20 dark:text-dark dark:bg-dark-light max-w-max pr-2 dark:border-light/10 dark:text-light w-full rounded-md shadow-md border py-2 pl-2 outline-none";

export default function BankModal({
  isOpen,
  onClose,
  onSubmit,
}: BankModalProps) {
  const [bankName, setBankName] = useState("");
  const [currencyType, setCurrencyType] = useState("BRL");
  const [initialValue, setInitialValue] = useState<number>();

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
    onSubmit({ bankName, currencyType, initialValue });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-lg border border-white/30 bg-light p-4 shadow-xl dark:bg-dark dark:text-light"
      >
        <h3 className="text-2xl font-medium">Cadastrar Banco</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <InputField
              type="text"
              placeholder="Nubank, Itaú, Wise"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Moeda</label>
            <select
              name="currencyType"
              className={inputStyle}
              value={currencyType}
              onChange={(e) => setCurrencyType(e.target.value)}
            >
              <option value="BRL">BRL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Saldo Inicial (opcional)
            </label>
            <NumericFormat
              name="initialValue"
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              suffix={` ${currencyType}`}
              className={inputStyle}
              placeholder="200"
              required
              value={initialValue}
              onValueChange={(values) => {
                setInitialValue(values.floatValue ?? 0);
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex w-full justify-end space-x-2">
          <button
            type="submit"
            className="w-full cursor-pointer rounded bg-dark px-4 py-2 font-semibold text-white hover:opacity-80 dark:bg-light dark:text-dark"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
