import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Product } from '@/types/api';

export const getProduct = (productId: number): Promise<Product> => {
  return api.get(`/products/${productId}`);
};

export const getProductQueryOptions = (productId: number) => {
  return queryOptions({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  });
};

export const useProduct = (
  productId: number,
  config?: QueryConfig<typeof getProduct>,
) => {
  return useQuery({
    ...getProductQueryOptions(productId),
    ...config,
  });
}; 