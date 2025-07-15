import { useQuery, type QueryKey } from '@tanstack/react-query';
import { IconCheck } from '@tabler/icons-react';
import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  type ControllerRenderProps,
  type FieldValues,
  type FieldPath,
  type FieldPathValue,
  type FieldError,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

import { FieldWrapper } from './field-wrapper';

interface QuerySelectProps<
  TDataItem,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  queryKeyBase: QueryKey;
  fetchFunction: (searchQuery: string) => Promise<TDataItem[]>;
  fetchItemFunction?: (
    // Optional function to fetch a single item by its value
    id: FieldPathValue<TFieldValues, TName>,
  ) => Promise<TDataItem | null | undefined>;
  valueAccessor: (item: TDataItem) => FieldPathValue<TFieldValues, TName>;
  labelAccessor: (item: TDataItem) => string;
  placeholder?: string;
  selectPlaceholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  label?: string;
  error?: FieldError | undefined;
}

export const QuerySelect = <
  TDataItem,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: QuerySelectProps<TDataItem, TFieldValues, TName>,
) => {
  const {
    field,
    queryKeyBase,
    fetchFunction,
    fetchItemFunction, // Destructure new prop
    valueAccessor,
    labelAccessor,
    placeholder = 'Buscar...',
    selectPlaceholder = 'Selecionar...',
    disabled = false,
    clearable = true,
    label,
    error: fieldError,
  } = props;

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const currentFieldValue = field.value as
    | FieldPathValue<TFieldValues, TName>
    | undefined;

  const {
    data: optionsList,
    isLoading: isLoadingList,
    error: listQueryError,
  } = useQuery<TDataItem[], Error>({
    queryKey: [queryKeyBase, 'list', debouncedSearchQuery],
    queryFn: () => fetchFunction(debouncedSearchQuery),
    enabled: open,
    staleTime: 1000 * 60 * 2,
  });

  const selectedOptionFromList = React.useMemo(
    () =>
      optionsList?.find(
        (option) => valueAccessor(option) === currentFieldValue,
      ),
    [optionsList, currentFieldValue, valueAccessor],
  );

  const { data: initialSelectedItemData, isLoading: isLoadingInitialItem } =
    useQuery<TDataItem | null | undefined, Error>({
      queryKey: [queryKeyBase, 'detail', currentFieldValue],
      queryFn: async () => {
        if (
          !fetchItemFunction ||
          currentFieldValue === undefined ||
          currentFieldValue === null
        ) {
          return null;
        }
        return fetchItemFunction(currentFieldValue);
      },
      enabled:
        !!fetchItemFunction &&
        currentFieldValue !== undefined &&
        currentFieldValue !== null &&
        !selectedOptionFromList,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    });

  let displayLabel: string = selectPlaceholder;
  if (selectedOptionFromList) {
    displayLabel = labelAccessor(selectedOptionFromList);
  } else if (initialSelectedItemData) {
    displayLabel = labelAccessor(initialSelectedItemData);
  } else if (isLoadingInitialItem && currentFieldValue) {
    displayLabel = 'Carregando item...';
  } else if (
    currentFieldValue !== undefined &&
    currentFieldValue !== null &&
    currentFieldValue !== ''
  ) {
    displayLabel = `ID: ${String(currentFieldValue)}`;
  }

  const hasValue =
    currentFieldValue !== undefined &&
    currentFieldValue !== null &&
    currentFieldValue !== '';

  const handleClear = (e: React.MouseEvent) => {
    console.log('handleClear');
    e.preventDefault();
    e.stopPropagation();
    field.onChange(null);
    setSearchQuery('');
  };

  const selectContent = (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={
            disabled ||
            (isLoadingInitialItem &&
              !selectedOptionFromList &&
              !initialSelectedItemData)
          }
          className={cn(
            'w-full text-left font-normal px-2 py-2 h-10',
            !field.value && 'text-muted-foreground',
            'hover:bg-transparent hover:text-foreground',
          )}
          onClick={() => !disabled && setOpen(!open)}
        >
          <div className='flex items-center justify-between w-full'>
            <span className='truncate w-full'>{displayLabel}</span>
            <div className='flex items-center ml-2 shrink-0'>
              <ChevronDown className='h-4 w-4 opacity-50 ml-1' />
              {clearable && hasValue && !disabled && (
                <div
                  onClick={handleClear}
                  role='button'
                  tabIndex={0}
                  aria-label='Limpar seleção'
                  className='p-1 rounded-sm transition-colors cursor-pointer hover:bg-muted'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleClear(e as any);
                    }
                  }}
                >
                  <X className='h-3 w-3' />
                </div>
              )}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        align='start'
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>
              {isLoadingList
                ? 'Carregando...'
                : listQueryError
                  ? `Erro: ${listQueryError.message}`
                  : 'Nenhum resultado encontrado.'}
            </CommandEmpty>
            {!isLoadingList && optionsList && optionsList.length > 0 && (
              <CommandGroup>
                {optionsList.map((item, index) => {
                  const itemValue = valueAccessor(item);
                  const itemLabel = labelAccessor(item);
                  return (
                    <CommandItem
                      key={String(itemValue) || index}
                      value={itemLabel}
                      onSelect={() => {
                        if (itemValue !== currentFieldValue) {
                          field.onChange(itemValue);
                        }
                        setOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <IconCheck
                        className={cn(
                          'mr-2 h-4 w-4 inline shrink-0',
                          itemValue === currentFieldValue
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      <span className='truncate'>{itemLabel}</span>{' '}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return (
    <FieldWrapper label={label} error={fieldError} className='w-full'>
      {selectContent}
    </FieldWrapper>
  );
};
