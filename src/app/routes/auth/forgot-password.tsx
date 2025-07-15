import { useNavigate, useSearchParams, Link } from 'react-router';
import { toast } from 'sonner';

// import logo from '@/assets/images/epicora.png';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <AuthLayout title='Recuperar senha'>
      <div className='grid min-h-svh lg:grid-cols-2'>
        <div className='flex flex-col gap-4 p-6 md:p-10'>
          <div className='flex justify-center gap-2 md:justify-start'>
            <Link
              to={paths.home.path}
              className='flex items-center gap-2 font-medium'
            >
              <div className='flex items-center justify-center rounded-md bg-primary text-primary-foreground overflow-hidden'>
                {/* <img src={logo} alt='Logo' className='h-6 w-6' /> */}
              </div>
              Timeline
            </Link>
          </div>
          <div className='flex flex-1 items-center justify-center'>
            <div className='w-full max-w-xs'>
              <ForgotPasswordForm
                onSuccess={() => {
                  toast.success('Link de recuperação enviado com sucesso');
                  navigate(
                    `${
                      redirectTo
                        ? `${redirectTo}`
                        : paths.app.dashboard.getHref()
                    }`,
                    {
                      replace: true,
                    },
                  );
                }}
                onError={() => {
                  toast.error('Erro ao enviar link de recuperação');
                }}
              />
            </div>
          </div>
        </div>
        <div className='relative hidden lg:block overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary/75 to-primary/50 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-3xl' />
          <div className='absolute inset-0 mix-blend-overlay bg-[radial-gradient(circle_at_50%_120%,var(--chart-4),transparent_70%)]' />
        </div>
      </div>
    </AuthLayout>
  );
}
