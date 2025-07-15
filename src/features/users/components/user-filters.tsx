import React from 'react';
import { FilterContainer } from '@/components/ui/filters/filter-container';
import type { FilterConfig, Filter } from '@/types/filters';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { type User, Role } from '@/types/api';

const userFilterConfigs: FilterConfig<User>[] = [
  {
    field: 'fullName',
    label: 'Nome',
    type: 'text',
  },
  {
    field: 'email',
    label: 'Email',
    type: 'text',
  },
  {
    field: 'role',
    label: 'Cargo',
    type: 'select',
    options: Object.values(Role).map((role) => ({
      label: role,
      value: role,
    })),
  },
];

interface UserFiltersProps {
  onFiltersChange: (filters: string) => void;
  initialFilters?: Filter;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
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
            <FilterContainer<User>
              configs={userFilterConfigs}
              onFiltersChange={onFiltersChange}
              defaultFilters={initialFilters}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
