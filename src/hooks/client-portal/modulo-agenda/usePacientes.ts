
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  endereco: string;
  convenio_id: string;
  convenio_nome?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

interface UsePacientesParams {
  search?: string;
  convenio_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const usePacientes = (params: UsePacientesParams = {}) => {
  return useQuery({
    queryKey: ['pacientes', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.convenio_id) searchParams.append('convenio_id', params.convenio_id);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      return fetchWithClientAuth<{
        items: Paciente[];
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      }>(`/api/client-portal/modulo-agenda/pacientes?${searchParams}`);
    },
  });
};

export const useCreatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/pacientes`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast({
        title: "Paciente criado",
        description: "Paciente cadastrado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar paciente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Paciente> & { id: string }) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/pacientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast({
        title: "Paciente atualizado",
        description: "Dados do paciente atualizados com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar paciente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/pacientes/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast({
        title: "Paciente removido",
        description: "Paciente removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover paciente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
