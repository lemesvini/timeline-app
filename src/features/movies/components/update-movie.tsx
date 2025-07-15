import { IconPencil } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
  Select,
  QuerySelect,
  Textarea,
} from '@/components/ui/form';
import { Authorization, ROLES } from '@/lib/authorization';
import { getUsers } from '@/features/users/api/get-users';
import { type Movie } from '@/types/api';
import { getUser } from '@/features/users/api/get-user';

import { useUpdateMovie, updateMovieInputSchema } from '../api/update-movie';

type UpdateMovieProps = {
  movieId: number;
  movie: Movie;
};

export const UpdateMovie = ({ movieId, movie }: UpdateMovieProps) => {
  const updateMovieMutation = useUpdateMovie({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Filme atualizado com sucesso');
      },
    },
  });

  return (
    <Authorization allowedRoles={[ROLES.ADMINISTRATOR]}>
      <FormDrawer
        isDone={updateMovieMutation.isSuccess}
        triggerButton={
          <Button size='icon' variant='ghost'>
            <IconPencil className='size-4' />
          </Button>
        }
        title='Editar filme'
        submitButton={
          <Button
            type='submit'
            isLoading={updateMovieMutation.isPending}
            form='update-movie'
          >
            Salvar
          </Button>
        }
      >
        <Form
          id='update-movie'
          onSubmit={(data) => {
            updateMovieMutation.mutate({
              data,
              movieId,
            });
          }}
          options={{
            defaultValues: {
              ...movie,
              director: movie.director?.id,
            },
          }}
          schema={updateMovieInputSchema}
        >
          {({ register, formState, control }) => (
            <div className='space-y-4'>
              <Input
                type='text'
                label='Nome'
                placeholder='Digite o nome do filme'
                error={formState.errors['name']}
                registration={register('name')}
              />

              <Select
                label='Gênero'
                error={formState.errors['movieGenre']}
                registration={register('movieGenre')}
                options={[
                  { label: 'Ação', value: 'Action' },
                  { label: 'Aventura', value: 'Adventure' },
                  { label: 'Animação', value: 'Animation' },
                  { label: 'Comédia', value: 'Comedy' },
                  { label: 'Romance', value: 'Romance' },
                  { label: 'Ficção científica', value: 'Science Fiction' },
                ]}
              />

              <Textarea
                label='Descrição'
                placeholder='Digite a descrição do filme'
                error={formState.errors['description']}
                registration={register('description')}
              />

              <Input
                type='text'
                label='Trailer'
                placeholder='Digite o link do trailer'
                error={formState.errors['trailerLink']}
                registration={register('trailerLink')}
              />

              <Input
                type='date'
                label='Data de lançamento'
                placeholder='Digite a data de lançamento'
                error={formState.errors['releaseDate']}
                registration={register('releaseDate')}
              />

              <Controller
                control={control}
                name='director'
                render={({ field }) => (
                  <QuerySelect
                    label='Diretor'
                    field={field}
                    queryKeyBase={['users']}
                    fetchFunction={async (search) => {
                      const response = await getUsers({ search });
                      return response.data;
                    }}
                    fetchItemFunction={async (id) => getUser({ userId: id })}
                    valueAccessor={(user) => user.id}
                    labelAccessor={(user) => user.fullName}
                    placeholder='Buscar diretor...'
                    selectPlaceholder='Selecione um diretor'
                    error={formState.errors['director']}
                  />
                )}
              />
            </div>
          )}
        </Form>
      </FormDrawer>
    </Authorization>
  );
};
