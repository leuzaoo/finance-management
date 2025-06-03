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

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  listTransactions: (
    bankId: string,
    opts?: { from?: Date; to?: Date },
  ) => Promise<void>;

  addTransaction: (
    bankId: string,
    data: {
      type: "expense" | "income";
      amount: number;
      category: string;
      description?: string;
      date?: Date;
    },
  ) => Promise<void>;

  deleteTransaction: (bankId: string, txId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  listTransactions: async (bankId, opts) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string> = {};
      if (opts?.from) params.from = opts.from.toISOString();
      if (opts?.to) params.to = opts.to.toISOString();

      const url = `${API_URL}/${encodeURIComponent(bankId)}/history`;
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
      await get().listTransactions(bankId);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao adicionar transação.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (bankId, txId) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}/${encodeURIComponent(
        txId,
      )}`;
      await axios.delete(url);

      await get().listTransactions(bankId);
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
