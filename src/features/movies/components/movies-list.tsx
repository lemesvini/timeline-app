import { useSearchParams } from 'react-router';
import { useMemo } from 'react';
import { formatDate } from '@/lib/utils';
import { MovieFilters } from './movie-filters';

import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';

import { useMovies } from '../api/get-movies';
import { UpdateMovie } from './update-movie';
import { DeleteMovie } from './delete-movie';

const translateMovieGenre = (genre: string) => {
  switch (genre) {
    case 'Action':
      return 'Ação';
    case 'Adventure':
      return 'Aventura';
    case 'Animation':
      return 'Animação';
    case 'Comedy':
      return 'Comédia';
    case 'Romance':
      return 'Romance';
    case 'Science Fiction':
      return 'Ficção científica';
    default:
      return genre;
  }
};

export const MoviesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilters = searchParams.get('filters');

  const initialFilters = useMemo(() => {
    try {
      return currentFilters ? JSON.parse(currentFilters) : undefined;
    } catch {
      return undefined;
    }
  }, [currentFilters]);

  const moviesQuery = useMovies({
    page: Number(searchParams.get('page') ?? 1),
    filters: currentFilters ?? undefined,
  });

  const handleFiltersChange = (newFilters: string) => {
    setSearchParams((prev) => {
      if (!newFilters) {
        prev.delete('filters');
      } else {
        prev.set('filters', newFilters);
      }
      return prev;
    });
  };

  if (moviesQuery.isLoading) {
    return (
      <>
        <MovieFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={initialFilters}
        />
        <Spinner />
      </>
    );
  }

  if (moviesQuery.isError) {
    console.error(moviesQuery.error);
    return (
      <>
        <MovieFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={initialFilters}
        />
        <div>Houve um erro ao carregar os filmes.</div>
      </>
    );
  }

  const movies = moviesQuery.data?.data;
  const meta = moviesQuery.data?.metadata;

  return (
    <>
      <MovieFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={initialFilters}
      />
      <Table
        data={movies || []}
        columns={[
          {
            title: 'Nome',
            field: 'name',
          },
          {
            title: 'Gênero',
            field: 'movieGenre',
            breakpoint: 'sm',
            Cell: ({ entry }) => {
              return <span>{translateMovieGenre(entry.movieGenre)}</span>;
            },
          },
          {
            title: 'Diretor',
            field: 'director',
            breakpoint: 'sm',
            Cell: ({ entry }) => {
              return <span>{entry.director?.fullName ?? 'N/A'}</span>;
            },
          },
          {
            title: 'Data de lançamento',
            breakpoint: 'md',
            field: 'releaseDate',
            Cell: ({ entry }) => {
              return <span>{formatDate(entry.releaseDate)}</span>;
            },
          },
          {
            title: '',
            field: 'id',
            Cell: ({ entry: movie }) => {
              return (
                <div className='flex gap-0 justify-end'>
                  <DeleteMovie movieId={movie.id} />
                  <UpdateMovie movieId={movie.id} movie={movie} />
                </div>
              );
            },
          },
        ]}
        pagination={{
          currentPage: Number(meta?.page ?? 1),
          totalPages: Math.ceil(
            Number(meta?.total ?? 0) / Number(meta?.limit ?? 10),
          ),
          rootUrl: '',
        }}
      />
    </>
  );
};
