import * as React from 'react';
import { IconDotsVertical } from '@tabler/icons-react';

import { Head } from '../seo';
import { ThemeModeToggle } from '../theme/theme-mode-toggle';
import { SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type ContentLayoutProps = {
  children: React.ReactNode;
  title: string;
  hideTitle?: boolean;
  rightContent?: React.ReactNode;
  headerTitle?: string;
};

export const ContentLayout = ({
  children,
  title,
  rightContent,
  headerTitle,
}: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className='py-6'>
        <div className='mx-auto max-w-7xl p-4 sm:px-6 md:px-8'>
          <div className='flex justify-between items-center p-4 bg-muted rounded-lg border border-border mb-6'>
            <section className='flex items-center gap-3'>
              <SidebarTrigger
                variant='ghost'
                className='items-center justify-center'
                size='icon'
              />
              <h1 className='text-lg font-light'>{headerTitle ?? title}</h1>
            </section>
            <div className='flex gap-2 items-center justify-end flex-wrap'>
              <ThemeModeToggle />

              <div className='hidden sm:flex gap-2 items-center flex-wrap'>
                {rightContent}
              </div>

              {rightContent && (
                <div className='flex sm:hidden'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm' className='px-2'>
                        <IconDotsVertical className='size-4' />
                        <span className='sr-only'>Abrir menu de ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='end'
                      className='w-auto min-w-[200px]'
                    >
                      <div className='flex flex-col gap-1 p-1'>
                        {rightContent}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};