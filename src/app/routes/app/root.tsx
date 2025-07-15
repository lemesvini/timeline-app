import { Outlet } from 'react-router';
import { useRouteError } from 'react-router';

import { DashboardLayout } from '@/components/layouts';
import { SidebarProvider } from '@/components/ui/sidebar';

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <SidebarProvider>
      <DashboardLayout>
        <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
          <h1 className='text-2xl font-bold'>Algo deu errado!</h1>
          <pre className='rounded-lg bg-destructive/10 p-4 text-sm'>
            {error instanceof Error
              ? error.message
              : JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  );
};

const AppRoot = () => {
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </SidebarProvider>
  );
};

export default AppRoot;
