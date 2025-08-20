import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/lib/api-client';
import type { Product } from '@/types/api';

type UpdateProductData = {
  name: string;
  description?: string;
  price: number;
};

export const updateProduct = (
  productId: number,
  data: UpdateProductData,
): Promise<Product> => {
  return api.put(`/products/${productId}`, data);
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: UpdateProductData }) =>
      updateProduct(productId, data),
    onSuccess: (_, { productId }) => {
      toast.success('Produto atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (error: any) => {
      console.error('Error updating product:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar produto',
      );
    },
  });
}; 