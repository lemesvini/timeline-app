import { IconPencil } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
  Select,
  ImageInput,
} from '@/components/ui/form';
import { Authorization, ROLES } from '@/lib/authorization';
import { Role, type User } from '@/types/api';
import { getRoleLabel } from '@/lib/utils';

import { useUpdateUser, updateUserInputSchema } from '../api/update-user';

type UpdateUserProps = {
  userId: number;
  user: User;
};

export const UpdateUser = ({ userId, user }: UpdateUserProps) => {
  const updateUserMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Usuário atualizado com sucesso');
      },
    },
  });

  return (
    <Authorization allowedRoles={[ROLES.ADMINISTRATOR]}>
      <FormDrawer
        isDone={updateUserMutation.isSuccess}
        triggerButton={
          <Button size='icon' variant='ghost'>
            <IconPencil className='size-4' />
          </Button>
        }
        title='Editar usuário'
        submitButton={
          <Button
            type='submit'
            isLoading={updateUserMutation.isPending}
            form='update-user'
          >
            Salvar
          </Button>
        }
      >
        <Form
          id='update-user'
          onSubmit={(data) => {
            updateUserMutation.mutate({
              data,
              userId,
            });
          }}
          options={{
            defaultValues: {
              ...user,
              avatarUrl: user.avatarUrl,
            },
          }}
          schema={updateUserInputSchema}
        >
          {({ register, formState, watch, setValue }) => {
            const avatarUrl = watch('avatarUrl');

            return (
              <>
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
                  />
                  <Select
                    label='Cargo'
                    error={formState.errors['role']}
                    registration={register('role')}
                    options={Object.values(Role).map((role) => ({
                      label: getRoleLabel(role),
                      value: role,
                    }))}
                  />
                </div>
              </>
            );
          }}
        </Form>
      </FormDrawer>
    </Authorization>
  );
};
