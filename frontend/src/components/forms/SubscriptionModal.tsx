"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NumericFormat } from "react-number-format";

import { useSubscriptionStore } from "@/src/store/useSubscriptionStore";

import TitlePage from "../common/TitlePage";
import InputField from "../ui/InputField";

interface SubscriptionModalProps {
  bankId: string;
  isOpen: boolean;
  currencyType: string;
  onClose: () => void;
  onSuccess?: () => void;
  subscriptionToEdit?: {
    _id: string;
    platform: string;
    amount: number;
  };
}

export default function SubscriptionModal({
  bankId,
  isOpen,
  currencyType,
  onClose,
  onSuccess,
  subscriptionToEdit,
}: SubscriptionModalProps) {
  const addSubscription = useSubscriptionStore((s) => s.addSubscription);
  const updateSubscription = useSubscriptionStore((s) => s.updateSubscription);
  const isLoading = useSubscriptionStore((s) => s.isLoading);

  const [platform, setPlatform] = useState<string>("");
  const [amount, setAmount] = useState<number | undefined>(undefined);

  const [errors, setErrors] = useState<{
    amount?: string;
    platform?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;
    if (subscriptionToEdit) {
      setPlatform(subscriptionToEdit.platform);
      setAmount(subscriptionToEdit.amount);
    } else {
      setPlatform("");
      setAmount(0);
    }
    setErrors({});
  }, [isOpen, subscriptionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (amount == null || isNaN(amount) || amount <= 0) {
      setErrors({ amount: "Insira um valor válido maior que zero." });
      return;
    }
    if (!platform) {
      setErrors({ platform: "Insira a plataforma de assinatura." });
      return;
    }

    try {
      if (subscriptionToEdit) {
        await updateSubscription(bankId, subscriptionToEdit._id, {
          platform,
          amount,
        });
      } else {
        await addSubscription(bankId, { platform, amount });
      }

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Error adding subscription:", err);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-lg border border-white/30 bg-dark p-4 text-white"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-red-600"
        >
          ✕
        </button>

        <TitlePage
          text={subscriptionToEdit ? "Editar assinatura" : "Nova assinatura"}
        />

        <div className="mb-4 mt-2 flex flex-col space-y-3">
          <div>
            <label className="text-md block font-medium">Valor *</label>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              suffix={` ${currencyType}`}
              className="mt-1 w-full rounded border px-3 py-2 outline-none"
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
            <label className="text-md block font-medium">Plataforma *</label>
            <InputField
              type="text"
              placeholder="Netflix, Youtube, etc."
              value={platform}
              required
              onChange={(e) => setPlatform(e.target.value)}
            />
            {errors.platform && (
              <p className="mt-1 text-xs text-red-500">{errors.platform}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading
            ? subscriptionToEdit
              ? "Atualizando..."
              : "Salvando..."
            : subscriptionToEdit
              ? "Atualizar"
              : "Salvar"}
        </button>
      </form>
    </div>,
    document.body,
  );
}
