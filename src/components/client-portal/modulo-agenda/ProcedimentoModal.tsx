
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { useCreateProcedimento, useUpdateProcedimento } from '@/hooks/client-portal/modulo-agenda/useProcedimentos';
import { usePacientes } from '@/hooks/client-portal/modulo-agenda/usePacientes';
import { useProfissionais } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useConvenios } from '@/hooks/client-portal/modulo-agenda/useConvenios';
import { useSalasUnidades } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';
import { X, Plus, User, Calendar, Clock, MapPin } from 'lucide-react';

interface ProcedimentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedimento?: any;
  onSuccess?: () => void;
}

interface ProcedimentoFormData {
  nome: string;
  tipo: 'cirurgia' | 'procedimento' | 'exame';
  paciente_id: string;
  profissional_principal_id: string;
  equipe_ids: string[];
  sala_id: string;
  convenio_id: string;
  data_inicio: string;
  data_fim: string;
  duracao_estimada: number;
  materiais: string[];
  status: 'agendado' | 'preparacao' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  valor_estimado?: number;
}

const ProcedimentoModal: React.FC<ProcedimentoModalProps> = ({
  open,
  onOpenChange,
  procedimento,
  onSuccess
}) => {
  const isEditing = !!procedimento;
  const [materialInput, setMaterialInput] = React.useState('');
  
  const { data: pacientesData } = usePacientes();
  const { data: profissionaisData } = useProfissionais();
  const { data: conveniosData } = useConvenios();
  const { data: salasData } = useSalasUnidades();
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
      tipo: 'procedimento',
      paciente_id: '',
      profissional_principal_id: '',
      equipe_ids: [],
      sala_id: '',
      convenio_id: '',
      data_inicio: '',
      data_fim: '',
      duracao_estimada: 60,
      materiais: [],
      status: 'agendado',
      observacoes: '',
      valor_estimado: 0
    }
  });

  React.useEffect(() => {
    if (procedimento) {
      reset(procedimento);
    } else {
      const now = new Date();
      const endTime = new Date(now.getTime() + 60 * 60000); // +1 hour
      
      reset({
        nome: '',
        tipo: 'procedimento',
        paciente_id: '',
        profissional_principal_id: '',
        equipe_ids: [],
        sala_id: '',
        convenio_id: '',
        data_inicio: now.toISOString().slice(0, 16),
        data_fim: endTime.toISOString().slice(0, 16),
        duracao_estimada: 60,
        materiais: [],
        status: 'agendado',
        observacoes: '',
        valor_estimado: 0
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

  const addMaterial = () => {
    if (materialInput.trim()) {
      const currentMaterials = watch('materiais') || [];
      setValue('materiais', [...currentMaterials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const removeMaterial = (index: number) => {
    const currentMaterials = watch('materiais') || [];
    setValue('materiais', currentMaterials.filter((_, i) => i !== index));
  };

  const addEquipeMember = (profissionalId: string) => {
    const currentEquipe = watch('equipe_ids') || [];
    if (!currentEquipe.includes(profissionalId)) {
      setValue('equipe_ids', [...currentEquipe, profissionalId]);
    }
  };

  const removeEquipeMember = (profissionalId: string) => {
    const currentEquipe = watch('equipe_ids') || [];
    setValue('equipe_ids', currentEquipe.filter(id => id !== profissionalId));
  };

  const availableProfissionais = profissionaisData?.items?.filter(prof => 
    prof.id !== watch('profissional_principal_id') && 
    !watch('equipe_ids')?.includes(prof.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? 'Editar Procedimento' : 'Novo Procedimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Procedimento *</Label>
              <Input
                id="nome"
                {...register('nome', { required: 'Nome é obrigatório' })}
                error={errors.nome?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={watch('tipo')}
                onValueChange={(value: 'cirurgia' | 'procedimento' | 'exame') => setValue('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="procedimento">Procedimento</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="profissional_principal_id" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profissional Principal *
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
            </div>
          </div>

          {/* Equipe Adicional */}
          <div className="space-y-2">
            <Label>Equipe Adicional</Label>
            <div className="flex gap-2">
              <Select onValueChange={addEquipeMember}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Adicionar membro da equipe" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfissionais?.map((profissional) => (
                    <SelectItem key={profissional.id} value={profissional.id}>
                      {profissional.nome} - {profissional.especialidade_nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {watch('equipe_ids')?.map((profId) => {
                const prof = profissionaisData?.items?.find(p => p.id === profId);
                return prof ? (
                  <Badge key={profId} variant="secondary" className="flex items-center gap-1">
                    {prof.nome}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeEquipeMember(profId)}
                    />
                  </Badge>
                ) : null;
              })}
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
            </div>
          </div>

          {/* Data, Hora e Duração */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Hora de Início *
              </Label>
              <Input
                id="data_inicio"
                type="datetime-local"
                {...register('data_inicio', { required: 'Data de início é obrigatória' })}
                error={errors.data_inicio?.message}
              />
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
                error={errors.data_fim?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao_estimada">Duração (minutos)</Label>
              <Input
                id="duracao_estimada"
                type="number"
                min="15"
                step="15"
                {...register('duracao_estimada', { valueAsNumber: true })}
                error={errors.duracao_estimada?.message}
              />
            </div>
          </div>

          {/* Materiais */}
          <div className="space-y-2">
            <Label>Materiais Necessários</Label>
            <div className="flex gap-2">
              <Input
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                placeholder="Digite o material e pressione Enter"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              />
              <Button type="button" onClick={addMaterial}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {watch('materiais')?.map((material, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {material}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeMaterial(index)}
                  />
                </Badge>
              ))}
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
                  <SelectItem value="preparacao">Preparação</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_estimado">Valor Estimado (R$)</Label>
              <Input
                id="valor_estimado"
                type="number"
                step="0.01"
                min="0"
                {...register('valor_estimado', { valueAsNumber: true })}
                error={errors.valor_estimado?.message}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações sobre o procedimento, preparativos, cuidados especiais, etc."
              rows={4}
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
                : (isEditing ? 'Salvar' : 'Agendar Procedimento')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcedimentoModal;
