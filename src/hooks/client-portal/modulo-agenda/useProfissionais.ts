
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  crm: string;
  especialidade_id: string;
  especialidade_nome?: string;
  status: 'ativo' | 'inativo';
  cor_agenda: string;
  created_at: string;
  updated_at: string;
}

interface UseProfissionaisParams {
  search?: string;
  especialidade_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useProfissionais = (params: UseProfissionaisParams = {}) => {
  return useQuery({
    queryKey: ['profissionais', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.especialidade_id) searchParams.append('especialidade_id', params.especialidade_id);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      return fetchWithClientAuth<{
        items: Profissional[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>(`/api/client-portal/modulo-agenda/profissionais?${searchParams}`);
    },
  });
};

export const useCreateProfissional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Profissional, 'id' | 'created_at' | 'updated_at'>) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/profissionais`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      toast({
        title: "Profissional criado",
        description: "Profissional cadastrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar profissional",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProfissional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Profissional> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/profissionais/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      toast({
        title: "Profissional atualizado",
        description: "Dados do profissional atualizados com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar profissional",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProfissional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/profissionais/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
      toast({
        title: "Profissional removido",
        description: "Profissional removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover profissional",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
