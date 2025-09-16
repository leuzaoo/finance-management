"use client";
import { useEffect } from "react";

import { useRatesStore } from "@/src/store/useRatesStore";

export function useFxPolling(base: string, intervalMs = 15 * 60 * 1000) {
  const { fetchRates } = useRatesStore();

  useEffect(() => {
    fetchRates(base);
    const id = setInterval(() => fetchRates(base), intervalMs);
    return () => clearInterval(id);
  }, [base, intervalMs, fetchRates]);
}
