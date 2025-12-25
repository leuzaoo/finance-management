import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const API_URL = "/reminders";

export type Reminder = {
  _id: string;
  user: string;
  title: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;

  listReminders: () => Promise<void>;
  createReminder: (data: {
    title: string;
    description?: string;
    date: Date;
  }) => Promise<void>;
  updateReminder: (
    id: string,
    data: Partial<{ title: string; description: string; date: Date }>,
  ) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  listReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: AxiosResponse<Reminder[]> = await axios.get(API_URL);
      set({ reminders: res.data, isLoading: false });
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao listar lembretes.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  createReminder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(API_URL, {
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
      });
      toast.success("Lembrete criado com sucesso!");
      await get().listReminders();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao criar lembrete.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  updateReminder: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/${encodeURIComponent(id)}`, {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.date !== undefined && { date: data.date.toISOString() }),
      });
      toast.success("Lembrete atualizado!");
      await get().listReminders();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao atualizar lembrete.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReminder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${encodeURIComponent(id)}`);
      toast.success("Lembrete removido.");
      await get().listReminders();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      const msg = e.response?.data.message || "Erro ao deletar lembrete.";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },
}));
