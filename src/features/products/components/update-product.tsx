import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
} from '@/components/ui/form';

import { useUpdateProduct } from '../api/update-product';
import type { Product } from '@/types/api';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório').refine(
    (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    'Preço deve ser um número maior que zero',
  ),
});

type UpdateProductFormData = z.infer<typeof updateProductSchema>;

interface UpdateProductProps {
  productId: number;
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateProduct = ({
  productId,
  product,
  open,
  onOpenChange,
}: UpdateProductProps) => {
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (!open) updateProduct.reset();
  }, [open]);

  const onSubmit = (data: UpdateProductFormData) => {
    updateProduct.mutate(
      {
        productId,
        data: {
          name: data.name,
          description: data.description || undefined,
          price: parseFloat(data.price),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      isDone={updateProduct.isSuccess}
      title="Editar produto"
      submitButton={
        <Button
          type="submit"
          isLoading={updateProduct.isPending}
          form="update-product"
        >
          Salvar
        </Button>
      }
    >
      <Form
        id="update-product"
        onSubmit={onSubmit}
        schema={updateProductSchema}
        options={{
          defaultValues: {
            name: product.name,
            description: product.description,
            price: String(product.price),
          },
        }}
        className="space-y-4"
      >
        {({ register, formState }) => (
          <div className="space-y-4">
            <Input
              label="Nome"
              error={formState.errors['name']}
              registration={register('name')}
              placeholder="Nome do produto"
            />
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Descrição do produto (opcional)"
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              {formState.errors['description'] && (
                <span className="text-xs text-red-500">{formState.errors['description'].message as string}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">
                Preço
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  {...register('price')}
                  className="pl-9 w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              {formState.errors['price'] && (
                <span className="text-xs text-red-500">{formState.errors['price'].message as string}</span>
              )}
            </div>
          </div>
        )}
      </Form>
    </FormDrawer>
  );
};