import { Link, useSearchParams } from 'react-router';
import { useState } from 'react';

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
import type { Product } from '@/types/api';

import { useProducts } from '../api/get-products';

import { DeleteProduct } from './delete-product';
import { UpdateProduct } from './update-product';
import { paths } from '@/config/paths';
import { Eye, Pencil, Trash2, MoreVertical, Package } from 'lucide-react'; // or use @tabler/icons-react

export const ProductsList = () => {
  const [searchParams] = useSearchParams();
  
  const [editProduct, setEditProduct] = useState<null | Product>(null);
  const [deleteProduct, setDeleteProduct] = useState<null | Product>(null);

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
                <div className="flex items-center justify-center gap-2">
                  <Link to={paths.app.product.getHref(product.id.toString())}>
                    <Button size="icon" variant="ghost" aria-label="Ver produto">
                      <Eye className="h-4 w-4" strokeWidth={2.2} />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Ações">
                        <MoreVertical className="h-4 w-4" strokeWidth={2.2} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-background border border-border">
                      <DropdownMenuItem
                        onSelect={e => {
                          e.preventDefault();
                          setEditProduct(product);
                        }}
                        className="flex items-center gap-2 text-sm hover:bg-muted focus:bg-muted"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2.2} />
                        <span className="text-foreground">Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={e => {
                          e.preventDefault();
                          setDeleteProduct(product);
                        }}
                        className="flex items-center gap-2 text-sm text-red-600 hover:bg-muted focus:bg-muted"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                        <span className="text-red-600">Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Modals/Drawers for edit and delete */}
                  {editProduct?.id === product.id && (
                    <UpdateProduct
                      open={true}
                      onOpenChange={() => setEditProduct(null)}
                      productId={product.id}
                      product={product}
                    />
                  )}
                  {deleteProduct?.id === product.id && (
                    <DeleteProduct
                      open={true}
                      onOpenChange={() => setDeleteProduct(null)}
                      id={product.id}
                    />
                  )}
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