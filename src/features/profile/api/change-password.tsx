import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';

export const changePasswordInputSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Senha atual é obrigatória' }),
  newPassword: z
    .string({ required_error: 'Nova senha é obrigatória' })
    .min(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' }),
  confirmNewPassword: z
    .string({ required_error: 'Confirmar nova senha é obrigatória' })
    .min(8, {
      message: 'Confirmar nova senha deve ter no mínimo 8 caracteres',
    }),
});

export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;

export const changePassword = async ({
  data,
}: {
  data: ChangePasswordInput;
}): Promise<void> => {
  if (data.newPassword === data.currentPassword) {
    throw new Error('Nova senha não pode ser igual à senha atual');
  }

  if (data.newPassword !== data.confirmNewPassword) {
    throw new Error('As senhas não coincidem');
  }

  const response = await api.patch('/auth/password', data);
  return response.data;
};

type UseChangePasswordOptions = {
  mutationConfig?: MutationConfig<typeof changePassword>;
};

export const useChangePassword = ({
  mutationConfig,
}: UseChangePasswordOptions) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: changePassword,
  });
};
