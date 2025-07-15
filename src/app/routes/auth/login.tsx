import { LoginForm } from '@/features/auth/components/login-form';

import { Link, useNavigate, useSearchParams } from 'react-router';
import { paths } from '@/config/paths';
// import logo from '@/assets/images/epicora.png';
import { AuthLayout } from '@/components/layouts/auth-layout';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <AuthLayout title='Login'>
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
              Projeto Base
            </Link>
          </div>
          <div className='flex flex-1 items-center justify-center'>
            <div className='w-full max-w-xs'>
              <LoginForm
                onSuccess={() =>
                  navigate(
                    `${
                      redirectTo
                        ? `${redirectTo}`
                        : paths.app.dashboard.getHref()
                    }`,
                    {
                      replace: true,
                    }
                  )
                }
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
