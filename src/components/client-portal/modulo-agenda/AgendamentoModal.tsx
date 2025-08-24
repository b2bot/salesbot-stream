
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreateAgendamento, useUpdateAgendamento } from '@/hooks/client-portal/modulo-agenda/useAgendamentos';
import { usePacientes } from '@/hooks/client-portal/modulo-agenda/usePacientes';
import { useProfissionais } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useConvenios } from '@/hooks/client-portal/modulo-agenda/useConvenios';
import { useSalasUnidades } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';
import { CalendarDays, Clock, User, MapPin } from 'lucide-react';

interface AgendamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamento?: any;
  initialDate?: string;
  initialTime?: string;
  onSuccess?: () => void;
}

interface AgendamentoFormData {
  paciente_id: string;
  profissional_id: string;
  convenio_id: string;
  sala_id: string;
  data_inicio: string;
  data_fim: string;
  tipo: 'consulta' | 'procedimento' | 'cirurgia';
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'ausente';
  observacoes?: string;
  valor?: number;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({
  open,
  onOpenChange,
  agendamento,
  initialDate,
  initialTime,
  onSuccess
}) => {
  const isEditing = !!agendamento;
  const { data: pacientesData } = usePacientes();
  const { data: profissionaisData } = useProfissionais();
  const { data: conveniosData } = useConvenios();
  const { data: salasData } = useSalasUnidades();
  const createAgendamento = useCreateAgendamento();
  const updateAgendamento = useUpdateAgendamento();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AgendamentoFormData>({
    defaultValues: agendamento || {
      paciente_id: '',
      profissional_id: '',
      convenio_id: '',
      sala_id: '',
      data_inicio: initialDate && initialTime ? `${initialDate}T${initialTime}` : '',
      data_fim: '',
      tipo: 'consulta',
      status: 'agendado',
      observacoes: '',
      valor: 0
    }
  });

  React.useEffect(() => {
    if (agendamento) {
      reset(agendamento);
    } else {
      const now = new Date();
      const defaultStart = initialDate && initialTime 
        ? `${initialDate}T${initialTime}` 
        : now.toISOString().slice(0, 16);
      
      const endTime = new Date(now.getTime() + 30 * 60000); // +30 minutes
      const defaultEnd = initialDate && initialTime 
        ? `${initialDate}T${String(parseInt(initialTime.split(':')[0]) + 1).padStart(2, '0')}:${initialTime.split(':')[1]}` 
        : endTime.toISOString().slice(0, 16);

      reset({
        paciente_id: '',
        profissional_id: '',
        convenio_id: '',
        sala_id: '',
        data_inicio: defaultStart,
        data_fim: defaultEnd,
        tipo: 'consulta',
        status: 'agendado',
        observacoes: '',
        valor: 0
      });
    }
  }, [agendamento, initialDate, initialTime, reset]);

  const onSubmit = async (data: AgendamentoFormData) => {
    try {
      if (isEditing) {
        await updateAgendamento.mutateAsync({ id: agendamento.id, ...data });
      } else {
        await createAgendamento.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Paciente e Profissional */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paciente_id" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Paciente *
              </Label>
              <Select
                value={watch('paciente_id')}
                onValueChange={(value) => setValue('paciente_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientesData?.items?.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paciente_id && (
                <p className="text-sm text-destructive">Paciente é obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profissional_id" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profissional *
              </Label>
              <Select
                value={watch('profissional_id')}
                onValueChange={(value) => setValue('profissional_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {profissionaisData?.items?.map((profissional) => (
                    <SelectItem key={profissional.id} value={profissional.id}>
                      {profissional.nome} - {profissional.especialidade_nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.profissional_id && (
                <p className="text-sm text-destructive">Profissional é obrigatório</p>
              )}
            </div>
          </div>

          {/* Convênio e Sala */}
          <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm text-destructive">Convênio é obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sala_id" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Sala/Local *
              </Label>
              <Select
                value={watch('sala_id')}
                onValueChange={(value) => setValue('sala_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a sala" />
                </SelectTrigger>
                <SelectContent>
                  {salasData?.items?.map((sala) => (
                    <SelectItem key={sala.id} value={sala.id}>
                      {sala.nome} - {sala.localizacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sala_id && (
                <p className="text-sm text-destructive">Sala é obrigatória</p>
              )}
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Hora de Início *
              </Label>
              <Input
                id="data_inicio"
                type="datetime-local"
                {...register('data_inicio', { required: 'Data de início é obrigatória' })}
              />
              {errors.data_inicio && (
                <p className="text-sm text-destructive">{errors.data_inicio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Hora de Fim *
              </Label>
              <Input
                id="data_fim"
                type="datetime-local"
                {...register('data_fim', { required: 'Data de fim é obrigatória' })}
              />
              {errors.data_fim && (
                <p className="text-sm text-destructive">{errors.data_fim.message}</p>
              )}
            </div>
          </div>

          {/* Tipo e Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={watch('tipo')}
                onValueChange={(value: 'consulta' | 'procedimento' | 'cirurgia') => setValue('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="procedimento">Procedimento</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: any) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="ausente">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                {...register('valor', { valueAsNumber: true })}
              />
              {errors.valor && (
                <p className="text-sm text-destructive">{errors.valor.message}</p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações sobre o agendamento"
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
                ? (isEditing ? 'Salvando...' : 'Agendando...') 
                : (isEditing ? 'Salvar' : 'Agendar')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoModal;
