
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreatePaciente, useUpdatePaciente } from '@/hooks/client-portal/modulo-agenda/usePacientes';
import { useConvenios } from '@/hooks/client-portal/modulo-agenda/useConvenios';

interface PacienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente?: any;
  onSuccess?: () => void;
}

interface PacienteFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  endereco: string;
  convenio_id: string;
  status: 'ativo' | 'inativo';
}

const PacienteModal: React.FC<PacienteModalProps> = ({
  open,
  onOpenChange,
  paciente,
  onSuccess
}) => {
  const isEditing = !!paciente;
  const { data: conveniosData } = useConvenios();
  const createPaciente = useCreatePaciente();
  const updatePaciente = useUpdatePaciente();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PacienteFormData>({
    defaultValues: paciente || {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      data_nascimento: '',
      endereco: '',
      convenio_id: '',
      status: 'ativo'
    }
  });

  React.useEffect(() => {
    if (paciente) {
      reset(paciente);
    } else {
      reset({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        data_nascimento: '',
        endereco: '',
        convenio_id: '',
        status: 'ativo'
      });
    }
  }, [paciente, reset]);

  const onSubmit = async (data: PacienteFormData) => {
    try {
      if (isEditing) {
        await updatePaciente.mutateAsync({ id: paciente.id, ...data });
      } else {
        await createPaciente.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                {...register('nome', { required: 'Nome é obrigatório' })}
                error={errors.nome?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register('cpf', { required: 'CPF é obrigatório' })}
                error={errors.cpf?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                {...register('telefone', { required: 'Telefone é obrigatório' })}
                error={errors.telefone?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                {...register('data_nascimento')}
                error={errors.data_nascimento?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="convenio_id">Convênio *</Label>
              <Select
                value={watch('convenio_id')}
                onValueChange={(value) => setValue('convenio_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o convênio" />
                </SelectTrigger>
                <SelectContent>
                  {conveniosData?.items?.map((convenio) => (
                    <SelectItem key={convenio.id} value={convenio.id}>
                      {convenio.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.convenio_id && (
                <p className="text-sm text-destructive">{errors.convenio_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              {...register('endereco')}
              placeholder="Endereço completo"
              rows={3}
            />
          </div>

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
                : (isEditing ? 'Salvar' : 'Criar Paciente')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PacienteModal;
