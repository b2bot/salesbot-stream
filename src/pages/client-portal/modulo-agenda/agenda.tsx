
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Filter, Plus, Clock, MapPin, User, UserPlus } from 'lucide-react';
import AgendaCalendar from '@/components/client-portal/modulo-agenda/AgendaCalendar';
import AgendaFilters from '@/components/client-portal/modulo-agenda/AgendaFilters';
import CheckInCheckOutButtons from '@/components/client-portal/modulo-agenda/CheckInCheckOutButtons';
import CheckInCheckOutModal from '@/components/client-portal/modulo-agenda/CheckInCheckOutModal';
import AgendamentoModal from '@/components/client-portal/modulo-agenda/AgendamentoModal';
import PacienteModal from '@/components/client-portal/modulo-agenda/PacienteModal';

const AgendaView: React.FC = () => {
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('timeGridWeek');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [checkInOutModal, setCheckInOutModal] = useState<{
    open: boolean;
    agendamento: any;
    action: 'checkin' | 'checkout';
  }>({ open: false, agendamento: null, action: 'checkin' });
  const [showAgendamentoModal, setShowAgendamentoModal] = useState(false);
  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const [agendamentoInitialData, setAgendamentoInitialData] = useState<{
    date?: string;
    time?: string;
  }>({});
  
  const [filters, setFilters] = useState({
    professionalIds: [],
    specialtyIds: [],
    insuranceIds: [],
    locationIds: [],
    status: [],
    type: [],
  });

  const handleEventClick = (eventInfo: any) => {
    const { event } = eventInfo;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      ...event.extendedProps,
    });
  };

  const handleDateSelect = (selectInfo: any) => {
    const startDate = selectInfo.start;
    const date = startDate.toISOString().split('T')[0];
    const time = startDate.toTimeString().slice(0, 5);
    
    setAgendamentoInitialData({ date, time });
    setShowAgendamentoModal(true);
  };

  const handleCheckInOut = (action: 'checkin' | 'checkout', agendamento: any) => {
    setCheckInOutModal({
      open: true,
      agendamento,
      action
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      consultation: 'Consulta',
      procedure: 'Procedimento',
      surgery: 'Cirurgia',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          
          <Tabs value={calendarView} onValueChange={(value: any) => setCalendarView(value)}>
            <TabsList>
              <TabsTrigger value="dayGridMonth">Mês</TabsTrigger>
              <TabsTrigger value="timeGridWeek">Semana</TabsTrigger>
              <TabsTrigger value="timeGridDay">Dia</TabsTrigger>
              <TabsTrigger value="listWeek">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPacienteModal(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Novo Paciente
          </Button>
          
          <Button 
            onClick={() => {
              setAgendamentoInitialData({});
              setShowAgendamentoModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros */}
        {showFilters && (
          <div className="lg:col-span-1">
            <AgendaFilters 
              filters={filters} 
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* Calendário */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <AgendaCalendar
            view={calendarView}
            filters={filters}
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>

      {/* Modal de detalhes do evento */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Detalhes do Agendamento
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {/* Info principal */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Paciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedEvent.patientName}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Profissional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedEvent.professionalName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEvent.specialty}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Horário e localização */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Horário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(selectedEvent.start).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(selectedEvent.start).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Local</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status e tipo */}
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm font-medium">Tipo: </span>
                  <Badge variant="outline">
                    {getTypeLabel(selectedEvent.type)}
                  </Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Convênio: </span>
                  <Badge variant="secondary">
                    {selectedEvent.insurance}
                  </Badge>
                </div>
              </div>

              {/* Ações */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <CheckInCheckOutButtons
                    appointmentId={selectedEvent.id}
                    status={selectedEvent.status}
                    patientName={selectedEvent.patientName}
                    startTime={selectedEvent.start}
                  />
                  
                  <div className="flex gap-2">
                    {selectedEvent.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => handleCheckInOut('checkin', selectedEvent)}
                      >
                        Check-in Completo
                      </Button>
                    )}
                    
                    {selectedEvent.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckInOut('checkout', selectedEvent)}
                      >
                        Check-out Completo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <CheckInCheckOutModal
        open={checkInOutModal.open}
        onOpenChange={(open) => setCheckInOutModal(prev => ({ ...prev, open }))}
        agendamento={checkInOutModal.agendamento}
        action={checkInOutModal.action}
      />

      <AgendamentoModal
        open={showAgendamentoModal}
        onOpenChange={setShowAgendamentoModal}
        initialDate={agendamentoInitialData.date}
        initialTime={agendamentoInitialData.time}
        onSuccess={() => setAgendamentoInitialData({})}
      />

      <PacienteModal
        open={showPacienteModal}
        onOpenChange={setShowPacienteModal}
      />
    </div>
  );
};

export default AgendaView;
