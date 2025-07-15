import { useMutation, useQueryClient } from '@tanstack/react-query';
import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { tokenStorage } from '@/lib/token';
import { type AuthResponse, type User } from '@/types/api';

import { api } from './api-client';

const getUser = async (): Promise<User | null> => {
  const token = tokenStorage.getToken();
  if (!token) {
    return null;
  }
  return await api.get('/auth/authenticated-user');
};

const logout = (): Promise<void> => {
  tokenStorage.removeToken();
  return Promise.resolve();
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Obrigatório'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/sign-in', data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    tokenStorage.setToken(response.data?.accessToken ?? '');
    return response.data?.user;
  },
  logoutFn: logout,
  registerFn: () => Promise.resolve(undefined),
};

export const { useUser, useLogin, useLogout, AuthLoader } =
  configureAuth(authConfig);

export const useUpdateAuthenticatedUser = () => {
  const queryClient = useQueryClient();

  return (updatedUser: User) => {
    queryClient.setQueryData(['authenticated-user'], updatedUser);
  };
};

export const forgotPasswordInputSchema = z.object({
  email: z.string().min(1, 'Obrigatório').email('Email inválido'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const useForgotPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) => {
  const forgotPassword = useMutation({
    mutationFn: (data: ForgotPasswordInput) => {
      return api.post('/auth/forgot-password', data);
    },
    onSuccess,
    onError,
  });

  return {
    forgotPassword,
  };
};

export const resetPasswordInputSchema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
export const useResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) => {
  const resetPassword = useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: ResetPasswordInput;
      token: string;
    }) => {
      if (data.password !== data.confirmPassword) {
        throw new Error('Senhas não coincidem');
      }
      return api.post('/auth/reset-password', {
        password: data.password,
        token,
      });
    },
    onSuccess,
    onError,
  });

  return {
    resetPassword,
  };
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
