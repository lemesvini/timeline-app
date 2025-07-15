import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type User } from '@/types/api';

export const getUser = async ({
  userId,
}: {
  userId: number;
}): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserQueryOptions = (userId: number) => {
  return queryOptions({
    queryKey: ['user', userId],
    queryFn: () => getUser({ userId }),
  });
};

type UseGetUserOptions = {
  userId: number;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useGetUser = ({ userId, queryConfig }: UseGetUserOptions) => {
  return useQuery({ ...getUserQueryOptions(userId), ...queryConfig });
};
