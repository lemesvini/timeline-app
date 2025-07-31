import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { Role, type User } from '@/types/api';

import { getUsersQueryOptions } from './get-users';

export const createUserInputSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Nome completo é obrigatório' })
    .min(3, { message: 'Nome completo deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'Nome completo deve ter no máximo 100 caracteres' }),
  email: z.string().min(1, { message: 'Email é obrigatório' }).email({
    message: 'Email inválido',
  }),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  role: z.nativeEnum(Role, {
    message: 'Cargo é obrigatório',
  }),
  avatarUrl: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data;
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({ mutationConfig }: UseCreateUserOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: CreateUserInput) => createUser(data),
  });
};
