
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface Agendamento {
  id: string;
  paciente_id: string;
  paciente_nome: string;
  profissional_id: string;
  profissional_nome: string;
  convenio_id: string;
  convenio_nome: string;
  sala_id: string;
  sala_nome: string;
  data_inicio: string;
  data_fim: string;
  tipo: 'consulta' | 'procedimento' | 'cirurgia' | 'retorno';
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'ausente';
  observacoes?: string;
  valor?: number;
  created_at: string;
  updated_at: string;
}

interface UseAgendamentosParams {
  data_inicio?: string;
  data_fim?: string;
  paciente_id?: string;
  profissional_id?: string;
  convenio_id?: string;
  sala_id?: string;
  status?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}

export const useAgendamentos = (params: UseAgendamentosParams = {}) => {
  return useQuery({
    queryKey: ['agendamentos', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      return fetchWithClientAuth<{
        items: Agendamento[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>(`/api/client-portal/modulo-agenda/agendamentos?${searchParams}`);
    },
  });
};

export const useCreateAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Agendamento, 'id' | 'created_at' | 'updated_at' | 'paciente_nome' | 'profissional_nome' | 'convenio_nome' | 'sala_nome'>) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/agendamentos`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Agendamento criado",
        description: "Agendamento criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Agendamento> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/agendamentos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Agendamento atualizado",
        description: "Agendamento atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/agendamentos/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Agendamento cancelado",
        description: "Agendamento cancelado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cancelar agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
