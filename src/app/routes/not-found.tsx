import { IconError404 } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

const NotFoundRoute = () => {
  return (
    <div className='flex flex-col items-center font-semibold justify-center h-screen text-center'>
      <IconError404 size={128} />
      <h1 className='text-xl'>Página não encontrada</h1>
      <p className='text-muted-foreground'>
        Desculpe, a página que você está procurando não existe.
      </p>

      <Link to={paths.home.getHref()} replace className='mt-4'>
        <Button>Voltar para a página inicial</Button>
      </Link>
    </div>
  );
};

export default NotFoundRoute;
