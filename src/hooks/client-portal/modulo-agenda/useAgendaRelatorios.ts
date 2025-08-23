
import { useQuery } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface RelatorioParams {
  startDate?: string;
  endDate?: string;
  groupBy?: 'professional' | 'specialty' | 'insurance' | 'location' | 'day';
  professionalIds?: string[];
  specialtyIds?: string[];
  insuranceIds?: string[];
  locationIds?: string[];
}

interface RelatorioItem {
  label: string;
  totalAtendimentos: number;
  atendimentosRealizados: number;
  atendimentosCancelados: number;
  receita: number;
  tempoMedioAtendimento: number;
}

interface RelatorioData {
  items: RelatorioItem[];
  summary: {
    totalAtendimentos: number;
    atendimentosRealizados: number;
    atendimentosCancelados: number;
    receitaTotal: number;
    tempoMedioGeral: number;
  };
}

export const useAgendaRelatorios = (params: RelatorioParams) => {
  return useQuery({
    queryKey: ['agenda-relatorios', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else if (value) {
          searchParams.append(key, value.toString());
        }
      });

      return fetchWithClientAuth<RelatorioData>(`/api/client-portal/modulo-agenda/relatorios?${searchParams}`);
    },
    enabled: !!(params.startDate && params.endDate),
  });
};
