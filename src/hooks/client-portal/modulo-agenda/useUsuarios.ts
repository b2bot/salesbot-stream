
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: 'admin' | 'medico' | 'recepcionista' | 'financeiro';
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => fetchWithClientAuth<{ items: Usuario[]; total: number }>('/api/client-portal/modulo-agenda/usuarios'),
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Usuario, 'id' | 'created_at' | 'updated_at'> & { senha: string }) =>
      fetchWithClientAuth('/api/client-portal/modulo-agenda/usuarios', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Usuario> & { id: string; senha?: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};
