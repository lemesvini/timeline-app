import { Button } from '@/components/ui/button';
import { FilterField } from './filter-field';
import type { FilterConfig, FilterOperation, Filter } from '@/types/filters';
import type { FilterValue } from '@/types/api';
import { useFilters } from '@/hooks/use-filters';

interface FilterContainerProps<TEntity> {
  configs: FilterConfig<TEntity>[];
  onFiltersChange?: (serializedFilters: string) => void;
  defaultFilters?: Filter;
}

export const FilterContainer = <TEntity extends Record<string, any>>({
  configs,
  onFiltersChange,
  defaultFilters,
}: FilterContainerProps<TEntity>) => {
  const {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    getSerializedFilters,
  } = useFilters({
    defaultFilters,
    onFilterChange: () => {},
  });

  const handleFilterChange = (
    field: string,
    operation: FilterOperation,
    value: FilterValue | undefined,
  ) => {
    setFilter(field, operation, value);
  };

  const handleApplyFilters = () => {
    const hasActiveFilters = Object.entries(filters).some(([_, operations]) => {
      const operation = Object.keys(operations)[0] as FilterOperation;
      const value = operations[operation];
      return value !== '' && value !== undefined;
    });

    if (hasActiveFilters) {
      onFiltersChange?.(getSerializedFilters());
    } else {
      onFiltersChange?.('');
    }
  };

  const handleRemoveFilter = (field: string) => {
    clearFilter(field);
    const remainingFilters = { ...filters };
    delete remainingFilters[field];

    const hasActiveFilters = Object.entries(remainingFilters).some(
      ([_, operations]) => {
        const operation = Object.keys(operations)[0] as FilterOperation;
        const value = operations[operation];
        return value !== '' && value !== undefined;
      },
    );

    if (hasActiveFilters) {
      onFiltersChange?.(JSON.stringify(remainingFilters));
    } else {
      onFiltersChange?.('');
    }
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    configs.forEach((config) => {
      handleFilterChange(config.field as string, 'eq', undefined);
    });
    onFiltersChange?.('');
  };

  return (
    <div className='space-y-4 w-full overflow-hidden p-4'>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {configs.map((config) => {
          const filterValue = filters[config.field as string] || {};
          const operation =
            (Object.keys(filterValue)[0] as FilterOperation) || 'eq';
          const value = filterValue[operation];
          const normalizedValue = Array.isArray(value) ? value[0] : value;

          const displayValue =
            normalizedValue === '' ? undefined : normalizedValue;

          return (
            <FilterField<TEntity>
              key={config.field as string}
              config={config}
              value={displayValue}
              operation={operation}
              onValueChange={(newValue) =>
                handleFilterChange(config.field as string, operation, newValue)
              }
              onOperationChange={(newOperation) =>
                handleFilterChange(
                  config.field as string,
                  newOperation,
                  displayValue,
                )
              }
              onRemove={() => handleRemoveFilter(config.field as string)}
            />
          );
        })}
      </div>

      <div className='flex flex-col sm:flex-row justify-end gap-2 mt-6'>
        <Button
          onClick={handleClearAllFilters}
          variant='outline'
          className='w-full sm:w-auto'
        >
          Limpar todos
        </Button>

        <Button
          onClick={handleApplyFilters}
          variant='secondary'
          className='w-full sm:w-auto'
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};
