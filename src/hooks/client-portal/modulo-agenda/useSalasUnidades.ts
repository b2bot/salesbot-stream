
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface SalaUnidade {
  id: string;
  nome: string;
  tipo: 'consultorio' | 'sala_procedimento' | 'centro_cirurgico' | 'enfermaria' | 'recepcao' | 'sala_exames' | 'sala_compartilhada';
  localizacao?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  capacidade?: number;
  equipamentos?: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

interface UseSalasUnidadesParams {
  search?: string;
  tipo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useSalasUnidades = (params: UseSalasUnidadesParams = {}) => {
  return useQuery({
    queryKey: ['salas-unidades', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.tipo) searchParams.append('tipo', params.tipo);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      return fetchWithClientAuth<{
        items: SalaUnidade[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>(`/api/client-portal/modulo-agenda/salas-unidades?${searchParams}`);
    },
  });
};

export const useCreateSalaUnidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<SalaUnidade, 'id' | 'created_at' | 'updated_at'>) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/salas-unidades`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas-unidades'] });
      toast({
        title: "Sala/Unidade criada",
        description: "Sala/Unidade cadastrada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar sala/unidade",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSalaUnidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<SalaUnidade> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/salas-unidades/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas-unidades'] });
      toast({
        title: "Sala/Unidade atualizada",
        description: "Dados da sala/unidade atualizados com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar sala/unidade",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSalaUnidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/salas-unidades/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas-unidades'] });
      toast({
        title: "Sala/Unidade removida",
        description: "Sala/Unidade removida com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover sala/unidade",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
