import axios, { type AxiosResponse, type AxiosError } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1/banks"
    : "/api/v1/banks";

export interface Bank {
  id: string;
  bankName: string;
  currencyType: string;
  currencyValue: number;
  createdAt: string;
}

interface BankState {
  banks: Bank[];
  isLoading: boolean;
  message: string | null;
  error: string | null;
  listBanks: () => Promise<void>;
  addBank: (
    bankName: string,
    currencyType: string,
    currencyValue?: number,
  ) => Promise<void>;
  updateBankValue: (bankId: string, currencyValue: number) => Promise<void>;
}

export const useBankStore = create<BankState>((set, get) => ({
  banks: [],
  isLoading: false,
  error: null,
  message: null,

  listBanks: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res: AxiosResponse<Bank[]> = await axios.get(API_URL);
      set({ banks: res.data, isLoading: false });
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao carregar bancos.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  addBank: async (bankName, currencyType, currencyValue = 0) => {
    set({ isLoading: true, error: null, message: null });
    try {
      await axios.post(API_URL, {
        bankName,
        currencyType,
        currencyValue,
      });
      toast.success("Banco criado com sucesso!");
      await get().listBanks();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao criar banco.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  updateBankValue: async (bankId, currencyValue) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const url = `${API_URL}/${bankId}/value`;
      await axios.put(url, { currencyValue });
      toast.success("Saldo atualizado com sucesso!");
      set((state) => ({
        banks: state.banks.map((b) =>
          b.id === bankId ? { ...b, currencyValue } : b,
        ),
      }));
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao atualizar saldo.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },
}));
