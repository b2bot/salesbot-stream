
import { useQuery } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

interface Specialty {
  id: string;
  name: string;
  color: string;
}

interface Insurance {
  id: string;
  name: string;
  color: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
}

interface AgendaFilters {
  professionals: Professional[];
  specialties: Specialty[];
  insurances: Insurance[];
  locations: Location[];
}

export const useAgendaFilters = () => {
  return useQuery({
    queryKey: ['agenda-filters'],
    queryFn: () => fetchWithClientAuth<AgendaFilters>('/api/client-portal/modulo-agenda/filters'),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
