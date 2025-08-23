
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface Convenio {
  id: string;
  nome: string;
  tipo: 'particular' | 'plano_saude' | 'convenio';
  status: 'ativo' | 'inativo';
  contato_nome?: string;
  contato_telefone?: string;
  contato_email?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

interface UseConveniosParams {
  search?: string;
  tipo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useConvenios = (params: UseConveniosParams = {}) => {
  return useQuery({
    queryKey: ['convenios', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.tipo) searchParams.append('tipo', params.tipo);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      return fetchWithClientAuth<{
        items: Convenio[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>(`/api/client-portal/modulo-agenda/convenios?${searchParams}`);
    },
  });
};

export const useCreateConvenio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Convenio, 'id' | 'created_at' | 'updated_at'>) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/convenios`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios'] });
      toast({
        title: "Convênio criado",
        description: "Convênio cadastrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar convênio",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateConvenio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Convenio> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/convenios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios'] });
      toast({
        title: "Convênio atualizado",
        description: "Dados do convênio atualizados com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar convênio",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteConvenio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/convenios/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convenios'] });
      toast({
        title: "Convênio removido",
        description: "Convênio removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover convênio",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
