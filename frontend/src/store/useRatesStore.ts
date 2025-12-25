import { create } from "zustand";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

type RatesState = {
  base: string;
  rates: Record<string, number> | null;
  updatedAt: string | null;
  isLoading: boolean;
  error: string | null;
  fetchRates: (base?: string) => Promise<void>;
  setBase: (base: string) => void;
};

export const useRatesStore = create<RatesState>((set, get) => ({
  base: "BRL",
  rates: null,
  updatedAt: null,
  isLoading: false,
  error: null,
  setBase: (base) => set({ base }),
  fetchRates: async (baseArg) => {
    const base = (baseArg || get().base || "BRL").toUpperCase();
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get("/forex/latest", {
        params: { base },
      });
      set({
        base: data.base,
        rates: data.rates,
        updatedAt: data.updatedAt,
        isLoading: false,
        error: null,
      });
    } catch {
      set({
        isLoading: false,
        error: "Não foi possível atualizar as cotações.",
      });
    }
  },
}));
