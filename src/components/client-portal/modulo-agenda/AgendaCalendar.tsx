
import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import ptLocale from '@fullcalendar/core/locales/pt';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgendaEvents } from '@/hooks/client-portal/modulo-agenda/useAgendaEvents';

interface AgendaCalendarProps {
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  filters: {
    professionalIds?: string[];
    specialtyIds?: string[];
    insuranceIds?: string[];
    locationIds?: string[];
    status?: string[];
    type?: string[];
  };
  onEventClick?: (eventInfo: any) => void;
  onDateSelect?: (selectInfo: any) => void;
}

const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
  view,
  filters,
  onEventClick,
  onDateSelect
}) => {
  const { data: events, isLoading } = useAgendaEvents(filters);

  const calendarEvents = useMemo(() => {
    if (!events) return [];

    return events.map(event => ({
      id: event.id,
      title: `${event.patientName} - ${event.professionalName}`,
      start: event.start,
      end: event.end,
      backgroundColor: event.backgroundColor || getStatusColor(event.status),
      borderColor: event.borderColor || getStatusColor(event.status),
      extendedProps: {
        patientName: event.patientName,
        professionalName: event.professionalName,
        specialty: event.specialty,
        status: event.status,
        type: event.type,
        location: event.location,
        insurance: event.insurance,
      }
    }));
  }, [events]);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: '#8B5CF6',
      in_progress: '#F59E0B',
      completed: '#10B981',
      cancelled: '#EF4444',
    };
    return colors[status as keyof typeof colors] || '#6B7280';
  };

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { extendedProps } = event;

    return (
      <div className="p-1 text-xs">
        <div className="font-medium truncate">{extendedProps.patientName}</div>
        <div className="text-xs opacity-90 truncate">{extendedProps.professionalName}</div>
        <Badge variant="secondary" className="text-xs mt-1">
          {getStatusLabel(extendedProps.status)}
        </Badge>
      </div>
    );
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: 'Agendado',
      in_progress: 'Em andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={view}
        locale={ptLocale}
        events={calendarEvents}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={onEventClick}
        select={onDateSelect}
        eventContent={renderEventContent}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          list: 'Lista'
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6],
          startTime: '08:00',
          endTime: '18:00',
        }}
      />
    </Card>
  );
};

export default AgendaCalendar;
