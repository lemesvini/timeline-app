import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useForgotPassword, forgotPasswordInputSchema } from '@/lib/auth';
import { Link } from 'react-router';

type ForgotPasswordFormProps = {
  onSuccess: () => void;
  onError: () => void;
};

export const ForgotPasswordForm = ({
  onSuccess,
  onError,
}: ForgotPasswordFormProps) => {
  const { forgotPassword } = useForgotPassword({ onSuccess, onError });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>Esqueceu sua senha?</h1>
        <p className='text-sm text-muted-foreground'>
          Digite seu email para receber um link de recuperação
        </p>
      </div>
      <Form
        onSubmit={(values) => {
          forgotPassword.mutate(values);
        }}
        schema={forgotPasswordInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              type='email'
              label='Email'
              error={formState.errors['email']}
              registration={register('email')}
            />
            <div>
              <Button
                isLoading={forgotPassword.isPending}
                type='submit'
                className='w-full mb-1'
              >
                Enviar link de recuperação
              </Button>
              <Link to={paths.auth.login.getHref()}>
                <Button variant='link' className='w-full'>
                  Voltar para login
                </Button>
              </Link>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
