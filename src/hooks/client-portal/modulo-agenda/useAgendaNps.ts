
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface NpsRecord {
  id: string;
  patientName: string;
  professionalName: string;
  score: number;
  comment?: string;
  createdAt: string;
  appointmentId: string;
}

interface NpsStats {
  totalResponses: number;
  averageScore: number;
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
}

interface NpsData {
  records: NpsRecord[];
  stats: NpsStats;
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface UseAgendaNpsParams {
  startDate?: string;
  endDate?: string;
  professionalId?: string;
  page?: number;
  limit?: number;
}

export const useAgendaNps = (params: UseAgendaNpsParams = {}) => {
  return useQuery({
    queryKey: ['agenda-nps', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.professionalId) searchParams.append('professionalId', params.professionalId);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      return fetchWithClientAuth<NpsData>(`/api/client-portal/modulo-agenda/nps?${searchParams}`);
    },
  });
};

export const useCreateNps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      appointmentId: string;
      score: number;
      comment?: string;
    }) => {
      return fetchWithClientAuth('/api/client-portal/modulo-agenda/nps', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-nps'] });
      toast({
        title: "Sucesso",
        description: "Avaliação NPS registrada com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
