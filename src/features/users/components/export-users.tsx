import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExportDialog } from '@/components/ui/export/export-dialog';
import { useGetUserExportFields, exportUsers } from '../api/export-users';
import { type ExportFormat } from '@/types/export';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { IconDatabase } from '@tabler/icons-react';

export function ExportUsers() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const filters = searchParams.get('filters')
    ? JSON.parse(searchParams.get('filters')!)
    : undefined;

  const { data: fields, isError } = useGetUserExportFields({});

  const handleExport = async (
    selectedFields: string[],
    format: ExportFormat,
  ) => {
    try {
      setIsExporting(true);
      const response = await exportUsers({
        selectedFields,
        format,
        search,
        filters,
      });

      window.open(response.data.fileUrl, '_blank');
      setIsOpen(false);
      toast.success('Arquivo de exportação gerado com sucesso');
    } catch {
      toast.error('Não foi possível gerar o arquivo de exportação');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(true)}
        icon={<IconDatabase className='mr-1 h-3 w-3 text-gray-2' />}
      >
        Exportar
      </Button>

      {fields && (
        <ExportDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title='Exportar Usuários'
          description='Selecione os campos que deseja exportar e o formato do arquivo. Se nenhum campo for selecionado, todos os campos serão exportados.'
          fields={isError ? [] : fields.data}
          onExport={handleExport}
          isLoading={isExporting}
        />
      )}
    </>
  );
}
