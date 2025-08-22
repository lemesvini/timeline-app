import { useSearchParams } from 'react-router';
//import { useMemo } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import { getInitials, formatDate } from '@/lib/utils';

import { useCustomers } from '../api/get-customers';

export const CustomersList = () => {
  const [searchParams] = useSearchParams();

  const customersQuery = useCustomers({
    page: Number(searchParams.get('page') ?? 1),
    filters: searchParams.get('filters') ?? undefined,
  });

  if (customersQuery.isLoading) {
    return <Spinner />;
  }

  if (customersQuery.isError) {
    console.error(customersQuery.error);
    return <div>Houve um erro ao carregar os clientes.</div>;
  }

  const customers = customersQuery.data?.data;
  const meta = customersQuery.data?.metadata;

  return (
    <Table
      data={customers || []}
      columns={[
        {
          title: 'Nome',
          field: 'firstName',
          Cell: ({ entry: { firstName, lastName } }) => {
            const fullName = `${firstName} ${lastName}`.trim();
            return (
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarFallback>
                    {fullName ? getInitials(fullName) : ''}
                  </AvatarFallback>
                </Avatar>
                <span>{fullName}</span>
              </div>
            );
          },
        },
        {
          title: 'Email',
          field: 'email',
          breakpoint: 'sm',
        },
        {
          title: 'Telefone',
          field: 'phone',
          breakpoint: 'md',
        },
        {
          title: 'Cidade',
          field: 'city',
          breakpoint: 'lg',
        },
        {
          title: 'Criado em',
          field: 'createdAt',
          breakpoint: 'xl',
          Cell: ({ entry: { createdAt } }) => {
            return <span>{formatDate(createdAt)}</span>;
          },
        },
      ]}
      pagination={{
        currentPage: Number(meta?.page ?? 1),
        totalPages: Math.ceil(
          Number(meta?.total ?? 0) / Number(meta?.limit ?? 10)
        ),
        rootUrl: '',
      }}
    />
  );
};
