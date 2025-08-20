import { QueryClient } from '@tanstack/react-query';
import { Link, useParams, type LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { ProductView } from '@/features/products/components/product-view';
import { getProductQueryOptions } from '@/features/products/api/get-product';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { paths } from '@/config/paths';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const productId = Number(params.productId);

    const productQuery = getProductQueryOptions(productId);

    const promises = [
      queryClient.getQueryData(productQuery.queryKey) ??
        (await queryClient.fetchQuery(productQuery)),
    ] as const;

    const [product] = await Promise.all(promises);

    return {
      product,
    };
  };

const ProductRoute = () => {
  const params = useParams();
  const productId = Number(params.productId);

  return (
    <ContentLayout title='Detalhes do Produto'>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to={paths.app.products.getHref()}>
              <ChevronLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Produto #{productId}
            </h1>
            <p className='text-muted-foreground'>
              Visualize os detalhes do produto
            </p>
          </div>
        </div>

        <ProductView productId={productId} />
      </div>
    </ContentLayout>
  );
};

export default ProductRoute; 