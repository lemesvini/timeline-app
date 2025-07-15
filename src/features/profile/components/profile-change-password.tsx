import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  changePasswordInputSchema,
  useChangePassword,
} from '../api/change-password';
import { toast } from 'sonner';
import { Form, Input } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { AxiosError } from 'axios';

type ChangePasswordFormData = z.infer<typeof changePasswordInputSchema>;

export const ProfileChangePassword = () => {
  const formRef = useRef<UseFormReturn<ChangePasswordFormData> | null>(null);

  const changePassword = useChangePassword({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Senha alterada com sucesso');
        formRef.current?.reset();
      },
      onError: (error) => {
        if (!(error instanceof AxiosError)) {
          toast.error(error.message);
        }
      },
    },
  });

  return (
    <Card className='w-full p-4 py-8'>
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(values) => {
            changePassword.mutate({ data: values });
          }}
          schema={changePasswordInputSchema}
        >
          {(form) => {
            formRef.current = form;
            const { register, formState } = form;

            return (
              <>
                <Input
                  type='password'
                  label='Senha atual'
                  error={formState.errors['currentPassword']}
                  registration={register('currentPassword')}
                />
                <Input
                  type='password'
                  label='Nova senha'
                  error={formState.errors['newPassword']}
                  registration={register('newPassword')}
                />
                <Input
                  type='password'
                  label='Confirmar nova senha'
                  error={formState.errors['confirmNewPassword']}
                  registration={register('confirmNewPassword')}
                />
                <Button type='submit' isLoading={changePassword.isPending}>
                  Alterar senha
                </Button>
              </>
            );
          }}
        </Form>
      </CardContent>
    </Card>
  );
};
