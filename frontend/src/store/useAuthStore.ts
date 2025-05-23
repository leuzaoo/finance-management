import axios, { type AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const AUTH_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1"
    : "/api/v1";

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export interface User {
  id: string;
  firstName?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  message: string | null;
  error: string | null;
  loadUserFromStorage: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    firstName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

const loadUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const userJSON = localStorage.getItem("auth_user");
    return userJSON ? JSON.parse(userJSON) : null;
  } catch {
    return null;
  }
};

const initialUser = loadUserFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,
  error: null,
  message: null,

  loadUserFromStorage: () => {
    const user = loadUserFromStorage();
    set({ user, isAuthenticated: !!user });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response: AxiosResponse<{
        token: string;
        user: User;
        message: string;
      }> = await axios.post(`${AUTH_API_URL}/login`, { email, password });

      localStorage.setItem("auth_user", JSON.stringify(response.data.user));

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: response.data.message || "Login realizado.",
      });

      toast.success(response.data.message || "Login realizado.");
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const resp = axiosError.response;
      const msg = resp?.data?.message || "Erro ao fazer login";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  register: async (firstName, email, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response: AxiosResponse<{
        token: string;
        user: User;
        message: string;
      }> = await axios.post(`${AUTH_API_URL}/register`, {
        firstName,
        email,
        password,
      });
      localStorage.setItem("auth_user", JSON.stringify(response.data.user));

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: response.data.message || "Conta criada com sucesso.",
      });

      toast.success(response.data.message || "Conta criada com sucesso.");
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const resp = axiosError.response;
      const msg =
        resp?.data?.message || "Erro ao criar a conta. Verifique os dados.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: false });

    try {
      await axios.post(`${AUTH_API_URL}/logout`);
    } catch (err) {
      console.error("Erro ao fazer logout no servidor:", err);
    } finally {
      localStorage.removeItem("auth_user");
      deleteCookie("token");

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        message: null,
      });

      toast.success("Logout realizado com sucesso!");
    }
  },
}));
