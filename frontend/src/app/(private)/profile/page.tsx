"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
const flag: Record<string, string> = {
  BRL: "/brazil-flag.png",
  GBP: "/uk-flag.png",
  USD: "/usa-flag.png",
  EUR: "/euro-flag.png",
};

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
    setTimeout(() => router.push("/login"), 1500);
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
        <div className="mx-auto flex h-full max-w-md items-center justify-center">
          <LoaderIcon />
        </div>
      ) : (
        <div className="mx-auto mb-5 max-w-md space-y-4 2md:mt-10">
          <div className="flex items-center justify-between">
            <TitlePage text="Meu Perfil" />
            <button aria-label="Alterar tema">
              <ThemeSwitch />
            </button>
          </div>

          <section className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-[#0b0e12]/60">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gradient-to-br from-black/5 to-black/0 p-2 dark:from-white/10">
                <UserCircle2 size={40} strokeWidth={1} />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight md:text-xl">
                  {profile.firstName}
                </p>
                <p className="text-sm opacity-70">{profile.email}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-[#0b0e12]/60">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight md:text-xl">
                Dados Pessoais
              </h2>
              <button
                onClick={() => setPdModalOpen(true)}
                title="Editar Dados Pessoais"
                className="rounded-xl border border-black/10 px-2 py-1 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:hover:bg-white/10"
              >
                <PencilLineIcon size={16} className="opacity-70" />
              </button>
            </div>

            <div className="grid gap-3">
              <div>
                <span className="block text-xs opacity-70 md:text-sm">
                  Primeiro nome
                </span>
                <p className="text-sm md:text-base">{profile.firstName}</p>
              </div>
              <div>
                <span className="block text-xs opacity-70 md:text-sm">
                  Email
                </span>
                <p className="text-sm md:text-base">{profile.email}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-[#0b0e12]/60">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight md:text-xl">
                Moeda principal
              </h2>
              <button
                onClick={() => setEditCurrencyOpen((v) => !v)}
                title="Alterar moeda principal"
                className="rounded-xl border border-black/10 px-2 py-1 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:hover:bg-white/10"
              >
                <PencilLineIcon size={16} className="opacity-70" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentCurrency ? (
                <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-0.5 text-sm dark:border-white/15">
                  <Image
                    src={flag[currentCurrency]}
                    alt={`Bandeira ${currentCurrency}`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="font-medium md:text-base">
                    {currentCurrency}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-black/50 dark:text-white/50">
                  —
                </span>
              )}
            </div>

            {editCurrencyOpen && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrencyDraft(c)}
                      disabled={savingCurrency}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-sm font-medium shadow-sm transition-all ${
                        currencyDraft === c
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300"
                          : "border-black/10 bg-white/50 text-black/80 hover:bg-black/5 dark:border-white/15 dark:bg-white/5 dark:text-white/80"
                      } ${savingCurrency ? "cursor-not-allowed opacity-50" : ""} `}
                    >
                      <Image
                        src={flag[c]}
                        alt={`Bandeira ${c}`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      {c}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveCurrency}
                    disabled={savingCurrency}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:translate-y-[-1px] hover:bg-blue-500 active:translate-y-0 disabled:opacity-60"
                  >
                    {savingCurrency ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => setEditCurrencyOpen(false)}
                    disabled={savingCurrency}
                    className="rounded-xl border border-black/10 px-4 py-2 transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-[#0b0e12]/60">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight md:text-xl">
                Autenticação
              </h2>
              <button
                onClick={() => setAuthModalOpen(true)}
                title="Editar Senha"
                className="rounded-xl border border-black/10 px-2 py-1 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/15 dark:hover:bg-white/10"
              >
                <PencilLineIcon size={16} className="opacity-70" />
              </button>
            </div>

            <div>
              <span className="block text-xs opacity-70">Senha</span>
              <p className="text-sm md:text-base">••••••••••••</p>
            </div>
          </section>

          <button
            onClick={handleLogout}
            className={`mb-2 w-full rounded-2xl bg-red-600/90 py-3 font-medium text-white shadow-sm backdrop-blur transition hover:translate-y-[-1px] hover:bg-red-600 active:translate-y-0 ${
              logoutLoading && "cursor-not-allowed opacity-60"
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
