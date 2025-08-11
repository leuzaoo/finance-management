"use client";

import React, { useEffect, useState, FormEvent } from "react";

import InputField from "../ui/InputField";

export interface PersonalDataModalProps {
  isOpen: boolean;
  firstName: string;
  email: string;
  onClose: () => void;
  onSubmit: (data: { firstName: string }) => void;
}

export default function PersonalDataModal({
  isOpen,
  firstName: initialFirstName,
  email,
  onClose,
  onSubmit,
}: PersonalDataModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName);

  useEffect(() => {
    if (isOpen) {
      setFirstName(initialFirstName);
    }
  }, [isOpen, initialFirstName]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName: firstName.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="dark:bg-dark bg-white text-dark dark:text-light relative w-full max-w-md rounded-lg border border-white/30 p-6 shadow-xl"
      >
        <h3 className="text-2xl font-bold">Dados Pessoais</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm opacity-70">
              Primeiro nome
            </label>
            <InputField
              type="text"
              placeholder="Seu nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-70">Email</label>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              disabled
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="border-red-500 text-red-500 cursor-pointer rounded border px-4 py-2 hover:bg-red-500 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="dark:bg-light bg-dark text-white dark:text-dark hover:bg-opacity-70 dark:hover:bg-blue-500 dark:hover:text-white cursor-pointer rounded px-4 py-2 font-semibold"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
