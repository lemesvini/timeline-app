import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { Link, useParams } from 'react-router';
// import logo from '@/assets/images/timeline.png';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  const { token } = useParams();

  return (
    <AuthLayout title='Redefinir senha'>
      <div className='grid min-h-svh lg:grid-cols-2'>
        <div className='flex flex-col gap-4 p-6 md:p-10'>
          <div className='flex justify-center gap-2 md:justify-start'>
          </div>
          <div className='flex flex-1 items-center justify-center'>
            <div className='w-full max-w-xs'>
              {token ? (
                <ResetPasswordForm token={token} />
              ) : (
                <div>Token não encontrado</div>
              )}
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
