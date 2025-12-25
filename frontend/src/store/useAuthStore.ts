import axios, { type AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const AUTH_PATH = "";
const USERS_PATH = "/users";

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
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  isSettingPrimaryCurrency: boolean;
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
  ) => Promise<boolean>;
}

const isLocalStorageAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  const storage = window.localStorage;
  return !!storage && typeof storage.getItem === "function";
};

const loadUserFromStorage = (): User | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const userJSON = window.localStorage.getItem("auth_user");
    return userJSON ? JSON.parse(userJSON) : null;
  } catch {
    return null;
  }
};

const persistUser = (u: User) => {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem("auth_user", JSON.stringify(u));
  } catch {}
};

const removeUserFromStorage = () => {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem("auth_user");
  } catch {}
};

const initialUser = loadUserFromStorage();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,
  isLoggingIn: false,
  isRegistering: false,
  isLoggingOut: false,
  isSettingPrimaryCurrency: false,
  error: null,
  message: null,

  loadUserFromStorage: () => {
    const user = loadUserFromStorage();
    set({ user, isAuthenticated: !!user });
  },

  login: async (email, password) => {
    set({
      isLoading: true,
      isLoggingIn: true,
      error: null,
      message: null,
    });

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
      set({ error: msg });
      toast.error(msg);
      return { ok: false, requirePrimaryCurrency: false };
    } finally {
      set({ isLoading: false, isLoggingIn: false });
    }
  },

  register: async (firstName, email, password) => {
    set({
      isLoading: true,
      isRegistering: true,
      error: null,
      message: null,
    });

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
      set({ error: msg });
      toast.error(msg);
      return { ok: false, requirePrimaryCurrency: false };
    } finally {
      set({ isLoading: false, isRegistering: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, isLoggingOut: true });

    try {
      await axios.post(`${AUTH_PATH}/logout`);
    } catch (err) {
      console.error("Erro ao fazer logout no servidor:", err);
    } finally {
      removeUserFromStorage();
      deleteCookie("token");

      set({
        user: null,
        isAuthenticated: false,
        error: null,
        message: null,
        isLoading: false,
        isLoggingOut: false,
      });

      toast.success("Você saiu da sua conta.");
    }
  },

  setPrimaryCurrency: async (pc) => {
    if (!pc) return false;
    set({ isSettingPrimaryCurrency: true });
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
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        "Erro ao definir moeda principal.";
      toast.error(msg);
      return false;
    } finally {
      set({ isSettingPrimaryCurrency: false });
    }
  },
}));
