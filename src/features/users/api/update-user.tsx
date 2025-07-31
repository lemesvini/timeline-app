import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { uploadApi } from '@/lib/upload';
import { Role, type User } from '@/types/api';
import { useUser } from '@/lib/auth';

import { getUsersQueryOptions } from './get-users';
import { getUserQueryOptions } from './get-user';

export const updateUserInputSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Nome completo é obrigatório' })
    .max(100, { message: 'Nome completo deve ter no máximo 100 caracteres' }),
  email: z.string().min(1, { message: 'Email é obrigatório' }).email({
    message: 'Email inválido',
  }),
  role: z.nativeEnum(Role, {
    message: 'Cargo é obrigatório',
  }),
  avatarFile: z
    .instanceof(FileList)
    .optional()
    .nullable()
    .transform((fileList) => fileList?.[0]),
  avatarUrl: z.string().optional().nullable(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateUser = async ({
  data,
  userId,
}: {
  data: UpdateUserInput;
  userId: number;
}): Promise<User> => {
  const { avatarFile, avatarUrl, ...userData } = data;
  let newAvatarUrl = avatarUrl;

  if (avatarFile) {
    newAvatarUrl = await uploadApi.uploadFile({
      file: avatarFile,
    });
  }

  const response = await api.patch(`/users/${userId}`, {
    ...userData,
    ...(newAvatarUrl && { avatarUrl: newAvatarUrl }),
  });
  return response.data;
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({ mutationConfig }: UseUpdateUserOptions) => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getUserQueryOptions(data.id).queryKey,
      });
      if (user?.id === data.id) {
        queryClient.setQueryData(['authenticated-user'], {
          ...user,
          ...data,
        });
      }

      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
