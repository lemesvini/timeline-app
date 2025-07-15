import { IconAlertHexagon } from '@tabler/icons-react';

import { Button } from '../ui/button';

import { MainErrorFallback } from './main';

export default function ProviderError({ error }: { error: unknown }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className='flex h-screen w-screen flex-col items-center justify-center p-4'
        role='alert'
      >
        <IconAlertHexagon size={48} stroke={1.5} className='text-destructive' />
        <h2 className='text-lg font-semibold mt-4'>Erro na inicialização</h2>
        <div className='mt-4 max-w-xl overflow-auto p-4 rounded-md'>
          <pre className='text-sm whitespace-pre-wrap break-words'>
            {error instanceof Error
              ? error.message
              : 'Um erro inesperado ocorreu'}
            {error instanceof Error && error.stack && (
              <>
                {'\n\nStack Trace:\n'}
                {error.stack}
              </>
            )}
          </pre>
        </div>
        <Button
          className='mt-4'
          onClick={() => window.location.assign(window.location.origin)}
        >
          Recarregar
        </Button>
      </div>
    );
  }

  return <MainErrorFallback />;
}
