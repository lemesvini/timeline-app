import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { type Movie } from '@/types/api';

import { getMoviesQueryOptions } from './get-movies';

export const createMovieInputSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z
    .string()
    .min(10, { message: 'Descrição deve ter no mínimo 10 caracteres' }),
  movieGenre: z.string().min(1, { message: 'Gênero é obrigatório' }),
  trailerLink: z.string().min(1, { message: 'Link do trailer é obrigatório' }),
  releaseDate: z
    .string()
    .min(1, { message: 'Data de lançamento é obrigatória' }),
  director: z
    .number({ invalid_type_error: 'Diretor é obrigatório' })
    .min(1, { message: 'Diretor é obrigatório' }),
});

export type CreateMovieInput = z.infer<typeof createMovieInputSchema>;

export const createMovie = async (data: CreateMovieInput): Promise<Movie> => {
  const response = await api.post('/movies', data);
  return response.data;
};

type UseCreateMovieOptions = {
  mutationConfig?: MutationConfig<typeof createMovie>;
};

export const useCreateMovie = ({ mutationConfig }: UseCreateMovieOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMoviesQueryOptions().queryKey,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: CreateMovieInput) => createMovie(data),
  });
};
