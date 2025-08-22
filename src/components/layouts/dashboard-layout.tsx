import {
  IconUsersGroup,
  IconLayoutGrid,
  IconPackage,
  IconLogout,
  IconUser,
  //IconPlus,
} from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
//import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
// import { useNavigation, useLocation } from 'react-router';
// import logo from '@/assets/images/timeline.png';
//import { ThemeModeToggle } from '@/components/theme/theme-mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  //SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { paths } from '@/config/paths';
import { useLogout, useUser } from '@/lib/auth';
import { cn, getInitials } from '@/lib/utils';
import { getRoleLabel, getFirstAndLastWord } from '@/lib/utils';

import { Link } from '../ui/link';
import { Role } from '@/types/api';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  hidden?: boolean;
};

const Logo = () => {
  return (
    <Link className='flex items-center' to={paths.home.getHref()}>
      {/* <img className='h-8 w-auto' src={logo} alt='Timeline' /> */}
      <span className='text-2xl font-bold ml-2 tracking-tight group-data-[collapsible=icon]:hidden'>
        Timeline
      </span>
    </Link>
  );
};

// const Progress = () => {
//   const { state, location } = useNavigation();
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     setProgress(0);
//   }, [location?.pathname]);

//   useEffect(() => {
//     if (state === 'loading') {
//       const timer = setInterval(() => {
//         setProgress((oldProgress) => {
//           if (oldProgress === 100) {
//             clearInterval(timer);
//             return 100;
//           }
//           const newProgress = oldProgress + 10;
//           return newProgress > 100 ? 100 : newProgress;
//         });
//       }, 300);

//       return () => {
//         clearInterval(timer);
//       };
//     }
//   }, [state]);

//   if (state !== 'loading') {
//     return null;
//   }

//   return (
//     <div
//       className='fixed left-0 top-0 h-1 bg-primary transition-all duration-75 ease-in-out'
//       style={{ width: `${progress}%` }}
//     ></div>
//   );
// };

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref(location.pathname)),
  });

  const navigation = [
    {
      name: 'Dashboard',
      to: paths.app.dashboard.getHref(),
      icon: IconLayoutGrid,
    },
    {
      name: 'Usuários',
      to: paths.app.users.getHref(),
      icon: IconUsersGroup,
    },
    {
      name: 'Produtos',
      to: paths.app.products.getHref(),
      icon: IconPackage,
    },
    {
      name: 'Clientes',
      to: paths.app.customers.getHref(),
      icon: IconUsersGroup,
    },
    {
      name: 'Perfil',
      to: paths.app.profile.getHref(),
      icon: IconUser,
      hidden: true,
    },
  ].filter(Boolean) as SideNavigationItem[];

  //const currentPath = useLocation().pathname;
  //const pathName = navigation.find((item) => item.to === currentPath)?.name;

  return (
    <div className='flex min-h-screen w-full'>
      <SidebarProvider>
        <Sidebar
          collapsible='icon'
          className='p-4 bg-sidebar group-data-[collapsible=icon]:p-0'
        >
          <SidebarHeader className='border-b border-sidebar-border p-4 group-data-[collapsible=icon]:px-2 py-4 flex justify-center items-start'>
            <Logo />
          </SidebarHeader>
          <SidebarContent className='flex flex-col justify-between'>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.name} hidden={item.hidden}>
                      <NavLink
                        to={item.to}
                        end
                        className={({ isActive }) =>
                          cn(
                            'flex items-center group-data-[collapsible=icon]:justify-center gap-2 w-full p-2 px-4 group-data-[collapsible=icon]:p-1 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-75',
                            isActive &&
                              'bg-sidebar-primary text-sidebar-primary-foreground'
                          )
                        }
                      >
                        <item.icon className='size-6' />
                        <span className='group-data-[collapsible=icon]:hidden text-sm'>
                          {item.name}
                        </span>
                      </NavLink>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarFooter className='border-t border-sidebar-border py-4 px-2'>
              <SidebarMenu>
                <SidebarMenuItem className='flex flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center'>
                  <Button
                    onClick={() => navigate(paths.app.profile.getHref())}
                    variant='ghost'
                    className='w-full justify-between text-left px-0 group-data-[collapsible=icon]:hidden'
                  >
                    <div className='flex flex-row justify-start gap-2 w-full'>
                      <Avatar>
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>
                          {user?.fullName ? getInitials(user.fullName) : ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold'>
                          {getFirstAndLastWord(user?.fullName ?? '')}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {getRoleLabel(user?.role ?? Role.USER)}
                        </span>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => logout.mutate({})}
                    title='Sair'
                  >
                    <IconLogout className='size-4' />
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        <div className='flex-1 flex flex-col min-h-screen p-4'>
          <main className='flex-1'>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
