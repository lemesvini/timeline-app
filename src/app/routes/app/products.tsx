import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import {
  getProductsQueryOptions,
  CreateProduct,
  ProductsList,
  ProductFilters,
} from '@/features/products';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const query = getProductsQueryOptions({ page });
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const ProductsRoute = () => {
  return (
    <ContentLayout title='Produtos' rightContent={<CreateProduct />}>
      <div className='space-y-6'>
        <ProductFilters />

        <ProductsList />
      </div>
    </ContentLayout>
  );
};

export default ProductsRoute; 