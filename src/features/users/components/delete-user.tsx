import { IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog/index';
import { useUser } from '@/lib/auth';
import { Authorization, POLICIES } from '@/lib/authorization';

import { useDeleteUser } from '../api/delete-user';


type DeleteUserProps = {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteUser = ({ id, open, onOpenChange }: DeleteUserProps) => {
  const { data: user } = useUser();

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Usuário deletado com sucesso');
        onOpenChange(false);
      },
    },
  });

  if (user?.id === id || !user) return null;

  return (
    <Authorization policyCheck={POLICIES['users:delete'](user)}>
      <ConfirmationDialog
        icon='danger'
        title='Remover usuário'
        body='Tem certeza que deseja remover este usuário?'
        open={open}
        onOpenChange={onOpenChange}
        confirmButton={
          <Button
            isLoading={deleteUserMutation.isPending}
            type='button'
            variant='destructive'
            onClick={() => deleteUserMutation.mutate({ userId: id })}
            icon={<IconTrash />}
          >
            Remover usuário
          </Button>
        }
      />
    </Authorization>
  );
};
