import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { type ExportFormat, type SelectableField } from '@/types/export';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  fields: SelectableField[];
  onExport: (selectedFields: string[], format: ExportFormat) => Promise<void>;
  isLoading?: boolean;
}

export function ExportDialog({
  isOpen,
  onClose,
  title,
  description,
  fields,
  onExport,
  isLoading = false,
}: ExportDialogProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [format, setFormat] = useState<ExportFormat>('pdf');

  const handleExport = async () => {
    const exportFields = selectedFields || [];
    await onExport(exportFields, format);
  };

  const toggleField = (field: string) => {
    setSelectedFields((current) =>
      current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field],
    );
  };

  const selectAll = () => {
    setSelectedFields(fields.map((field) => field.field));
  };

  const unselectAll = () => {
    setSelectedFields([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] rounded-2xl border border-border overflow-hidden'>
        <DialogHeader className='text-gray-2'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label className='text-gray-2'>Formato</Label>
            <RadioGroup
              defaultValue={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className='flex items-center space-x-4 text-gray-2'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='pdf' id='pdf' />
                <Label htmlFor='pdf'>PDF</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='csv' id='csv' />
                <Label htmlFor='csv'>CSV</Label>
              </div>
            </RadioGroup>
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center justify-between'>
              <Label className='text-gray-2'>Campos</Label>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  type='button'
                  onClick={selectAll}
                >
                  Selecionar todos
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  type='button'
                  onClick={unselectAll}
                >
                  Limpar
                </Button>
              </div>
            </div>
            <ScrollArea className='h-[200px] rounded-md border p-4'>
              <div className='grid gap-2'>
                {fields.map((field) => (
                  <div
                    key={field.field}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={field.field}
                      checked={selectedFields.includes(field.field)}
                      onCheckedChange={() => toggleField(field.field)}
                    />
                    <Label htmlFor={field.field} className='text-gray-2'>
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
