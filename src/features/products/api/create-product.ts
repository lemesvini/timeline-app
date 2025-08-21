import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/lib/api-client';
import type { Product } from '@/types/api';

type CreateProductData = {
  name: string;
  description?: string;
  price: number;
};

export const createProduct = (data: CreateProductData): Promise<Product> => {
  return api.post('/products', data);
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Produto criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Error creating product:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao criar produto',
      );
    },
  });
}; 