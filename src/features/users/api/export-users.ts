import { useQuery, queryOptions } from '@tanstack/react-query';

import { z } from 'zod';

import { api } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';

import { type ExportParams, type ExportResponse } from '@/types/export';

export const getSelectableFields = async () => {
  return api.get('/users/export/selectable-fields');
};

export const getSelectableFieldsQueryOptions = () => {
  return queryOptions({
    queryKey: ['user-export-fields'],
    queryFn: getSelectableFields,
  });
};

type UseGetUserExportFieldsOptions = {
  queryConfig?: QueryConfig<typeof getSelectableFieldsQueryOptions>;
};

export const useGetUserExportFields = ({
  queryConfig,
}: UseGetUserExportFieldsOptions) => {
  return useQuery({
    ...getSelectableFieldsQueryOptions(),
    ...queryConfig,
  });
};

export const exportUsersInputSchema = z.object({
  selectedFields: z.array(z.string()).optional(),
  format: z.enum(['csv', 'xlsx']).optional(),
  search: z.string().optional(),
  filters: z.record(z.any()).optional(),
});

export type ExportUsersInput = z.infer<typeof exportUsersInputSchema>;

export const exportUsers = async (
  params: ExportParams,
): Promise<ExportResponse> => {
  const queryParams = new URLSearchParams();

  if (params.selectedFields) {
    queryParams.append('selectedFields', params.selectedFields.join(','));
  }
  if (params.format) {
    queryParams.append('format', params.format);
  }
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.filters) {
    queryParams.append('filters', JSON.stringify(params.filters));
  }

  return api.get(`/users/export?${queryParams.toString()}`);
};
