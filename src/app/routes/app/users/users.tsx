import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import {
  getUsersQueryOptions,
  CreateUser,
  UsersList,
  ExportUsers,
} from '@/features/users';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    try {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 1;

      const query = getUsersQueryOptions({ page });

      const data =
        queryClient.getQueryData(query.queryKey) ??
        (await queryClient.fetchQuery(query));

      if (!data) {
        throw new Error('Failed to fetch users data');
      }

      return data;
    } catch (error) {
      console.error('Error in users loader:', error);
      throw error;
    }
  };

const UsersRoute = () => {
  return (
    <ContentLayout title='Usuários'>
      <div className='flex justify-end pb-2 items-center gap-2'>
        <ExportUsers />
        <CreateUser />
      </div>
      <UsersList />
    </ContentLayout>
  );
};

export default UsersRoute;
