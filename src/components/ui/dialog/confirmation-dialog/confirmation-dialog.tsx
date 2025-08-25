import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import * as React from 'react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

export interface ConfirmationDialogProps {
  triggerButton?: React.ReactElement; // Make optional for controlled mode
  confirmButton: React.ReactElement;
  title: string;
  body?: string;
  cancelButtonText?: string;
  icon?: 'danger' | 'info';
  isDone?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ConfirmationDialog = ({
  triggerButton,
  confirmButton,
  title,
  body = '',
  cancelButtonText = 'Cancelar',
  icon = 'danger',
  isDone = false,
  open: controlledOpen,
  onOpenChange,
}: ConfirmationDialogProps) => {
  const { close, open, isOpen } = useDisclosure();
  const cancelButtonRef = React.useRef(null);
  void(open);

  // Controlled or uncontrolled?
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? controlledOpen : isOpen;
  const dialogOnOpenChange = isControlled
    ? onOpenChange
    : (open: boolean) => (open ? open : close());

  const handleCancel = () => {
    if (isControlled && onOpenChange) {
      onOpenChange(false);
    } else {
      close();
    }
  };

  useEffect(() => {
    if (isDone) {
      close();
      if (isControlled && onOpenChange) onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  return (
    <Dialog open={dialogOpen} onOpenChange={dialogOnOpenChange}>
      {/* Only render trigger if uncontrolled */}
      {!isControlled && triggerButton && (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      )}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='flex'>
          <DialogTitle className='flex items-center gap-2'>
            {icon === 'danger' && (
              <IconAlertCircle className='size-6 text-red-600' aria-hidden='true' />
            )}
            {icon === 'info' && (
              <IconInfoCircle className='size-6 text-blue-600' aria-hidden='true' />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
          {body && (
            <div className='mt-2'>
              <p>{body}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            ref={cancelButtonRef}
            variant='outline'
            type='button'
            onClick={handleCancel}
          >
            {cancelButtonText}
          </Button>
          {confirmButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
