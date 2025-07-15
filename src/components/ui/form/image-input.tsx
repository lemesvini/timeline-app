import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconPhoto, IconUpload, IconX, IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FieldError, type FieldErrorProps } from '@/components/ui/form';
import { uploadApi } from '@/lib/upload';

interface ImageInputProps {
  label?: string;
  error?: FieldErrorProps;
  value?: string;
  onChange?: (url: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  maxSize?: number;
  maxFiles?: number;
  isPublic?: boolean;
}

export const ImageInput = ({
  label,
  error,
  value,
  onChange,
  onBlur,
  disabled,
  className,
  maxSize = 1024 * 1024 * 5,
  maxFiles = 1,
  isPublic = false,
}: ImageInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length || !onChange) return;

      const file = acceptedFiles[0];

      const validation = uploadApi.validateImage(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);

        const uploadedUrl = await uploadApi.uploadFile({
          file,
          isPublic,
          onProgress: setUploadProgress,
        });

        onChange(uploadedUrl);
        toast.success('Imagem enviada com sucesso!');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Erro ao enviar imagem. Tente novamente.');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onChange, isPublic],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles,
    maxSize,
    disabled: disabled || isUploading,
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange && !isUploading) {
      onChange(null);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          {label}
        </label>
      )}
      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700/30 dark:hover:bg-gray-700/40',
          isDragActive && 'border-primary bg-primary/5',
          error && 'border-destructive',
          (disabled || isUploading) && 'cursor-not-allowed opacity-60',
        )}
      >
        <input {...getInputProps({ onBlur })} />

        {value ? (
          <div className='relative'>
            <img
              src={value}
              alt='Preview'
              className='h-32 w-32 rounded-full object-cover'
            />
            {!disabled && !isUploading && (
              <button
                type='button'
                onClick={clearImage}
                className='absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90'
              >
                <IconX className='size-4' />
              </button>
            )}
          </div>
        ) : (
          <div className='space-y-2'>
            <div className='flex flex-col items-center gap-2'>
              {isUploading ? (
                <>
                  <IconLoader2 className='size-8 animate-spin text-primary' />
                  <p className='text-sm text-gray-500'>
                    Enviando... {uploadProgress}%
                  </p>
                </>
              ) : isDragActive ? (
                <>
                  <IconUpload className='size-8 text-gray-500' />
                  <p className='text-sm text-gray-500'>
                    Arraste e solte a imagem aqui
                  </p>
                </>
              ) : (
                <>
                  <IconPhoto className='size-8 text-gray-500' />
                  <div className='text-sm text-gray-500'>
                    <span className='font-semibold text-primary'>
                      Clique para fazer upload
                    </span>{' '}
                    ou arraste e solte
                  </div>
                  <p className='text-xs text-gray-500'>
                    PNG, JPG, JPEG ou GIF (máx. {maxFiles})
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {error?.message && <FieldError message={error.message} />}
    </div>
  );
};
