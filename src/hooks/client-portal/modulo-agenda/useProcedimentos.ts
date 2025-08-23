
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface Procedimento {
  id: string;
  nome: string;
  tipo: 'cirurgia' | 'procedimento' | 'exame';
  paciente_id: string;
  paciente_nome: string;
  profissional_principal_id: string;
  profissional_principal_nome: string;
  equipe_ids: string[];
  equipe_nomes: string[];
  sala_id: string;
  sala_nome: string;
  convenio_id: string;
  convenio_nome: string;
  data_inicio: string;
  data_fim: string;
  duracao_estimada: number; // em minutos
  materiais: string[];
  status: 'agendado' | 'preparacao' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  valor_estimado?: number;
  created_at: string;
  updated_at: string;
}

interface UseProcedimentosParams {
  data_inicio?: string;
  data_fim?: string;
  paciente_id?: string;
  profissional_id?: string;
  sala_id?: string;
  tipo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useProcedimentos = (params: UseProcedimentosParams = {}) => {
  return useQuery({
    queryKey: ['procedimentos', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      return fetchWithClientAuth<{
        items: Procedimento[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>(`/api/client-portal/modulo-agenda/procedimentos?${searchParams}`);
    },
  });
};

export const useCreateProcedimento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Procedimento, 'id' | 'created_at' | 'updated_at' | 'paciente_nome' | 'profissional_principal_nome' | 'equipe_nomes' | 'sala_nome' | 'convenio_nome'>) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/procedimentos`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedimentos'] });
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Procedimento agendado",
        description: "Procedimento agendado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao agendar procedimento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProcedimento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Procedimento> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/procedimentos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedimentos'] });
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Procedimento atualizado",
        description: "Procedimento atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar procedimento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProcedimento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/procedimentos/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedimentos'] });
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Procedimento cancelado",
        description: "Procedimento cancelado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cancelar procedimento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
