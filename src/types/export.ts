import type { FiltersType } from './filters';

export interface SelectableField {
  field: string;
  label: string;
}

export interface ExportResponse {
  message: string;
  data: {
    fileUrl: string;
    filename: string;
  };
}

export interface SelectableFieldsResponse {
  message: string;
  data: SelectableField[];
}

export type ExportFormat = 'pdf' | 'csv';

export interface ExportParams {
  selectedFields: string[];
  format: ExportFormat;
  search?: string;
  filters?: FiltersType;
}
