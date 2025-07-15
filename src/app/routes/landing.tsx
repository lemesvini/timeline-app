import {
  IconBrandReact,
  IconBrandTypescript,
  IconBrandTailwind,
  IconBrandVite,
} from '@tabler/icons-react';

// import logo from '@/assets/images/epicora.png';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

const LandingPageRoute = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-foreground p-8'>
      {/* <img src={logo} alt='Epicora' className='w-20 h-20 mb-4 rounded-lg' /> */}
      <h1 className='text-5xl font-bold mb-4'>Timeline</h1>
      <p className='text-xl text-muted-foreground mb-8 text-center max-w-2xl'>
        Projeto de exemplo do sistema Timeline
      </p>

      <div className='flex gap-8 mb-12'>
        <IconBrandReact size={48} className='text-blue-400' stroke={1.5} />
        <IconBrandTypescript size={48} className='text-blue-500' stroke={1.5} />
        <IconBrandTailwind size={48} className='text-cyan-400' stroke={1.5} />
        <IconBrandVite size={48} className='text-purple-400' stroke={1.5} />
      </div>

      <Link
        to={paths.auth.login.getHref()}
        className='bg-primary hover:bg-primary/90 px-8 py-3 rounded-lg text-lg font-medium transition-colors text-white hover:text-white'
      >
        Acessar
      </Link>
    </div>
  );
};

export default LandingPageRoute;
