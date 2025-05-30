import { toast } from "react-toastify";
import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const BANKS_PATH = "/api/v1/banks";

interface BankFromApi {
  _id: string;
  bankName: string;
  currencyType: string;
  currencyValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bank {
  id: string;
  bankName: string;
  currencyType: string;
  currencyValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface BankState {
  banks: Bank[];
  isLoading: boolean;
  error: string | null;

  listBanks: () => Promise<void>;
  getBankById: (bankId: string) => Promise<Bank>;
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

export const useBankStore = create<BankState>((set, get) => ({
  banks: [],
  isLoading: false,
  error: null,

  listBanks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get<BankFromApi[]>(BANKS_PATH);
      set({ banks: normalizeBanks(res.data) });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao carregar bancos.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  getBankById: async (bankId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get<Bank>(`${BANKS_PATH}/${bankId}`);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao buscar banco.";
      set({ error: msg });
      toast.error(msg);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  addBank: async (bankName, currencyType, currencyValue = 0) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(BANKS_PATH, { bankName, currencyType, currencyValue });
      toast.success("Banco criado com sucesso!");
      await get().listBanks();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao criar banco.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  updateBankValue: async (bankId, currencyValue) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${BANKS_PATH}/${bankId}/value`, { currencyValue });
      set((state) => ({
        banks: state.banks.map((b) =>
          b.id === bankId ? { ...b, currencyValue } : b,
        ),
      }));
      toast.success("Saldo atualizado!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao atualizar saldo.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBank: async (bankId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BANKS_PATH}/${bankId}`);
      set((state) => ({
        banks: state.banks.filter((b) => b.id !== bankId),
      }));
      toast.success("Banco deletado!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao deletar banco.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },
}));
