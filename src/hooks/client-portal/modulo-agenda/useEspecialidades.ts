
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface Especialidade {
  id: string;
  nome: string;
  descricao?: string;
  status: 'ativa' | 'inativa';
  created_at: string;
  updated_at: string;
}

export const useEspecialidades = () => {
  return useQuery({
    queryKey: ['especialidades'],
    queryFn: () => fetchWithClientAuth<{ items: Especialidade[]; total: number }>('/api/client-portal/modulo-agenda/especialidades'),
  });
};

export const useCreateEspecialidade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Especialidade, 'id' | 'created_at' | 'updated_at'>) =>
      fetchWithClientAuth('/api/client-portal/modulo-agenda/especialidades', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
    },
  });
};

export const useUpdateEspecialidade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Especialidade> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/especialidades/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especialidades'] });
    },
  });
};
