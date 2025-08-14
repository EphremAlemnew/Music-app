import axiosInstance from "../axiosInstance";
import { store } from "@/store";
import { setAuth, clearAuth, setToken } from "@/store/slices/userSlice";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    user_type: string;
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("auth/login/", data);
  const { access, refresh, user } = response.data;

  store.dispatch(setAuth({
    user: {
      ...user,
      is_admin: user.user_type === 'admin' || user.is_admin
    },
    token: access,
    refreshToken: refresh
  }));

  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("auth/register/", data);
  const { access, refresh, user } = response.data;

  store.dispatch(setAuth({
    user: {
      ...user,
      is_admin: user.user_type === 'admin' || user.is_admin
    },
    token: access,
    refreshToken: refresh
  }));

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    const state = store.getState();
    const refreshToken = state.user.refreshToken;
    if (refreshToken) {
      await axiosInstance.post("auth/logout/", { refresh: refreshToken });
    }
  } finally {
    store.dispatch(clearAuth());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userState');
    }
    window.location.href = "/auth/login";
  }
};

export const refreshToken = async (): Promise<string> => {
  const state = store.getState();
  const refresh = state.user.refreshToken;
  if (!refresh) throw new Error("No refresh token");

  const response = await axiosInstance.post("/api/token/refresh/", {
    refresh,
  });
  const { access } = response.data;

  store.dispatch(setToken(access));
  return access;
};

export const getCurrentUser = () => {
  const state = store.getState();
  return state.user.user;
};

export const isAuthenticated = (): boolean => {
  const state = store.getState();
  return state.user.isAuthenticated && !!state.user.token;
};

export const getToken = (): string | null => {
  const state = store.getState();
  return state.user.token;
};
