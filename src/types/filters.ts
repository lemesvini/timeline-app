import type { FilterOperators, FilterValue } from './api';
import type { QueryKey } from '@tanstack/react-query';

export type FilterField = string;

export type FilterCondition<T extends FilterValue> = FilterOperators<T>;

export type QuerySelectConfig = {
  queryKeyBase: QueryKey;
  fetchFunction: (searchQuery: string) => Promise<any>;
  fetchItemFunction?: (id: any) => Promise<any>;
  valueAccessor: (item: any) => any;
  labelAccessor: (item: any) => string;
  placeholder?: string;
  selectPlaceholder?: string;
};

export type FilterConfig<TEntity = string> = {
  field: keyof TEntity;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'query-select';
  options?: { label: string; value: string | number }[];
  querySelect?: QuerySelectConfig;
};

export type Filter = {
  [key: string]: FilterOperators<FilterValue>;
};

export type FiltersType = Record<string, FilterOperators<FilterValue>>;

export type FilterState = {
  filters: Filter;
  activeFilters: string[];
};

export type UseFiltersOptions = {
  defaultFilters?: Filter;
  onFilterChange?: (filters: Filter) => void;
};

// Type guard to check if a value is a valid filter value
export const isFilterValue = (value: unknown): value is FilterValue => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
};

// Helper type for filter operations
export type FilterOperation = keyof FilterOperators<any>;

// Available filter operations based on field type
export const FILTER_OPERATIONS: Record<string, FilterOperation[]> = {
  text: ['eq', 'ne', '$regex'],
  number: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
  select: ['eq', 'ne', 'in', 'nin'],
  date: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
} as const;

export const FILTER_OPERATION_LABELS: Record<FilterOperation, string> = {
  eq: 'Igual a',
  ne: 'Diferente de',
  gt: 'Maior que',
  gte: 'Maior ou igual a',
  lt: 'Menor que',
  lte: 'Menor ou igual a',
  in: 'Contém',
  nin: 'Não contém',
  $regex: 'Contém texto',
  $options: 'Opções',
};
