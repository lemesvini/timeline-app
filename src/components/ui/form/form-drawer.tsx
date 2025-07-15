import * as React from 'react';

import { useDisclosure } from '@/hooks/use-disclosure';

import { Button } from '../button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from '../drawer';

type FormDrawerProps = {
  isDone: boolean;
  triggerButton: React.ReactElement;
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
};

export const FormDrawer = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
}: FormDrawerProps) => {
  const { close, open, isOpen } = useDisclosure();

  React.useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        } else {
          open();
        }
      }}
    >
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className='flex max-w-[800px] flex-col justify-between sm:max-w-[540px]'>
        <div className='flex flex-col'>
          <DrawerHeader className='pb-4'>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className='sr-only'>{title}</DrawerDescription>
          </DrawerHeader>
          <div>{children}</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline' type='submit'>
              Fechar
            </Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
