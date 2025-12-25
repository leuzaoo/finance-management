import { toast } from "react-toastify";
import { create } from "zustand";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const API_URL = "/users";

export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  getProfile: () => Promise<void>;
  updateProfile: (data: {
    firstName?: string;
    password?: string;
  }) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get<UserProfile>(`${API_URL}/me`);
      set({ profile: res.data, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao carregar perfil.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axios.put<UserProfile>(`${API_URL}/me`, data);
      set({ profile: res.data, isLoading: false });
      toast.success("Perfil atualizado com sucesso.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao atualizar perfil.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },
}));
