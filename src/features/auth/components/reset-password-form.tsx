import { resetPasswordInputSchema, useResetPassword } from '@/lib/auth';
import { toast } from 'sonner';
import { Form, Input } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { paths } from '@/config/paths';

export function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const { resetPassword } = useResetPassword({
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso');
      navigate(paths.auth.login.path, { replace: true });
    },
    onError: () => {
      toast.error('Erro ao redefinir senha');
    },
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>Redefinir senha</h1>
        <p className='text-sm text-muted-foreground'>Digite sua nova senha</p>
      </div>
      <Form
        onSubmit={(values) => {
          resetPassword.mutate({ data: values, token });
        }}
        schema={resetPasswordInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              type='password'
              label='Senha'
              registration={register('password')}
              error={formState.errors.password}
            />
            <Input
              type='password'
              label='Confirmar senha'
              registration={register('confirmPassword')}
              error={formState.errors.confirmPassword}
            />
            <Button
              type='submit'
              isLoading={resetPassword.isPending}
              className='w-full mb-1'
            >
              Redefinir senha
            </Button>
          </>
        )}
      </Form>
    </div>
  );
}
