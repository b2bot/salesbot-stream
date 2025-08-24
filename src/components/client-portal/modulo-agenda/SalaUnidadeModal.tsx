
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreateSalaUnidade, useUpdateSalaUnidade } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';

interface SalaUnidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salaUnidade?: any;
  onSuccess?: () => void;
}

interface SalaUnidadeFormData {
  nome: string;
  tipo: 'consultorio' | 'sala_procedimento' | 'centro_cirurgico' | 'enfermaria' | 'recepcao';
  localizacao: string;
  capacidade?: number;
  equipamentos?: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  observacoes?: string;
}

const SalaUnidadeModal: React.FC<SalaUnidadeModalProps> = ({
  open,
  onOpenChange,
  salaUnidade,
  onSuccess
}) => {
  const isEditing = !!salaUnidade;
  const createSalaUnidade = useCreateSalaUnidade();
  const updateSalaUnidade = useUpdateSalaUnidade();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SalaUnidadeFormData>({
    defaultValues: salaUnidade || {
      nome: '',
      tipo: 'consultorio',
      localizacao: '',
      capacidade: 1,
      equipamentos: '',
      status: 'ativo',
      observacoes: ''
    }
  });

  React.useEffect(() => {
    if (salaUnidade) {
      reset(salaUnidade);
    } else {
      reset({
        nome: '',
        tipo: 'consultorio',
        localizacao: '',
        capacidade: 1,
        equipamentos: '',
        status: 'ativo',
        observacoes: ''
      });
    }
  }, [salaUnidade, reset]);

  const onSubmit = async (data: SalaUnidadeFormData) => {
    try {
      if (isEditing) {
        await updateSalaUnidade.mutateAsync({ id: salaUnidade.id, ...data });
      } else {
        await createSalaUnidade.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Sala/Unidade' : 'Nova Sala/Unidade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                {...register('nome', { required: 'Nome é obrigatório' })}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={watch('tipo')}
                onValueChange={(value: any) => setValue('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultorio">Consultório</SelectItem>
                  <SelectItem value="sala_procedimento">Sala de Procedimento</SelectItem>
                  <SelectItem value="centro_cirurgico">Centro Cirúrgico</SelectItem>
                  <SelectItem value="enfermaria">Enfermaria</SelectItem>
                  <SelectItem value="recepcao">Recepção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização *</Label>
              <Input
                id="localizacao"
                {...register('localizacao', { required: 'Localização é obrigatória' })}
                placeholder="Ex: 1º Andar - Ala A"
              />
              {errors.localizacao && (
                <p className="text-sm text-destructive">{errors.localizacao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                min="1"
                {...register('capacidade', { valueAsNumber: true })}
              />
              {errors.capacidade && (
                <p className="text-sm text-destructive">{errors.capacidade.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value: 'ativo' | 'inativo' | 'manutencao') => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="manutencao">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipamentos">Equipamentos</Label>
            <Textarea
              id="equipamentos"
              {...register('equipamentos')}
              placeholder="Descreva os equipamentos disponíveis"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Informações adicionais sobre a sala/unidade"
              rows={3}
            />
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
                : (isEditing ? 'Salvar' : 'Criar Sala/Unidade')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaUnidadeModal;
