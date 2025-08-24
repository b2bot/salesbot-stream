
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreateProcedimento, useUpdateProcedimento } from '@/hooks/client-portal/modulo-agenda/useProcedimentos';
import { usePacientes } from '@/hooks/client-portal/modulo-agenda/usePacientes';
import { useProfissionais } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useSalasUnidades } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';
import { useConvenios } from '@/hooks/client-portal/modulo-agenda/useConvenios';
import { Scissors, User, MapPin, Clock } from 'lucide-react';

interface ProcedimentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedimento?: any;
  onSuccess?: () => void;
}

interface ProcedimentoFormData {
  nome: string;
  tipo: 'cirurgia' | 'exame' | 'procedimento_ambulatorial' | 'procedimento_hospitalar';
  paciente_id: string;
  profissional_principal_id: string;
  profissionais_equipe: string[];
  sala_id: string;
  convenio_id: string;
  data_inicio: string;
  data_fim: string;
  status: 'agendado' | 'em_preparacao' | 'em_andamento' | 'concluido' | 'cancelado';
  materiais_necessarios?: string;
  observacoes?: string;
  valor_procedimento?: number;
}

const ProcedimentoModal: React.FC<ProcedimentoModalProps> = ({
  open,
  onOpenChange,
  procedimento,
  onSuccess
}) => {
  const isEditing = !!procedimento;
  const { data: pacientesData } = usePacientes();
  const { data: profissionaisData } = useProfissionais();
  const { data: salasData } = useSalasUnidades();
  const { data: conveniosData } = useConvenios();
  const createProcedimento = useCreateProcedimento();
  const updateProcedimento = useUpdateProcedimento();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProcedimentoFormData>({
    defaultValues: procedimento || {
      nome: '',
      tipo: 'procedimento_ambulatorial',
      paciente_id: '',
      profissional_principal_id: '',
      profissionais_equipe: [],
      sala_id: '',
      convenio_id: '',
      data_inicio: '',
      data_fim: '',
      status: 'agendado',
      materiais_necessarios: '',
      observacoes: '',
      valor_procedimento: 0
    }
  });

  React.useEffect(() => {
    if (procedimento) {
      reset(procedimento);
    } else {
      reset({
        nome: '',
        tipo: 'procedimento_ambulatorial',
        paciente_id: '',
        profissional_principal_id: '',
        profissionais_equipe: [],
        sala_id: '',
        convenio_id: '',
        data_inicio: '',
        data_fim: '',
        status: 'agendado',
        materiais_necessarios: '',
        observacoes: '',
        valor_procedimento: 0
      });
    }
  }, [procedimento, reset]);

  const onSubmit = async (data: ProcedimentoFormData) => {
    try {
      if (isEditing) {
        await updateProcedimento.mutateAsync({ id: procedimento.id, ...data });
      } else {
        await createProcedimento.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            {isEditing ? 'Editar Procedimento' : 'Novo Procedimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Procedimento *</Label>
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
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="procedimento_ambulatorial">Procedimento Ambulatorial</SelectItem>
                  <SelectItem value="procedimento_hospitalar">Procedimento Hospitalar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Paciente e Profissional Principal */}
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
              <Label htmlFor="profissional_principal_id" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profissional Responsável *
              </Label>
              <Select
                value={watch('profissional_principal_id')}
                onValueChange={(value) => setValue('profissional_principal_id', value)}
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
              {errors.profissional_principal_id && (
                <p className="text-sm text-destructive">Profissional é obrigatório</p>
              )}
            </div>
          </div>

          {/* Sala e Convênio */}
          <div className="grid grid-cols-2 gap-4">
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
                  {salasData?.items?.filter(sala => 
                    sala.tipo === 'centro_cirurgico' || sala.tipo === 'sala_procedimento'
                  ).map((sala) => (
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

          {/* Status e Valor */}
          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="em_preparacao">Em Preparação</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_procedimento">Valor do Procedimento (R$)</Label>
              <Input
                id="valor_procedimento"
                type="number"
                step="0.01"
                min="0"
                {...register('valor_procedimento', { valueAsNumber: true })}
              />
              {errors.valor_procedimento && (
                <p className="text-sm text-destructive">{errors.valor_procedimento.message}</p>
              )}
            </div>
          </div>

          {/* Materiais Necessários */}
          <div className="space-y-2">
            <Label htmlFor="materiais_necessarios">Materiais e Equipamentos Necessários</Label>
            <Textarea
              id="materiais_necessarios"
              {...register('materiais_necessarios')}
              placeholder="Liste os materiais, equipamentos e insumos necessários"
              rows={3}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações sobre o procedimento"
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
                : (isEditing ? 'Salvar' : 'Criar Procedimento')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcedimentoModal;
