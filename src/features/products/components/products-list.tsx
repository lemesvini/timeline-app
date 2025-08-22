import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';

import { useProducts } from '../api/get-products';

import { DeleteProduct } from './delete-product';
import { UpdateProduct } from './update-product';
import { paths } from '@/config/paths';
import { EllipsisVertical, EyeIcon, Package } from 'lucide-react';

export const ProductsList = () => {
  const [searchParams] = useSearchParams();

  const productsQuery = useProducts({
    page: Number(searchParams.get('page') ?? 1),
    filters: searchParams.get('filters') ?? undefined,
  });

  if (productsQuery.isLoading) {
    return <Spinner />;
  }

  if (productsQuery.isError) {
    console.error(productsQuery.error);
    return <div>Houve um erro ao carregar os produtos.</div>;
  }

  const products = productsQuery.data?.data;
  const meta = productsQuery.data?.metadata;

  return (
    <Card>
      <CardContent>
        <Table
          data={products || []}
          columns={[
            {
              title: 'Nome',
              field: 'name',
              Cell: ({ entry: { name } }) => (
                <div className='flex items-center gap-2'>
                  <Package className='h-4 w-4 text-muted-foreground' />
                  <span>{name}</span>
                </div>
              ),
            },
            {
              title: 'Descrição',
              field: 'description',
              breakpoint: 'md',
              Cell: ({ entry: { description } }) => (
                <span
                  className="max-w-[200px] truncate block text-muted-foreground"
                  title={description}
                >
                  {description || 'Sem descrição'}
                </span>
              ),
            },
            {
              title: 'Preço',
              field: 'price',
              breakpoint: 'sm',
              Cell: ({ entry: { price } }) => (
                <span className='font-medium'>{formatCurrency(price)}</span>
              ),
            },
            {
              title: 'Criado em',
              field: 'createdAt',
              breakpoint: 'lg',
              Cell: ({ entry: { createdAt } }) => (
                <span>{formatDate(createdAt)}</span>
              ),
            },
            {
              title: '',
              field: 'id',
              Cell: ({ entry: product }) => (
                <div className="flex items-center gap-2">
                  <Link to={paths.app.product.getHref(product.id.toString())}>
                    <Button size="icon" variant="ghost">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <UpdateProduct productId={product.id} product={product} />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteProduct id={product.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ),
            },
          ]}
          pagination={{
            currentPage: Number(meta?.page ?? 1),
            totalPages: Math.ceil(
              Number(meta?.total ?? 0) / Number(meta?.limit ?? 10),
            ),
            rootUrl: '',
          }}
        />
      </CardContent>
    </Card>
  );
};