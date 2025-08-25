// /src/hooks/client-portal/modulo-agenda/useClientes.ts

import { useQuery } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  endereco: string;
  convenio_id: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
  observacoes?: string;
}

interface UseClientesParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const API_URL = '/api/client-portal/modulo-agenda/clientes';

export const useClientes = (params: UseClientesParams = {}) => {
  return useQuery<{
    items: Cliente[];
    total: number;
  }>({
    queryKey: ['clientes', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      return fetchWithClientAuth(`${API_URL}?${searchParams.toString()}`);
    },
  });
};
