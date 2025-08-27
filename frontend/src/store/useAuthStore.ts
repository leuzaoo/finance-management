import axios, { type AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

axios.defaults.withCredentials = true;

const AUTH_PATH = "/api/v1";
const USERS_PATH = "/api/v1/users";

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export interface User {
  id: string;
  firstName?: string;
  email: string;
  primaryCurrency?: "BRL" | "USD" | "EUR" | "GBP" | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  message: string | null;
  error: string | null;

  loadUserFromStorage: () => void;

  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; requirePrimaryCurrency: boolean }>;
  register: (
    firstName: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; requirePrimaryCurrency: boolean }>;

  logout: () => Promise<void>;

  setPrimaryCurrency: (
    pc: NonNullable<User["primaryCurrency"]>,
  ) => Promise<void>;
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

const persistUser = (u: User) => {
  try {
    localStorage.setItem("auth_user", JSON.stringify(u));
  } catch {}
};

const initialUser = loadUserFromStorage();

export const useAuthStore = create<AuthState>((set, get) => ({
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
        message?: string;
        requirePrimaryCurrency?: boolean;
      }> = await axios.post(`${AUTH_PATH}/login`, { email, password });

      persistUser(response.data.user);

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: response.data.message || "Login realizado.",
      });

      toast.success(response.data.message || "Login realizado.");
      return {
        ok: true,
        requirePrimaryCurrency:
          !!response.data.requirePrimaryCurrency ||
          !response.data.user.primaryCurrency,
      };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg = axiosError.response?.data?.message || "Erro ao fazer login";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return { ok: false, requirePrimaryCurrency: false };
    }
  },

  register: async (firstName, email, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response: AxiosResponse<{
        token: string;
        user: User;
        message?: string;
        requirePrimaryCurrency?: boolean;
      }> = await axios.post(`${AUTH_PATH}/register`, {
        firstName,
        email,
        password,
      });

      persistUser(response.data.user);

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: response.data.message || "Conta criada com sucesso.",
      });

      toast.success(response.data.message || "Conta criada com sucesso.");
      return {
        ok: true,
        requirePrimaryCurrency:
          !!response.data.requirePrimaryCurrency ||
          !response.data.user.primaryCurrency,
      };
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        "Erro ao criar a conta. Verifique os dados.";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return { ok: false, requirePrimaryCurrency: false };
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await axios.post(`${AUTH_PATH}/logout`);
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

  setPrimaryCurrency: async (pc) => {
    if (!pc) return;
    try {
      const { data } = await axios.patch(`${USERS_PATH}/me/primary-currency`, {
        primaryCurrency: pc,
      });

      const current = get().user;
      const updated: User = {
        ...(current || { id: data.user?.id, email: data.user?.email }),
        ...data.user,
      };

      set({ user: updated });
      persistUser(updated);
      toast.success("Moeda principal atualizada!");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        "Erro ao definir moeda principal.";
      toast.error(msg);
    }
  },
}));
