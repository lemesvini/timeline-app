import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Meta, Movie } from '@/types/api';

export const getMovies = ({
  page,
  filters,
}: {
  page?: number;
  filters?: string;
}): Promise<{ data: Movie[]; metadata: Meta }> => {
  return api.get(`/movies`, {
    params: {
      page,
      filters,
    },
  });
};

export const getMoviesQueryOptions = (options?: {
  page?: number;
  filters?: string;
}) => {
  const { page, filters } = options || {};
  return queryOptions({
    queryKey: [
      'movies',
      {
        ...(page && { page }),
        ...(filters && { filters }),
      },
    ],
    queryFn: () => getMovies({ page, filters }),
  });
};

type UseMoviesOptions = {
  queryConfig?: QueryConfig<typeof getMoviesQueryOptions>;
  page?: number;
  filters?: string;
};

export const useMovies = ({
  queryConfig,
  page,
  filters,
}: UseMoviesOptions = {}) => {
  return useQuery({
    ...getMoviesQueryOptions({ page, filters }),
    ...queryConfig,
  });
};
