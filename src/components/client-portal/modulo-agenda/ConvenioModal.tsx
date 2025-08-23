
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreateConvenio, useUpdateConvenio } from '@/hooks/client-portal/modulo-agenda/useConvenios';

interface ConvenioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  convenio?: any;
  onSuccess?: () => void;
}

interface ConvenioFormData {
  nome: string;
  tipo: 'particular' | 'plano_saude' | 'convenio';
  status: 'ativo' | 'inativo';
  contato_nome?: string;
  contato_telefone?: string;
  contato_email?: string;
  observacoes?: string;
}

const ConvenioModal: React.FC<ConvenioModalProps> = ({
  open,
  onOpenChange,
  convenio,
  onSuccess
}) => {
  const isEditing = !!convenio;
  const createConvenio = useCreateConvenio();
  const updateConvenio = useUpdateConvenio();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ConvenioFormData>({
    defaultValues: convenio || {
      nome: '',
      tipo: 'plano_saude',
      status: 'ativo',
      contato_nome: '',
      contato_telefone: '',
      contato_email: '',
      observacoes: ''
    }
  });

  React.useEffect(() => {
    if (convenio) {
      reset(convenio);
    } else {
      reset({
        nome: '',
        tipo: 'plano_saude',
        status: 'ativo',
        contato_nome: '',
        contato_telefone: '',
        contato_email: '',
        observacoes: ''
      });
    }
  }, [convenio, reset]);

  const onSubmit = async (data: ConvenioFormData) => {
    try {
      if (isEditing) {
        await updateConvenio.mutateAsync({ id: convenio.id, ...data });
      } else {
        await createConvenio.mutateAsync(data);
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
            {isEditing ? 'Editar Convênio' : 'Novo Convênio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Convênio *</Label>
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
                onValueChange={(value: 'particular' | 'plano_saude' | 'convenio') => setValue('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="plano_saude">Plano de Saúde</SelectItem>
                  <SelectItem value="convenio">Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          {/* Dados de Contato */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Informações de Contato</h4>
            
            <div className="space-y-2">
              <Label htmlFor="contato_nome">Nome do Contato</Label>
              <Input
                id="contato_nome"
                {...register('contato_nome')}
                error={errors.contato_nome?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contato_telefone">Telefone</Label>
                <Input
                  id="contato_telefone"
                  {...register('contato_telefone')}
                  error={errors.contato_telefone?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contato_email">E-mail</Label>
                <Input
                  id="contato_email"
                  type="email"
                  {...register('contato_email')}
                  error={errors.contato_email?.message}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Informações adicionais sobre o convênio"
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
                : (isEditing ? 'Salvar' : 'Criar Convênio')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConvenioModal;
