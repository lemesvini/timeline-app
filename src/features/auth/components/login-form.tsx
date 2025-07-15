import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useLogin, loginInputSchema } from '@/lib/auth';
import { Link } from 'react-router';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({
    onSuccess,
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>Bem vindo</h1>
        <p className='text-sm text-muted-foreground'>
          Faça login para continuar
        </p>
      </div>
      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              type='email'
              label='Email'
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              type='password'
              label='Senha'
              error={formState.errors['password']}
              registration={register('password')}
            />
            <div>
              <Button
                isLoading={login.isPending}
                type='submit'
                className='w-full mb-1'
              >
                Entrar
              </Button>
              <Link to={paths.auth.forgotPassword.getHref()}>
                <Button variant='link' className='w-full'>
                  Esqueceu sua senha?
                </Button>
              </Link>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
