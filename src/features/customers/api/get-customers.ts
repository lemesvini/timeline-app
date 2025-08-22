import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Meta, Customers } from '@/types/api';

export const getCustomers = ({
  page,
  search,
  filters,
}: {
  page?: number;
  search?: string;
  filters?: string;
}): Promise<{ data: Customers[]; metadata: Meta }> => {
  return api.get(`/customers`, {
    params: {
      page,
      search,
      filters,
    },
  });
};

export const getCustomersQueryOptions = (options?: {
  page?: number;
  search?: string;
  filters?: string;
}) => {
  const { page, search, filters } = options || {};
  return queryOptions({
    queryKey: [
      'customers',
      {
        ...(page && { page }),
        ...(search && { search }),
        ...(filters && { filters }),
      },
    ],
    queryFn: () => getCustomers({ page, search, filters }),
  });
};

type UseCustomersOptions = {
  queryConfig?: QueryConfig<typeof getCustomersQueryOptions>;
  page?: number;
  search?: string;
  filters?: string;
};

export const useCustomers = ({
  queryConfig,
  page,
  search,
  filters,
}: UseCustomersOptions = {}) => {
  return useQuery({
    ...getCustomersQueryOptions({ page, search, filters }),
    ...queryConfig,
  });
};
