import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1/subscriptions"
    : "/api/v1/subscriptions";

export type Subscription = {
  _id: string;
  bank: string;
  platform: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;

  addSubscription: (
    bankId: string,
    data: { platform: string; amount: number },
  ) => Promise<void>;

  updateSubscription: (
    bankId: string,
    subId: string,
    data: { platform: string; amount: number },
  ) => Promise<void>;

  listSubscriptions: (bankId: string) => Promise<void>;

  deleteSubscription: (bankId: string, subId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  listSubscriptions: async (bankId) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}`;
      const res: AxiosResponse<Subscription[]> = await axios.get(url);
      set({ subscriptions: res.data, isLoading: false });
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao buscar assinaturas.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  addSubscription: async (bankId, data) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}/add`;
      await axios.post(url, {
        platform: data.platform,
        amount: data.amount,
      });
      toast.success("Assinatura adicionada com sucesso!");

      await get().listSubscriptions(bankId);
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao adicionar assinatura.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSubscription: async (
    bankId: string,
    subId: string,
    data: { platform?: string; amount?: number },
  ) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}/${encodeURIComponent(subId)}`;
      await axios.put(url, data);
      toast.success("Assinatura atualizada com sucesso!");
      await get().listSubscriptions(bankId);
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao atualizar assinatura.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSubscription: async (bankId, subId) => {
    set({ isLoading: true, error: null });
    try {
      const url = `${API_URL}/${encodeURIComponent(bankId)}/${encodeURIComponent(
        subId,
      )}`;
      await axios.delete(url);
      toast.success("Assinatura deletada com sucesso!");
      await get().listSubscriptions(bankId);
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao deletar assinatura.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },
}));
