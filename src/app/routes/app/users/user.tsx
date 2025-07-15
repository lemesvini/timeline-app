import { QueryClient } from '@tanstack/react-query';
import { Link, useParams, type LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { UserView } from '@/features/users/components/user-view';
import { getUserQueryOptions } from '@/features/users/api/get-user';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { paths } from '@/config/paths';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const userId = Number(params.userId);

    const userQuery = getUserQueryOptions(userId);

    const promises = [
      queryClient.getQueryData(userQuery.queryKey) ??
        (await queryClient.fetchQuery(userQuery)),
    ] as const;

    const [user] = await Promise.all(promises);

    return {
      user,
    };
  };

const UserRoute = () => {
  const params = useParams();
  const userId = Number(params.userId);

  return (
    <>
      <ContentLayout title='Usuário'>
        <Button variant='outline' size='sm' className='mb-6' asChild>
          <Link
            to={paths.app.users.getHref()}
            className='flex items-center gap-2'
          >
            <ChevronLeft className='h-4 w-4' />
            Voltar para lista de usuários
          </Link>
        </Button>
        <UserView userId={userId} />
      </ContentLayout>
    </>
  );
};

export default UserRoute;
