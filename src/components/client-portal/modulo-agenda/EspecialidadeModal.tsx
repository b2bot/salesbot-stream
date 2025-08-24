
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreateEspecialidade, useUpdateEspecialidade } from '@/hooks/client-portal/modulo-agenda/useEspecialidades';

interface EspecialidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  especialidade?: any;
  onSuccess?: () => void;
}

interface EspecialidadeFormData {
  nome: string;
  descricao?: string;
  status: 'ativa' | 'inativa';
}

const EspecialidadeModal: React.FC<EspecialidadeModalProps> = ({
  open,
  onOpenChange,
  especialidade,
  onSuccess
}) => {
  const isEditing = !!especialidade;
  const createEspecialidade = useCreateEspecialidade();
  const updateEspecialidade = useUpdateEspecialidade();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EspecialidadeFormData>({
    defaultValues: especialidade || {
      nome: '',
      descricao: '',
      status: 'ativa'
    }
  });

  React.useEffect(() => {
    if (especialidade) {
      reset(especialidade);
    } else {
      reset({
        nome: '',
        descricao: '',
        status: 'ativa'
      });
    }
  }, [especialidade, reset]);

  const onSubmit = async (data: EspecialidadeFormData) => {
    try {
      if (isEditing) {
        await updateEspecialidade.mutateAsync({ id: especialidade.id, ...data });
      } else {
        await createEspecialidade.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Especialidade' : 'Nova Especialidade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Especialidade *</Label>
            <Input
              id="nome"
              {...register('nome', { required: 'Nome é obrigatório' })}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descrição da especialidade"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value: 'ativa' | 'inativa') => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="inativa">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditing ? 'Salvando...' : 'Criando...') 
                : (isEditing ? 'Salvar' : 'Criar Especialidade')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EspecialidadeModal;
