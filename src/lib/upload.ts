import axios from 'axios';

import { api } from './api-client';

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    .toLowerCase()
    .replace(/(.+)\.(.+)$/, `$1-${Date.now()}.$2`);
}

interface GetPresignedUrlRequest {
  filename: string;
  filetype: string;
}

interface GetPresignedUrlResponse {
  presignedUrl: string;
  previewUrl: string;
}

interface UploadFileOptions {
  file: File;
  isPublic?: boolean;
  onProgress?: (progress: number) => void;
}

export const uploadApi = {
  getPresignedUrl: (data: GetPresignedUrlRequest) => {
    return api.post<GetPresignedUrlResponse>('/uploads/presigned-url', data);
  },

  getPublicPresignedUrl: (data: GetPresignedUrlRequest) => {
    return api.post<GetPresignedUrlResponse>(
      '/uploads/presigned-url/public',
      data,
    );
  },

  async uploadFile({
    file,
    isPublic = false,
    onProgress,
  }: UploadFileOptions): Promise<string> {
    const sanitizedFileName = sanitizeFileName(file.name);

    // 1. Get presigned URL
    const getUrl = isPublic ? this.getPublicPresignedUrl : this.getPresignedUrl;
    const response = await getUrl({
      filename: sanitizedFileName,
      filetype: file.type,
    });

    const { presignedUrl, previewUrl } = response.data;

    // 2. Upload to S3
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 100),
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });

    // 3. Return the preview URL
    return previewUrl;
  },

  validateImage(file: File): { isValid: boolean; error?: string } {
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Por favor, selecione uma imagem válida',
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'A imagem deve ter no máximo 5MB',
      };
    }

    return { isValid: true };
  },

  createObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
  },
};
