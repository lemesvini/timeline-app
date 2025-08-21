import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Meta, Product } from '@/types/api';

export const getProducts = ({
  page,
  search,
  filters,
}: {
  page?: number;
  search?: string;
  filters?: string;
}): Promise<{ data: Product[]; metadata: Meta }> => {
  return api.get(`/products`, {
    params: {
      page,
      search,
      filters,
    },
  });
};

export const getProductsQueryOptions = (options?: {
  page?: number;
  search?: string;
  filters?: string;
}) => {
  return queryOptions({
    queryKey: ['products', options],
    queryFn: () => getProducts(options || {}),
  });
};

export const useProducts = (
  options?: {
    page?: number;
    search?: string;
    filters?: string;
  },
  config?: QueryConfig<typeof getProducts>,
) => {
  return useQuery({
    ...getProductsQueryOptions(options),
    ...config,
  });
}; 