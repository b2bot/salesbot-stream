
import { useQuery } from '@tanstack/react-query';
import { fetchWithClientAuth } from '../fetchWithClientAuth';

interface AgendaEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  patientName: string;
  professionalName: string;
  specialty: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'procedure' | 'surgery';
  location: string;
  insurance: string;
  backgroundColor?: string;
  borderColor?: string;
}

interface UseAgendaEventsParams {
  startDate?: string;
  endDate?: string;
  professionalIds?: string[];
  specialtyIds?: string[];
  insuranceIds?: string[];
  locationIds?: string[];
  status?: string[];
  type?: string[];
}

export const useAgendaEvents = (params: UseAgendaEventsParams = {}) => {
  return useQuery({
    queryKey: ['agenda-events', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.professionalIds?.length) {
        params.professionalIds.forEach(id => searchParams.append('professionalIds', id));
      }
      if (params.specialtyIds?.length) {
        params.specialtyIds.forEach(id => searchParams.append('specialtyIds', id));
      }
      if (params.insuranceIds?.length) {
        params.insuranceIds.forEach(id => searchParams.append('insuranceIds', id));
      }
      if (params.locationIds?.length) {
        params.locationIds.forEach(id => searchParams.append('locationIds', id));
      }
      if (params.status?.length) {
        params.status.forEach(s => searchParams.append('status', s));
      }
      if (params.type?.length) {
        params.type.forEach(t => searchParams.append('type', t));
      }

      return fetchWithClientAuth<AgendaEvent[]>(`/api/client-portal/modulo-agenda/events?${searchParams}`);
    },
  });
};
