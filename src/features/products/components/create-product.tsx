import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
} from '@/components/ui/form';

import { useCreateProduct } from '../api/create-product';

const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: 'Preço é obrigatório' }).positive('Preço deve ser maior que zero')
  ),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

export const CreateProduct = () => {
  const [open, setOpen] = useState(false);
  const createProduct = useCreateProduct();

  const onSubmit = (data: CreateProductFormData) => {
    createProduct.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  // Always reset mutation state when opening or closing drawer
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    createProduct.reset();
  };

  void open;
  void handleOpenChange;

  return (
    <FormDrawer
      isDone={createProduct.isSuccess}
      triggerButton={
        <Button size='sm' >
            + Criar Produto
          </Button>
      }
      title="Criar produto"
      submitButton={
        <Button
          type="submit"
          disabled={createProduct.isPending}
          isLoading={createProduct.isPending}
          form="create-product"
        >
          {createProduct.isPending ? 'Criando...' : 'Criar'}
        </Button>
      }
    >
      <Form
        id="create-product"
        onSubmit={onSubmit}
        schema={createProductSchema}
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
            {/* Use textarea for description if Input does not support multiline */}
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
                  step="1.00"
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