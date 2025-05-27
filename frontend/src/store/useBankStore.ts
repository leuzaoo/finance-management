import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/banks`;

interface BankFromApi {
  _id: string;
  bankName: string;
  currencyType: string;
  currencyValue: number;
  createdAt: string;
}

export interface Bank {
  id: string;
  bankName: string;
  currencyType: string;
  currencyValue: number;
  createdAt: string;
}

export interface BankState {
  banks: Bank[];
  isLoading: boolean;
  error: string | null;

  listBanks: () => Promise<void>;
  addBank: (
    bankName: string,
    currencyType: string,
    currencyValue?: number,
  ) => Promise<void>;
  updateBankValue: (bankId: string, currencyValue: number) => Promise<void>;
  deleteBank: (bankId: string) => Promise<void>;
}

const normalizeBanks = (items: BankFromApi[]): Bank[] =>
  items.map(({ _id, ...rest }) => ({ id: _id, ...rest }));

async function safe<T>(
  action: () => Promise<T>,
  handleError: (err: unknown) => void,
): Promise<T | null> {
  try {
    return await action();
  } catch (err) {
    handleError(err);
    return null;
  }
}

export const useBankStore = create<BankState>((set, get) => ({
  banks: [],
  isLoading: false,
  error: null,

  listBanks: async () => {
    set({ isLoading: true, error: null });
    const res = await safe(
      () => axios.get<BankFromApi[]>(API_URL),
      (err) => {
        const msg = (err as AxiosError<{ message: string }>)?.response?.data
          .message;
        toast.error(msg || "Erro ao carregar bancos.");
        set({ error: msg || "Erro ao carregar bancos." });
      },
    );
    if (res) {
      set({ banks: normalizeBanks(res.data) });
    }
    set({ isLoading: false });
  },

  addBank: async (bankName, currencyType, currencyValue = 0) => {
    set({ isLoading: true, error: null });
    const res = await safe(
      () =>
        axios.post(API_URL, {
          bankName,
          currencyType,
          currencyValue,
        }),
      (err) => {
        const msg = (err as AxiosError<{ message: string }>)?.response?.data
          .message;
        toast.error(msg || "Erro ao criar banco.");
        set({ error: msg || "Erro ao criar banco." });
      },
    );
    if (res) {
      toast.success("Banco criado com sucesso!");
      await get().listBanks();
    }
    set({ isLoading: false });
  },

  updateBankValue: async (bankId, currencyValue) => {
    set({ isLoading: true, error: null });
    const url = `${API_URL}/${bankId}/value`;
    const res = await safe(
      () => axios.put(url, { currencyValue }),
      (err) => {
        const msg = (err as AxiosError<{ message: string }>)?.response?.data
          .message;
        toast.error(msg || "Erro ao atualizar saldo.");
        set({ error: msg || "Erro ao atualizar saldo." });
      },
    );
    if (res) {
      toast.success("Saldo atualizado com sucesso!");
      set((state) => ({
        banks: state.banks.map((b) =>
          b.id === bankId ? { ...b, currencyValue } : b,
        ),
      }));
    }
    set({ isLoading: false });
  },

  deleteBank: async (bankId) => {
    set({ isLoading: true, error: null });
    const res = await safe(
      () => axios.delete(`${API_URL}/${bankId}`),
      (err) => {
        const msg = (err as AxiosError<{ message: string }>)?.response?.data
          .message;
        toast.error(msg || "Erro ao deletar banco.");
        set({ error: msg || "Erro ao deletar banco." });
      },
    );
    if (res) {
      toast.success("Banco deletado com sucesso!");

      set((state) => ({
        banks: state.banks.filter((b) => b.id !== bankId),
      }));
    }
    set({ isLoading: false });
  },
}));
