
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useCreateProfissional, useUpdateProfissional } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useAgendaFilters } from '@/hooks/client-portal/modulo-agenda/useAgendaFilters';

interface ProfissionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional?: any;
  onSuccess?: () => void;
}

interface ProfissionalFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  crm: string;
  especialidade_id: string;
  status: 'ativo' | 'inativo';
  cor_agenda: string;
}

const ProfissionalModal: React.FC<ProfissionalModalProps> = ({
  open,
  onOpenChange,
  profissional,
  onSuccess
}) => {
  const isEditing = !!profissional;
  const { data: filtersData } = useAgendaFilters();
  const createProfissional = useCreateProfissional();
  const updateProfissional = useUpdateProfissional();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfissionalFormData>({
    defaultValues: profissional || {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      crm: '',
      especialidade_id: '',
      status: 'ativo',
      cor_agenda: '#3B82F6'
    }
  });

  React.useEffect(() => {
    if (profissional) {
      reset(profissional);
    } else {
      reset({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        crm: '',
        especialidade_id: '',
        status: 'ativo',
        cor_agenda: '#3B82F6'
      });
    }
  }, [profissional, reset]);

  const onSubmit = async (data: ProfissionalFormData) => {
    try {
      if (isEditing) {
        await updateProfissional.mutateAsync({ id: profissional.id, ...data });
      } else {
        await createProfissional.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const cores = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Profissional' : 'Novo Profissional'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                {...register('nome', { required: 'Nome é obrigatório' })}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="crm">CRM *</Label>
              <Input
                id="crm"
                {...register('crm', { required: 'CRM é obrigatório' })}
              />
              {errors.crm && (
                <p className="text-sm text-destructive">{errors.crm.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register('telefone')}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...register('cpf')}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade_id">Especialidade *</Label>
              <Select
                value={watch('especialidade_id')}
                onValueChange={(value) => setValue('especialidade_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {filtersData?.specialties?.map((especialidade) => (
                    <SelectItem key={especialidade.id} value={especialidade.id}>
                      {especialidade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.especialidade_id && (
                <p className="text-sm text-destructive">Especialidade é obrigatória</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: 'ativo' | 'inativo') => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cor_agenda">Cor da Agenda</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={watch('cor_agenda')}
                  onChange={(e) => setValue('cor_agenda', e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
                <Input
                  value={watch('cor_agenda')}
                  onChange={(e) => setValue('cor_agenda', e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {cores.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    className="w-6 h-6 rounded border-2 border-muted hover:border-foreground"
                    style={{ backgroundColor: cor }}
                    onClick={() => setValue('cor_agenda', cor)}
                  />
                ))}
              </div>
            </div>
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
                : (isEditing ? 'Salvar' : 'Criar Profissional')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfissionalModal;
