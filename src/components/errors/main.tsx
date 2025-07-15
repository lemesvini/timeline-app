import { Button } from '../ui/button';
import { IconAlertHexagon } from '@tabler/icons-react';

export const MainErrorFallback = () => {
  return (
    <div
      className='flex h-screen w-screen flex-col items-center justify-center text-red-500'
      role='alert'
    >
      <IconAlertHexagon size={48} className='text-red-500' stroke={1.5} />
      <h2 className='text-lg font-semibold'>Ooops, algo deu errado :( </h2>
      <Button
        className='mt-4'
        onClick={() => window.location.assign(window.location.origin)}
      >
        Recarregar
      </Button>
    </div>
  );
};
