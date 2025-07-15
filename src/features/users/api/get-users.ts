import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Meta, User } from '@/types/api';

export const getUsers = ({
  page,
  search,
  filters,
}: {
  page?: number;
  search?: string;
  filters?: string;
}): Promise<{ data: User[]; metadata: Meta }> => {
  return api.get(`/users`, {
    params: {
      page,
      search,
      filters,
    },
  });
};

export const getUsersQueryOptions = (options?: {
  page?: number;
  search?: string;
  filters?: string;
}) => {
  const { page, search, filters } = options || {};
  return queryOptions({
    queryKey: [
      'users',
      {
        ...(page && { page }),
        ...(search && { search }),
        ...(filters && { filters }),
      },
    ],
    queryFn: () => getUsers({ page, search, filters }),
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
  page?: number;
  search?: string;
  filters?: string;
};

export const useUsers = ({
  queryConfig,
  page,
  search,
  filters,
}: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions({ page, search, filters }),
    ...queryConfig,
  });
};
