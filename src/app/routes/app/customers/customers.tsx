import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { getCustomersQueryOptions } from '@/features/customers/api/get-customers';

import { CustomersList } from '@/features/customers/components/customers-list';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    try {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 1;

      const query = getCustomersQueryOptions({ page });

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
    <ContentLayout title='Clientes' rightContent={<div />}>
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
        <CustomersList />
      </div>
    </ContentLayout>
  );
};

export default UsersRoute;
