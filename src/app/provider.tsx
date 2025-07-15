import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { useState, Suspense } from 'react';
import { queryConfig } from '@/lib/react-query';
import { Spinner } from '@/components/ui/spinner';
import { ErrorBoundary } from 'react-error-boundary';
import { MainErrorFallback } from '@/components/errors/main';
import { AuthLoader } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';
import ProviderError from '@/components/errors/provider-error';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-screen items-center justify-center'>
          <Spinner size='xl' />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster position='top-center' />
            <AuthLoader
              renderLoading={() => (
                <div className='flex h-screen w-screen items-center justify-center'>
                  <Spinner size='xl' />
                </div>
              )}
              renderError={(error) => <ProviderError error={error} />}
            >
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
