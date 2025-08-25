import { Link, useSearchParams } from 'react-router';
//import { useMemo } from 'react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { getInitials, getRoleLabel, formatDate } from '@/lib/utils';

import { useUsers } from '../api/get-users';

import { DeleteUser } from './delete-user';
import { UpdateUser } from './update-user';
import { paths } from '@/config/paths';
import { EllipsisVertical, EyeIcon } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import type { User } from '@/types/api'; // adjust path if needed

export const UsersList = () => {
  const [searchParams] = useSearchParams();
  const [editUser, setEditUser] = useState<null | User>(null);
  const [deleteUser, setDeleteUser] = useState<null | User>(null);

  const usersQuery = useUsers({
    page: Number(searchParams.get('page') ?? 1),
    filters: searchParams.get('filters') ?? undefined,
  });

  if (usersQuery.isLoading) {
    return <Spinner />;
  }

  if (usersQuery.isError) {
    console.error(usersQuery.error);
    return <div>Houve um erro ao carregar os usuários.</div>;
  }

  const users = usersQuery.data?.data;
  const meta = usersQuery.data?.metadata;

  return (
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
          Cell: ({ entry: user }) => (
            <div className="flex items-center justify-center gap-2">
              <Link to={paths.app.user.getHref(user.id.toString())}>
                <Button size="icon" variant="ghost">
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Ações">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onSelect={e => {
                      e.preventDefault();
                      setEditUser(user);
                    }}
                    className="flex items-center gap-2 text-sm hover:bg-muted focus:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="text-foreground">Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={e => {
                      e.preventDefault();
                      setDeleteUser(user);
                    }}
                    className="flex items-center gap-2 text-sm text-red-600 hover:bg-muted focus:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-red-600">Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Modals/Drawers for edit and delete */}
              {editUser?.id === user.id && (
                <UpdateUser
                  open={true}
                  onOpenChange={() => setEditUser(null)}
                  userId={user.id}
                  user={user}
                />
              )}
              {deleteUser?.id === user.id && (
                <DeleteUser
                  open={true}
                  onOpenChange={() => setDeleteUser(null)}
                  id={user.id}
                />
              )}
            </div>
          ),
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
  );
};