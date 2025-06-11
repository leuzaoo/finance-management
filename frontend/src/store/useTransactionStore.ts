import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1/transactions"
    : "/api/v1/transactions";

export type Transaction = {
  _id: string;
  bank: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  description?: string;
  date: string;
};

export type CategorySummary = {
  category: string;
  total: number;
};

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  listTransactions: (
    bankId: string,
    opts?: { from?: Date; to?: Date },
  ) => Promise<void>;

  addTransaction: (bankId: string, data: any) => Promise<void>;
  deleteTransaction: (
    bankId: string,
    txId: string,
    opts?: { from?: Date; to?: Date },
  ) => Promise<void>;

  categorySummary: CategorySummary[];
  isCategoryLoading: boolean;
  getCategorySummary: (
    bankId: string,
    opts?: { from?: Date; to?: Date },
  ) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  categorySummary: [],
  isCategoryLoading: false,

  listTransactions: async (bankId, opts) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string> = {};
      if (opts?.from) {
        const start = new Date(opts.from);
        start.setHours(0, 0, 0, 0);
        params.from = start.toISOString();
      }
      if (opts?.to) {
        const end = new Date(opts.to);
        end.setHours(23, 59, 59, 999);
        params.to = end.toISOString();
      }

      const url = `${API_URL}/${bankId}/history`;
      const res: AxiosResponse<Transaction[]> = await axios.get(url, {
        params,
      });
      set({ transactions: res.data, isLoading: false });
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao buscar histórico.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  getCategorySummary: async (bankId, opts) => {
    set({ isCategoryLoading: true, error: null });
    try {
      const params: Record<string, string> = {};
      if (opts?.from) {
        const start = new Date(opts.from);
        start.setHours(0, 0, 0, 0);
        params.from = start.toISOString();
      }
      if (opts?.to) {
        const end = new Date(opts.to);
        end.setHours(23, 59, 59, 999);
        params.to = end.toISOString();
      }

      const url = `${API_URL}/${bankId}/summary/categories`;
      const res: AxiosResponse<CategorySummary[]> = await axios.get(url, {
        params,
      });
      set({ categorySummary: res.data, isCategoryLoading: false });
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg =
        e.response?.data.message || "Erro ao buscar resumo por categoria.";
      set({ error: msg, isCategoryLoading: false });
      toast.error(msg);
    }
  },

  addTransaction: async (bankId, data) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}/add`;
      await axios.post(url, {
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date?.toISOString(),
      });

      toast.success("Transação adicionada com sucesso!");

      await get().listTransactions(bankId, data.opts);
      await get().getCategorySummary(bankId, data.opts);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao adicionar transação.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (bankId, txId, opts) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}/${encodeURIComponent(
        txId,
      )}`;
      await axios.delete(url);

      await get().listTransactions(bankId, opts);
      await get().getCategorySummary(bankId, opts);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao deletar transação.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },
}));
