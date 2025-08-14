import axiosInstance from "../axiosInstance";

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
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("auth/login/", data);
  const { access, refresh, user } = response.data;

  localStorage.setItem("token", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("auth/register/", data);
  const { access, refresh, user } = response.data;

  localStorage.setItem("token", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    await axiosInstance.post("auth/logout/", { refresh: refreshToken });
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  }
};

export const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token");

  const response = await axiosInstance.post("/api/token/refresh/", {
    refresh,
  });
  const { access } = response.data;

  localStorage.setItem("token", access);
  return access;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};
