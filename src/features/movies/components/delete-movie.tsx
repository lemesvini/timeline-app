import { IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useDeleteMovie } from '../api/delete-movie';

type DeleteMovieProps = {
  movieId: number;
};

export const DeleteMovie = ({ movieId }: DeleteMovieProps) => {
  const deleteMovieMutation = useDeleteMovie({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Filme deletado com sucesso');
      },
    },
  });

  return (
    <ConfirmationDialog
      icon='danger'
      title='Remover filme'
      body='Tem certeza que deseja remover este filme?'
      triggerButton={
        <Button size='icon' variant='ghost'>
          <IconTrash className='size-4' />
        </Button>
      }
      confirmButton={
        <Button
          isLoading={deleteMovieMutation.isPending}
          type='button'
          variant='destructive'
          onClick={() => deleteMovieMutation.mutate({ movieId })}
        >
          Remover filme
        </Button>
      }
    />
  );
};
