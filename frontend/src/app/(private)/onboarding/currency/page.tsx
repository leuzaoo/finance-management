"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "@/src/assets/icons/LoaderCircleIcon";

import { useRatesStore } from "@/src/store/useRatesStore";
import { useAuthStore } from "@/src/store/useAuthStore";

const CURRENCIES = ["BRL", "USD", "EUR", "GBP"] as const;

export default function ChooseCurrencyPage() {
  const router = useRouter();
  const { user, setPrimaryCurrency } = useAuthStore();
  const { fetchRates } = useRatesStore();
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (user?.primaryCurrency) router.replace("/dashboard");
  }, [user, router]);

  const handleSelect = async (code: (typeof CURRENCIES)[number]) => {
    if (busy) return;
    setBusy(code);
    await setPrimaryCurrency(code);
    await fetchRates(code);
    router.replace("/dashboard");
  };

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Qual será sua moeda principal?</h1>
      <p className="text-sm opacity-70">
        Você poderá alterar isso depois nas configurações.
      </p>
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            onClick={() => handleSelect(c)}
            disabled={busy !== null}
            className={`rounded-xl border p-4 text-lg font-medium transition ${
              busy === c ? "opacity-70" : "hover:bg-black/5"
            }`}
          >
            {busy === c ? <LoaderIcon /> : c}
          </button>
        ))}
      </div>
    </section>
  );
}
