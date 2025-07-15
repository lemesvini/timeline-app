import * as React from 'react';
import { Controller, type UseFormRegisterReturn } from 'react-hook-form';

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import {
  FieldWrapper,
  type FieldWrapperPassThroughProps,
} from './field-wrapper';

type Option = {
  label: React.ReactNode;
  value: string | number;
};

type SelectFieldProps = FieldWrapperPassThroughProps & {
  options: Option[];
  className?: string;
  defaultValue?: string;
  registration: Partial<UseFormRegisterReturn>;
  placeholder?: string;
};

export const Select = (props: SelectFieldProps) => {
  const {
    label,
    options,
    error,
    className,
    defaultValue,
    registration,
    placeholder = 'Selecione uma opção',
  } = props;
  const { name } = registration;

  if (!name) {
    return null;
  }

  return (
    <FieldWrapper label={label} error={error}>
      <Controller
        defaultValue={defaultValue}
        name={name}
        render={({ field }) => (
          <ShadcnSelect onValueChange={field.onChange} value={field.value}>
            <SelectTrigger ref={field.ref} className={cn('w-full', className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ label, value }) => (
                <SelectItem key={label?.toString()} value={String(value)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
        )}
      />
    </FieldWrapper>
  );
};
