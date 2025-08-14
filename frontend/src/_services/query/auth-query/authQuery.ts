import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { LoginData, RegisterData } from "@/_services/actions/auth-actions/actions";
import {
  getCurrentUser,
  isAuthenticated,
  login,
  logout,
  register,
} from "@/_services/actions/auth-actions/actions";

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated(),
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successful! Welcome back.");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials.");
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Account created successfully! Welcome to MusicVerse.");
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully. See you soon!");
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });
};
