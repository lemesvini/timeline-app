import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { Card, CardContent } from '@/components/ui/card';
import {
  getUsersQueryOptions,
  CreateUser,
  UsersList,
} from '@/features/users';
// import { useSearchParams } from 'react-router';
// import { useMemo } from 'react';

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
  // const [searchParams, setSearchParams] = useSearchParams();
  // const currentFilters = searchParams.get('filters');
  // const initialFilters = useMemo(() => {
  //   try {
  //     return currentFilters ? JSON.parse(currentFilters) : undefined;
  //   } catch {
  //     return undefined;
  //   }
  // }, [currentFilters]);

  // const handleFiltersChange = (newFilters: string) => {
  //   setSearchParams((prev) => {
  //     if (!newFilters) {
  //       prev.delete('filters');
  //     } else {
  //       prev.set('filters', newFilters);
  //     }
  //     return prev;
  //   });
  // };

  return (
    <ContentLayout title='Usuários' rightContent={<CreateUser /> }>
      <div className='space-y-6'>
        {/* Navigation Card */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                {/* <UserFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={initialFilters}
                /> */}
              </div>
              <div className='flex items-center gap-2'>
               {/* <ExportUsers /> */}
                {/* <CreateUser /> */}
              </div>
            </div>
        {/* Table Card */}
        <Card>
          <CardContent className='px-6'>
            <UsersList />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default UsersRoute;
