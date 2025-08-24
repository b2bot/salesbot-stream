
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useCreateUsuario, useUpdateUsuario } from '@/hooks/client-portal/modulo-agenda/useUsuarios';

interface UsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: any;
  onSuccess?: () => void;
}

interface UsuarioFormData {
  nome: string;
  email: string;
  senha?: string;
  nivel_acesso: 'admin' | 'medico' | 'recepcionista' | 'financeiro';
  status: 'ativo' | 'inativo';
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({
  open,
  onOpenChange,
  usuario,
  onSuccess
}) => {
  const isEditing = !!usuario;
  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UsuarioFormData>({
    defaultValues: usuario || {
      nome: '',
      email: '',
      senha: '',
      nivel_acesso: 'recepcionista',
      status: 'ativo'
    }
  });

  React.useEffect(() => {
    if (usuario) {
      reset({
        ...usuario,
        senha: '' // Don't show password
      });
    } else {
      reset({
        nome: '',
        email: '',
        senha: '',
        nivel_acesso: 'recepcionista',
        status: 'ativo'
      });
    }
  }, [usuario, reset]);

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      if (isEditing) {
        // Remove senha if empty during edit
        const updateData = { ...data };
        if (!updateData.senha) {
          delete updateData.senha;
        }
        await updateUsuario.mutateAsync({ id: usuario.id, ...updateData });
      } else {
        await createUsuario.mutateAsync(data);
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
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              {...register('nome', { required: 'Nome é obrigatório' })}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'E-mail é obrigatório' })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">
              {isEditing ? 'Nova Senha (deixe vazio para manter atual)' : 'Senha *'}
            </Label>
            <Input
              id="senha"
              type="password"
              {...register('senha', { 
                required: !isEditing ? 'Senha é obrigatória' : false 
              })}
            />
            {errors.senha && (
              <p className="text-sm text-red-500">{errors.senha.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivel_acesso">Nível de Acesso *</Label>
            <Select
              value={watch('nivel_acesso')}
              onValueChange={(value: any) => setValue('nivel_acesso', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="medico">Médico</SelectItem>
                <SelectItem value="recepcionista">Recepcionista</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
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
                : (isEditing ? 'Salvar' : 'Criar Usuário')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsuarioModal;
