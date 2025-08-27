"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilLineIcon, UserCircle2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { useUserStore } from "@/src/store/useUserStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRatesStore } from "@/src/store/useRatesStore";

import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";
import PersonalDataModal from "@/src/components/forms/PersonalDataModal";
import TitlePage from "@/src/components/common/TitlePage";
import ThemeSwitch from "@/src/components/ui/ThemeSwitch";
import AuthModal from "@/src/components/forms/AuthModal";

const CURRENCIES = ["BRL", "USD", "EUR", "GBP"] as const;

export default function ProfilePage() {
  const router = useRouter();

  const { profile, isLoading, getProfile, updateProfile } = useUserStore();
  const {
    user,
    logout,
    isLoading: logoutLoading,
    setPrimaryCurrency,
  } = useAuthStore();
  const { fetchRates } = useRatesStore();

  const [pdModalOpen, setPdModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [editCurrencyOpen, setEditCurrencyOpen] = useState(false);
  const [currencyDraft, setCurrencyDraft] = useState<
    (typeof CURRENCIES)[number] | ""
  >("");
  const [savingCurrency, setSavingCurrency] = useState(false);

  const currentCurrency = (user?.primaryCurrency ?? null) as
    | (typeof CURRENCIES)[number]
    | null;

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/login");
    }
  }, [isLoading, profile, router]);

  useEffect(() => {
    if (editCurrencyOpen) {
      setCurrencyDraft((currentCurrency as any) || "BRL");
    }
  }, [editCurrencyOpen, currentCurrency]);

  const readableCurrency = useMemo(() => {
    const map: Record<string, string> = {
      BRL: "Real (BRL)",
      USD: "Dólar (USD)",
      EUR: "Euro (EUR)",
      GBP: "Libra (GBP)",
    };
    return currentCurrency ? map[currentCurrency] : "—";
  }, [currentCurrency]);

  const handleLogout = async () => {
    await logout();
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  const handlePersonalSubmit = async (data: { firstName: string }) => {
    await updateProfile({ firstName: data.firstName });
    toast.success("Dados pessoais atualizados!");
    setPdModalOpen(false);
  };

  const handleAuthSubmit = async (data: { password: string }) => {
    await updateProfile({ password: data.password });
    toast.success("Senha atualizada!");
    setAuthModalOpen(false);
  };

  const handleSaveCurrency = async () => {
    if (!currencyDraft) return;
    try {
      setSavingCurrency(true);
      await setPrimaryCurrency(currencyDraft as (typeof CURRENCIES)[number]);
      await fetchRates(currencyDraft as string);
      setEditCurrencyOpen(false);
    } finally {
      setSavingCurrency(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} position="top-left" />

      {isLoading || !profile ? (
        <div className="mx-auto max-w-md py-10">
          <LoaderIcon />
        </div>
      ) : (
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <TitlePage text="Meu Perfil" />
            <button>
              <ThemeSwitch />
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle2 size={40} strokeWidth={1} />
                <div>
                  <p className="font-medium">{profile.firstName}</p>
                  <p className="text-sm font-light">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold 2md:text-xl">Dados Pessoais</h2>
              <button
                onClick={() => setPdModalOpen(true)}
                title="Editar Dados Pessoais"
                className="cursor-pointer rounded-lg border border-dark/20 px-2 py-1 transition-all duration-1000 dark:border-light/20"
              >
                <PencilLineIcon
                  size={16}
                  className="transition-all duration-1000 dark:text-light/50 md:text-dark/50"
                />
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
                Primeiro nome
              </label>
              <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
                {profile.firstName}
              </p>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
                Email
              </label>
              <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold 2md:text-xl">Moeda principal</h2>
              <button
                onClick={() => setEditCurrencyOpen((v) => !v)}
                title="Alterar moeda principal"
                className="cursor-pointer rounded-lg border border-dark/20 px-2 py-1 transition-all duration-1000 dark:border-light/20"
              >
                <PencilLineIcon
                  size={16}
                  className="transition-all duration-1000 dark:text-light/50 md:text-dark/50"
                />
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
                Selecionada
              </label>
              <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
                {readableCurrency}
              </p>
            </div>

            {editCurrencyOpen && (
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <select
                  className="w-full rounded-lg border border-dark/20 bg-transparent p-2 dark:border-light/20"
                  value={currencyDraft}
                  onChange={(e) => setCurrencyDraft(e.target.value as any)}
                  disabled={savingCurrency}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCurrency}
                    disabled={savingCurrency}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500 disabled:opacity-60"
                  >
                    {savingCurrency ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => setEditCurrencyOpen(false)}
                    disabled={savingCurrency}
                    className="rounded-lg border border-dark/20 px-4 py-2 transition dark:border-light/20"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-dark/10 p-4 transition-all duration-1000 dark:border-light/10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold 2md:text-xl">Autenticação</h2>
              <button
                onClick={() => setAuthModalOpen(true)}
                title="Editar Senha"
                className="cursor-pointer rounded-lg border border-dark/20 px-2 py-1 dark:border-light/20"
              >
                <PencilLineIcon
                  size={16}
                  className="text-dark/50 dark:text-light/50"
                />
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-dark/50 transition-all duration-1000 dark:text-light/50 2md:text-base">
                Senha
              </label>
              <p className="text-dark transition-all duration-1000 dark:text-light 2md:text-lg">
                ••••••••••••
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`mt-4 w-full cursor-pointer rounded-xl bg-red-600 py-3 text-center font-medium text-white transition-all duration-200 hover:bg-red-400 ${
              logoutLoading && "cursor-not-allowed opacity-50"
            }`}
          >
            {logoutLoading ? <LoaderIcon /> : "Sair da conta"}
          </button>
        </div>
      )}

      <PersonalDataModal
        isOpen={pdModalOpen}
        firstName={profile?.firstName ?? ""}
        email={profile?.email ?? ""}
        onClose={() => setPdModalOpen(false)}
        onSubmit={handlePersonalSubmit}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSubmit={handleAuthSubmit}
      />
    </>
  );
}
