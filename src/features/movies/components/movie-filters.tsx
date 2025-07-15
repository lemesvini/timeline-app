import React from 'react';
import { FilterContainer } from '@/components/ui/filters/filter-container';
import type { FilterConfig, Filter } from '@/types/filters';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Movie } from '@/types/api';
import { getUsers } from '@/features/users/api/get-users';
import { getUser } from '@/features/users/api/get-user';

const movieFilterConfigs: FilterConfig<Movie>[] = [
  {
    field: 'name',
    label: 'Nome',
    type: 'text',
  },
  {
    field: 'movieGenre',
    label: 'Gênero',
    type: 'select',
    options: [
      { label: 'Ação', value: 'Action' },
      { label: 'Aventura', value: 'Adventure' },
      { label: 'Animação', value: 'Animation' },
      { label: 'Comédia', value: 'Comedy' },
      { label: 'Romance', value: 'Romance' },
      { label: 'Ficção científica', value: 'Science Fiction' },
    ],
  },
  {
    field: 'releaseDate',
    label: 'Data de lançamento',
    type: 'date',
  },
  {
    field: 'director',
    label: 'Diretor',
    type: 'query-select',
    querySelect: {
      queryKeyBase: ['directors'],
      fetchFunction: async (search) => {
        const response = await getUsers({ search });
        return response.data;
      },
      fetchItemFunction: async (id) => getUser({ userId: id }),
      valueAccessor: (director) => director._id,
      labelAccessor: (director) => director.fullName,
      placeholder: 'Buscar diretor...',
      selectPlaceholder: 'Selecionar diretor...',
    },
  },
];

interface MovieFiltersProps {
  onFiltersChange: (filters: string) => void;
  initialFilters?: Filter;
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  onFiltersChange,
  initialFilters,
}) => {
  return (
    <div className='bg-card rounded-lg border mt-2 mb-4'>
      <Accordion type='single' collapsible>
        <AccordionItem value='filters'>
          <AccordionTrigger className='font-semibold p-4 py-3 cursor-pointer flex items-center justify-between'>
            Filtros
          </AccordionTrigger>
          <AccordionContent className='p-4 pt-0'>
            <FilterContainer<Movie>
              configs={movieFilterConfigs}
              onFiltersChange={onFiltersChange}
              defaultFilters={initialFilters}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
