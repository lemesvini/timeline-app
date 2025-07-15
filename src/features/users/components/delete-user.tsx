import { IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog/index';
import { useUser } from '@/lib/auth';

import { useDeleteUser } from '../api/delete-user';

type DeleteUserProps = {
  id: number;
};

export const DeleteUser = ({ id }: DeleteUserProps) => {
  const { data: user } = useUser();

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Usuário deletado com sucesso');
      },
    },
  });

  if (user?.id === id || !user) return null;

  return (
    <ConfirmationDialog
      icon='danger'
      title='Remover usuário'
      body='Tem certeza que deseja remover este usuário?'
      triggerButton={
        <Button variant='ghost' size='icon'>
          <IconTrash className='size-4' />
        </Button>
      }
      confirmButton={
        <Button
          isLoading={deleteUserMutation.isPending}
          type='button'
          variant='destructive'
          onClick={() => deleteUserMutation.mutate({ userId: id })}
        >
          Remover usuário
        </Button>
      }
    />
  );
};
