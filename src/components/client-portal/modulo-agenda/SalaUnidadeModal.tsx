
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
  tipo: 'consultorio' | 'centro_cirurgico' | 'sala_exames' | 'sala_compartilhada';
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  capacidade?: number;
  o_que_e_feito: string;
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
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      capacidade: 1,
      o_que_e_feito: '',
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
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        capacidade: 1,
        o_que_e_feito: '',
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                <p className="text-sm text-red-500">{errors.nome.message}</p>
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
                  <SelectItem value="centro_cirurgico">Centro Cirúrgico</SelectItem>
                  <SelectItem value="sala_exames">Sala de Exames</SelectItem>
                  <SelectItem value="sala_compartilhada">Sala Compartilhada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Endereço Completo */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Endereço Completo</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="logradouro">Logradouro *</Label>
                <Input
                  id="logradouro"
                  {...register('logradouro', { required: 'Logradouro é obrigatório' })}
                  placeholder="Rua, Avenida, etc."
                />
                {errors.logradouro && (
                  <p className="text-sm text-red-500">{errors.logradouro.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  {...register('numero', { required: 'Número é obrigatório' })}
                />
                {errors.numero && (
                  <p className="text-sm text-red-500">{errors.numero.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  {...register('complemento')}
                  placeholder="Apartamento, bloco, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  {...register('bairro', { required: 'Bairro é obrigatório' })}
                />
                {errors.bairro && (
                  <p className="text-sm text-red-500">{errors.bairro.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  {...register('cidade', { required: 'Cidade é obrigatória' })}
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500">{errors.cidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  {...register('estado', { required: 'Estado é obrigatório' })}
                  placeholder="UF"
                />
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  {...register('cep', { required: 'CEP é obrigatório' })}
                />
                {errors.cep && (
                  <p className="text-sm text-red-500">{errors.cep.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                min="1"
                {...register('capacidade', { valueAsNumber: true })}
              />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="o_que_e_feito">O que é feito no local *</Label>
            <Input
              id="o_que_e_feito"
              {...register('o_que_e_feito', { required: 'Este campo é obrigatório' })}
              placeholder="Ex: Consultas, Procedimentos, Cirurgias"
            />
            {errors.o_que_e_feito && (
              <p className="text-sm text-red-500">{errors.o_que_e_feito.message}</p>
            )}
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
