import { useCallback } from 'react';
import type { FilterConfig, FilterOperation } from '@/types/filters';
import type { FilterValue } from '@/types/api';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  // FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FILTER_OPERATIONS, FILTER_OPERATION_LABELS } from '@/types/filters';
import { z } from 'zod';
import { QuerySelect } from '@/components/ui/form/query-select';
import { Button } from '@/components/ui/button';
import { IconX } from '@tabler/icons-react';
import { CalendarIcon } from 'lucide-react';

interface FilterFieldProps<TEntity> {
  config: FilterConfig<TEntity>;
  value?: FilterValue;
  operation?: FilterOperation;
  onValueChange: (value: FilterValue | undefined) => void;
  onOperationChange: (operation: FilterOperation) => void;
  onRemove: () => void;
}

export const FilterField = <TEntity extends Record<string, any>>({
  config,
  value,
  operation,
  onValueChange,
  onOperationChange,
  onRemove,
}: FilterFieldProps<TEntity>) => {
  const availableOperations =
    FILTER_OPERATIONS[config.type === 'query-select' ? 'select' : config.type];

  const handleValueChange = useCallback(
    (newValue: string | number) => {
      if (config.type === 'number') {
        onValueChange(newValue === '' ? undefined : Number(newValue));
      } else {
        onValueChange(newValue === '' ? undefined : newValue);
      }
    },
    [config.type, onValueChange],
  );

  const renderInput = () => {
    switch (config.type) {
      case 'query-select':
        if (!config.querySelect) return null;
        return (
          <div className='relative'>
            <QuerySelect
              field={{
                value: value,
                onChange: (newValue: any) => onValueChange(newValue),
                onBlur: () => {},
                name: config.field as string,
                ref: () => {},
              }}
              {...config.querySelect}
            />
          </div>
        );
      case 'select':
        return (
          <div className='relative w-full'>
            <Select
              value={value?.toString() || ''}
              onValueChange={handleValueChange}
            >
              <SelectTrigger className={`w-full ${value ? 'pr-8' : ''}`}>
                <SelectValue placeholder='Selecione...' />
              </SelectTrigger>
              <SelectContent>
                {config.options?.map((option) => (
                  <SelectItem
                    key={option.value.toString()}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {value && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0'
                onClick={onRemove}
              >
                <IconX className='h-3 w-3' />
              </Button>
            )}
          </div>
        );
      case 'number':
        return (
          <div className='relative'>
            <Input
              type='number'
              value={value?.toString() || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={`${config.label}`}
              className='pr-8'
            />
            {value && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0'
                onClick={onRemove}
              >
                <IconX className='h-3 w-3' />
              </Button>
            )}
          </div>
        );
      case 'date':
        return (
          <div className='relative'>
            <Input
              type='date'
              value={
                value
                  ? new Date(value as string).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={`${config.label}`}
              className='[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer'
            />
            <CalendarIcon className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
            {value && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0'
                onClick={onRemove}
              >
                <IconX className='h-3 w-3' />
              </Button>
            )}
          </div>
        );
      default:
        return (
          <div className='relative'>
            <Input
              type='text'
              value={value?.toString() || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={`${config.label}`}
              className='pr-8'
            />
            {value && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0'
                onClick={onRemove}
              >
                <IconX className='h-3 w-3' />
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className='space-y-2 w-full'>
      <Form onSubmit={() => {}} schema={z.object({})}>
        {() => (
          <FormItem className='w-full'>
            <FormLabel className='text-sm font-medium'>
              {config.label}
            </FormLabel>
            <div className='flex flex-col sm:flex-row gap-2 items-center'>
              <div className='w-full sm:w-[30%] min-w-[120px] max-w-[200px]'>
                <Select
                  value={operation}
                  onValueChange={(op) =>
                    onOperationChange(op as FilterOperation)
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Operação' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperations.map((op) => (
                      <SelectItem key={op} value={op}>
                        {FILTER_OPERATION_LABELS[op]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex-1 min-w-0'>
                <FormControl>{renderInput()}</FormControl>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      </Form>
    </div>
  );
};
