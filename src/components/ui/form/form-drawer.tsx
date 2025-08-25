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

export interface FormDrawerProps {
  isDone: boolean;
  triggerButton?: React.ReactElement; // Make optional
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const FormDrawer = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
  open: controlledOpen,
  onOpenChange,
}: FormDrawerProps) => {
  const { close, open, isOpen } = useDisclosure();
  void(open);

  // Use controlled or uncontrolled open state
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const drawerOpen = isControlled ? controlledOpen : isOpen;
  const drawerOnOpenChange = isControlled ? onOpenChange : (open: boolean) => (open ? open : close());

  React.useEffect(() => {
    if (isDone) {
      close();
      if (isControlled && onOpenChange) onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  return (
    <Drawer
      open={drawerOpen}
      onOpenChange={drawerOnOpenChange}
    >
      {/* Only render trigger if uncontrolled */}
      {!isControlled && triggerButton && (
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      )}
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
            <Button variant='outline' type='button'>
              Fechar
            </Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
