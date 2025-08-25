"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import InputField from "../ui/InputField";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { password: string }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSubmit,
}: AuthModalProps) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShow(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Senha deve ter ao menos 6 caracteres.");
      return;
    }
    onSubmit({ password });
  };

  const toggleShow = () => {
    if (!show) {
      if (
        !confirm(
          "Você tem certeza que deseja exibir sua senha? Mantenha-a visível somente em ambiente seguro.",
        )
      ) {
        return;
      }
    }
    setShow((v) => !v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-lg border border-white/30 bg-white p-6 text-dark shadow-xl dark:bg-dark dark:text-light"
      >
        <h3 className="text-2xl font-bold">Atualizar Senha</h3>

        <div className="mt-4">
          <label className="mb-1 block text-sm opacity-70">Nova senha *</label>
          <div className="relative">
            <InputField
              type={show ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full rounded-md border border-light/10 bg-dark-light py-2 pl-2 text-light shadow-sm outline-none"
            />
            <button
              type="button"
              onClick={toggleShow}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark/60 dark:text-light/60"
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded bg-dark px-4 py-2 font-semibold text-white hover:bg-opacity-70 dark:bg-light dark:text-dark dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
