import { IconPlus } from '@tabler/icons-react';
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
import { Role } from '@/types/api';
import { getRoleLabel } from '@/lib/utils';

import { createUserInputSchema, useCreateUser } from '../api/create-user';

export const CreateUser = () => {
  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Usuário criado com sucesso');
      },
    },
  });

  return (
    <Authorization allowedRoles={[ROLES.ADMINISTRATOR]}>
      <FormDrawer
        isDone={createUserMutation.isSuccess}
        triggerButton={
          <Button size='sm' icon={<IconPlus className='size-4' />}>
            Criar usuário
          </Button>
        }
        title='Criar usuário'
        submitButton={
          <Button
            type='submit'
            isLoading={createUserMutation.isPending}
            form='create-user'
          >
            Criar
          </Button>
        }
      >
        <Form
          id='create-user'
          onSubmit={(values) => {
            createUserMutation.mutate(values);
          }}
          options={{
            defaultValues: {
              role: Role.USER,
              email: '',
              password: '',
              fullName: '',
              avatarUrl: '',
            },
          }}
          schema={createUserInputSchema}
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
                    label='Nome completo *'
                    error={formState.errors['fullName']}
                    registration={register('fullName')}
                  />
                  <Input
                    label='Email *'
                    error={formState.errors['email']}
                    registration={register('email')}
                  />
                  <Input
                    label='Senha *'
                    type='password'
                    error={formState.errors['password']}
                    registration={register('password')}
                  />
                  <Select
                    label='Cargo *'
                    error={formState.errors['role']}
                    registration={register('role')}
                    options={Object.values(Role).map((role) => ({
                      label: getRoleLabel(role),
                      value: role,
                    }))}
                    defaultValue={Role.USER}
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
