import { useCallback, useState } from 'react';
import type {
  FilterOperation,
  FilterState,
  UseFiltersOptions,
} from '@/types/filters';
import type { FilterValue } from '@/types/api';

export const useFilters = (options: UseFiltersOptions = {}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    filters: options.defaultFilters || {},
    activeFilters: Object.keys(options.defaultFilters || {}),
  });

  const setFilter = useCallback(
    (
      field: string,
      operation: FilterOperation,
      value: FilterValue | undefined,
    ) => {
      // Always keep the filter in state with at least an empty string
      // This allows us to preserve operations even without values
      setFilterState((prev) => {
        const newFilters = { ...prev.filters };

        if (!value && value !== 0) {
          // For empty values, keep an empty string to maintain the operation
          newFilters[field] = { [operation]: '' };
        } else {
          newFilters[field] = { [operation]: value };
        }

        const newState = {
          filters: newFilters,
          activeFilters: Object.keys(newFilters),
        };

        options.onFilterChange?.(newFilters);
        return newState;
      });
    },
    [options],
  );

  const clearFilter = useCallback(
    (field: string) => {
      setFilterState((prev) => {
        const newFilters = { ...prev.filters };
        delete newFilters[field];

        const newState = {
          filters: newFilters,
          activeFilters: Object.keys(newFilters),
        };

        options.onFilterChange?.(newFilters);
        return newState;
      });
    },
    [options],
  );

  const clearAllFilters = useCallback(() => {
    setFilterState({
      filters: {},
      activeFilters: [],
    });
    options.onFilterChange?.({});
  }, [options]);

  const getSerializedFilters = useCallback(() => {
    const filtersToSerialize = Object.entries(filterState.filters).reduce(
      (acc, [field, operations]) => {
        const operation = Object.keys(operations)[0] as FilterOperation;
        const value = operations[operation];
        if (value !== '') {
          if (operation === '$regex') {
            acc[field] = {
              $regex: String(value),
              $options: 'i',
            };
          } else {
            acc[field] = operations;
          }
        }
        return acc;
      },
      {} as typeof filterState.filters,
    );

    return JSON.stringify(filtersToSerialize);
  }, [filterState.filters]);

  return {
    filters: filterState.filters,
    activeFilters: filterState.activeFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
    getSerializedFilters,
  };
};
