
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useDeleteProduct } from '../api/delete-product';

interface DeleteProductProps {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteProduct = ({ id, open, onOpenChange }: DeleteProductProps) => {
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct.mutate(id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteProduct.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? 'Excluindo...' : 'Excluir Produto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};