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

  // Store refresh token somewhere persistent
  localStorage.setItem("refresh_token", refresh);

  store.dispatch(
    setAuth({
      user: {
        ...user,
        is_admin: user.user_type === "admin" || user.is_admin,
      },
      token: access,
      refreshToken: refresh,
    })
  );

  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("auth/register/", data);

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(
      "auth/logout/",
      {},
      {
        withCredentials: true,
      }
    );
  } finally {
    store.dispatch(clearAuth());
    if (typeof window !== "undefined") {
      localStorage.removeItem("userState");
      localStorage.removeItem("refresh_token");
    }
    window.location.href = "/auth/login";
  }
};

export const refreshToken = async (): Promise<string> => {
  const storedRefresh = localStorage.getItem("refresh_token");
  if (!storedRefresh) throw new Error("No refresh token stored");

  const response = await axiosInstance.post("auth/refresh/", {
    refresh: storedRefresh,
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
