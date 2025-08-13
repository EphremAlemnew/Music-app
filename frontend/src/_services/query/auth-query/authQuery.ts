import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
