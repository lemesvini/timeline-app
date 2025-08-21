import { Package, Calendar } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useProduct } from '../api/get-product';

interface ProductViewProps {
  productId: number;
}

export const ProductView = ({ productId }: ProductViewProps) => {
  const productQuery = useProduct(productId);

  if (productQuery.isLoading) {
    return (
      <div className='flex h-48 w-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <div className='flex h-48 w-full items-center justify-center'>
        <p>Erro ao carregar produto</p>
      </div>
    );
  }

  const product = productQuery.data;

  if (!product) {
    return (
      <div className='flex h-48 w-full items-center justify-center'>
        <p>Produto não encontrado</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">Detalhes do produto</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nome
              </label>
              <p className="text-lg">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Descrição
              </label>
              <p className="text-lg">
                {product.description || 'Sem descrição disponível'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Preço
              </label>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID do Produto
              </label>
              <p className="text-lg font-mono">{product.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Criado em
              </label>
              <p className="text-lg">{formatDate(product.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 