import { IconEdit } from '@tabler/icons-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useUser } from '@/lib/auth';
import { getInitials, getFirstAndLastWord, getRoleLabel } from '@/lib/utils';
import { Role } from '@/types/api';

interface ProfileDataProps {
  setIsEditing: (value: boolean) => void;
  setIsChangingPassword: (value: boolean) => void;
  isChangingPassword: boolean;
}

export const ProfileData = ({
  setIsEditing,
  setIsChangingPassword,
  isChangingPassword,
}: ProfileDataProps) => {
  const { data: user } = useUser();

  return (
    <Card className='w-full p-4'>
      <CardHeader className='pt-2'>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className='border border-border'>
              {user?.fullName ? getInitials(user.fullName) : ''}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-row flex-1 justify-between items-center'>
            <span className='text-xl font-bold'>
              {getFirstAndLastWord(user?.fullName ?? '')}
            </span>
            <span className='text-xs text-muted-foreground'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsEditing(true)}
                title='Editar Perfil'
                className='w-fit'
              >
                <div className='flex items-center gap-1'>
                  <span>Editar</span>
                  <IconEdit className='size-4' />
                </div>
              </Button>
            </span>
          </div>
        </div>
      </CardHeader>
      <hr />
      <CardContent className='pt-6 pb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='space-y-1 min-w-fit'>
            <span className='text-sm font-semibold text-muted-foreground'>
              Email
            </span>
            <p className='text-sm break-all'>{user?.email}</p>
          </div>
          <div className='space-y-1'>
            <span className='text-sm font-semibold text-muted-foreground'>
              Tipo
            </span>
            <p className='text-sm'>{getRoleLabel(user?.role ?? Role.USER)}</p>
          </div>
          <div className='space-y-1 md:col-span-2 lg:col-span-1'>
            <span className='text-sm font-semibold text-muted-foreground'>
              Criado em
            </span>
            <p className='text-sm'>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                : ''}
            </p>
          </div>
          <div className='space-y-1 md:col-span-2 lg:col-span-1 self-center'>
            {!isChangingPassword && (
              <Button
                variant='default'
                onClick={() => setIsChangingPassword(true)}
              >
                Alterar Senha
              </Button>
            )}
            {isChangingPassword && (
              <Button variant='default' disabled>
                Alterar Senha
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
