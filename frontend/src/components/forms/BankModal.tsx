import React, { useEffect, useState, FormEvent } from "react";
import { NumericFormat } from "react-number-format";

export interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    bankName: string;
    currencyType: string;
    initialValue?: number;
  }) => void;
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-dark text-light relative w-full max-w-md rounded-lg p-6 shadow-xl"
      >
        <h3 className="text-2xl font-medium">Cadastrar Banco</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input
              type="text"
              name="bankName"
              required
              className="mt-1 w-full rounded border px-3 py-2 outline-none"
              placeholder="Nubank, Itaú, Wise"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Moeda</label>
            <select
              name="currencyType"
              className="bg-dark mt-1 w-full rounded border px-3 py-2 outline-none"
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
              className="mt-1 w-full rounded border px-3 py-2 outline-none"
              placeholder="200"
              required
              value={initialValue}
              onValueChange={(values) => {
                setInitialValue(values.floatValue ?? 0);
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            className="rounded border px-4 py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button type="submit" className="rounded bg-blue-600 px-4 py-2">
            Criar
          </button>
        </div>
      </form>
    </div>
  );
}
