
import { useQuery } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface FinanceiroParams {
  startDate?: string;
  endDate?: string;
  type?: 'receivable' | 'payable' | 'projection';
}

interface ContaItem {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'receivable' | 'payable';
  professionalName?: string;
  patientName?: string;
  appointmentId?: string;
}

interface RateioItem {
  professional: string;
  specialty: string;
  grossRevenue: number;
  fees: number;
  netRevenue: number;
  percentage: number;
}

interface ProjecaoItem {
  date: string;
  consultations: number;
  procedures: number;
  estimatedRevenue: number;
  confirmedRevenue: number;
}

interface FinanceiroData {
  contas: ContaItem[];
  rateios: RateioItem[];
  projecoes: ProjecaoItem[];
  summary: {
    totalReceivable: number;
    totalPayable: number;
    netBalance: number;
    projectedRevenue: number;
  };
}

export const useAgendaFinanceiro = (params: FinanceiroParams = {}) => {
  return useQuery({
    queryKey: ['agenda-financeiro', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.type) searchParams.append('type', params.type);

      return fetchWithClientAuth<FinanceiroData>(`/api/client-portal/modulo-agenda/financeiro?${searchParams}`);
    },
  });
};
