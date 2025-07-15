import { Link, useSearchParams } from 'react-router';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import { getInitials, getRoleLabel, formatDate } from '@/lib/utils';

import { useUsers } from '../api/get-users';

import { DeleteUser } from './delete-user';
import { UpdateUser } from './update-user';
import { UserFilters } from './user-filters';
import { paths } from '@/config/paths';
import { EyeIcon } from 'lucide-react';

export const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilters = searchParams.get('filters');

  const initialFilters = useMemo(() => {
    try {
      return currentFilters ? JSON.parse(currentFilters) : undefined;
    } catch {
      return undefined;
    }
  }, [currentFilters]);

  const usersQuery = useUsers({
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

  if (usersQuery.isLoading) {
    return (
      <>
        <UserFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={initialFilters}
        />
        <Spinner />
      </>
    );
  }

  if (usersQuery.isError) {
    console.error(usersQuery.error);
    return (
      <>
        <UserFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={initialFilters}
        />
        <div>Houve um erro ao carregar os usuários.</div>
      </>
    );
  }

  const users = usersQuery.data?.data;
  const meta = usersQuery.data?.metadata;

  return (
    <>
      <UserFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={initialFilters}
      />
      <Table
        data={users || []}
        columns={[
          {
            title: 'Nome',
            field: 'fullName',
            Cell: ({ entry: { fullName, avatarUrl } }) => {
              return (
                <div className='flex items-center gap-2'>
                  <Avatar>
                    <AvatarImage src={avatarUrl} />
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
            title: 'Cargo',
            field: 'role',
            breakpoint: 'sm',
            Cell: ({ entry: { role } }) => {
              return <span>{getRoleLabel(role)}</span>;
            },
          },
          {
            title: 'Email',
            field: 'email',
            breakpoint: 'md',
          },
          {
            title: 'Criado em',
            field: 'createdAt',
            breakpoint: 'lg',
            Cell: ({ entry: { createdAt } }) => {
              return <span>{formatDate(createdAt)}</span>;
            },
          },
          {
            title: '',
            field: 'id',
            Cell: ({ entry: user }) => {
              return (
                <div className='flex gap-0 justify-end items-center'>
                  <Button variant='ghost' size='icon' asChild>
                    <Link to={paths.app.user.getHref(user.id.toString())}>
                      <EyeIcon className='h-4 w-4' />
                    </Link>
                  </Button>
                  <DeleteUser id={user.id} />
                  <UpdateUser userId={user.id} user={user} />
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
