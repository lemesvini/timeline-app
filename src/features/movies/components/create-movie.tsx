import { IconPlus } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
  Textarea,
  QuerySelect,
  Select,
} from '@/components/ui/form';
import { Authorization, ROLES } from '@/lib/authorization';
import { getUsers } from '@/features/users/api/get-users';

import { createMovieInputSchema, useCreateMovie } from '../api/create-movie';

export const CreateMovie = () => {
  const createMovieMutation = useCreateMovie({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Filme criado com sucesso');
      },
    },
  });

  return (
    <Authorization allowedRoles={[ROLES.ADMINISTRATOR]}>
      <FormDrawer
        isDone={createMovieMutation.isSuccess}
        triggerButton={
          <Button size='sm' icon={<IconPlus className='size-4' />}>
            Criar filme
          </Button>
        }
        title='Criar filme'
        submitButton={
          <Button
            type='submit'
            isLoading={createMovieMutation.isPending}
            form='create-movie'
          >
            Criar
          </Button>
        }
      >
        <Form
          id='create-movie'
          onSubmit={(values) => {
            createMovieMutation.mutate(values);
          }}
          schema={createMovieInputSchema}
        >
          {({ register, formState, control }) => (
            <div>
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
                      valueAccessor={(user) => user.id}
                      labelAccessor={(user) => user.fullName}
                      placeholder='Buscar diretor...'
                      selectPlaceholder='Selecione um diretor'
                      error={formState.errors['director']}
                    />
                  )}
                />
              </div>
            </div>
          )}
        </Form>
      </FormDrawer>
    </Authorization>
  );
};
