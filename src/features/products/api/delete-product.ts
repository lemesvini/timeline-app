import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/lib/api-client';

export const deleteProduct = (productId: number): Promise<void> => {
  return api.delete(`/products/${productId}`);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Produto excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Error deleting product:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao excluir produto',
      );
    },
  });
}; 