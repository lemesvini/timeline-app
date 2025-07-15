import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import {
  getMoviesQueryOptions,
  CreateMovie,
  MoviesList,
} from '@/features/movies';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const query = getMoviesQueryOptions({ page });
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const MoviesRoute = () => {
  return (
    <ContentLayout title='Filmes'>
      <div className='flex justify-end pb-2 items-center gap-2'>
        <CreateMovie />
      </div>
      <MoviesList />
    </ContentLayout>
  );
};

export default MoviesRoute;
