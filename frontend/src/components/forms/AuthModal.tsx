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
    // front-end: senha mínima de 6
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
        className="bg-dark text-light relative w-full max-w-md rounded-lg border border-white/30 p-6 shadow-xl"
      >
        <h3 className="text-2xl font-medium">Atualizar Senha</h3>

        <div className="mt-4">
          <label className="mb-1 block text-sm opacity-50">Nova senha *</label>
          <div className="relative">
            <InputField
              type={show ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="bg-dark-light border-light/10 text-light w-full rounded-md border py-2 pl-2 shadow-sm outline-none"
            />
            <button
              type="button"
              onClick={toggleShow}
              className="text-light/60 absolute inset-y-0 right-0 flex items-center pr-3"
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
            className="border-light/20 cursor-pointer rounded border px-4 py-2 hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-light text-dark hover:bg-light/80 cursor-pointer rounded px-4 py-2 font-semibold"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
