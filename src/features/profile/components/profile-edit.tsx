import { IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, Input, ImageInput } from '@/components/ui/form';

import { useUser, useUpdateAuthenticatedUser } from '@/lib/auth';
import { getInitials } from '@/lib/utils';

import {
  useUpdateUser,
  updateUserInputSchema,
} from '@/features/users/api/update-user';

interface ProfileEditProps {
  setIsEditing: (value: boolean) => void;
}

export const ProfileEdit = ({ setIsEditing }: ProfileEditProps) => {
  const { data: user } = useUser();
  const updateAuthenticatedUser = useUpdateAuthenticatedUser();

  const updateUserMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: (updatedUser) => {
        updateAuthenticatedUser(updatedUser);

        toast.success('Perfil atualizado com sucesso');
        setIsEditing(false);
      },
    },
  });

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
            <span className='text-xl font-bold'>{user?.fullName ?? ''}</span>
            <span className='text-xs text-muted-foreground'>
              <Button
                variant='ghost'
                size='icon'
                type='button'
                isLoading={updateUserMutation.isPending}
                title='Cancelar Edição'
                onClick={() => setIsEditing(false)}
                className='w-fit'
              >
                <div className='flex items-center gap-1 text-muted-foreground hover:text-destructive'>
                  <span>Cancelar</span>
                  {/* <IconCancel className='size-4' /> */}
                </div>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                form='update-user'
                type='submit'
                isLoading={updateUserMutation.isPending}
                title='Salvar Perfil'
                className='w-fit'
              >
                <div className='flex items-center gap-1'>
                  <span className='text-primary'>Salvar</span>
                  <IconCheck className='size-4 text-primary' />
                </div>
              </Button>
            </span>
          </div>
        </div>
      </CardHeader>
      <hr />
      <CardContent className='pt-6 pb-6'>
        <Form
          id='update-user'
          onSubmit={(data) => {
            updateUserMutation.mutate({
              data,
              userId: user!.id,
            });
          }}
          options={{
            defaultValues: {
              fullName: user!.fullName,
              email: user!.email,
              role: user!.role,
              avatarUrl: user?.avatarUrl,
            },
          }}
          schema={updateUserInputSchema}
        >
          {({ register, formState, watch, setValue }) => {
            const avatarUrl = watch('avatarUrl');

            return (
              <div className='space-y-4'>
                <ImageInput
                  label='Avatar'
                  error={formState.errors['avatarUrl']}
                  value={avatarUrl}
                  onChange={(url) => setValue('avatarUrl', url || '')}
                />
                <Input
                  label='Nome completo'
                  error={formState.errors['fullName']}
                  registration={register('fullName')}
                />
                <Input
                  label='Email'
                  error={formState.errors['email']}
                  registration={register('email')}
                  disabled
                />
                {/* <Select
                  label='Cargo'
                  error={formState.errors['role']}
                  registration={register('role')}
                  options={Object.values(Role).map((role) => ({
                    label: role.replace('_', ' '),
                    value: role,
                  }))}
                /> */}
              </div>
            );
          }}
        </Form>
      </CardContent>
    </Card>
  );
};
