
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Filter, Plus, Clock, MapPin, User, UserPlus, TrendingUp, Users, DollarSign, Star } from 'lucide-react';
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
    <div className="flex-1 space-y-6 p-6">
      {/* Cards de Métricas - Estilo idêntico aos outros módulos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hoje
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">
              +2 em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Esta Semana
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">68</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação à semana passada
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ 45.231</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NPS Médio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8.7</div>
            <p className="text-xs text-muted-foreground">
              +0.3 em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sub-navegação e Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          
          {/* Tabs para visualização do calendário */}
          <Tabs value={calendarView} onValueChange={(value: any) => setCalendarView(value)}>
            <TabsList className="bg-muted">
              <TabsTrigger value="dayGridMonth" className="text-xs">Mês</TabsTrigger>
              <TabsTrigger value="timeGridWeek" className="text-xs">Semana</TabsTrigger>
              <TabsTrigger value="timeGridDay" className="text-xs">Dia</TabsTrigger>
              <TabsTrigger value="listWeek" className="text-xs">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPacienteModal(true)}
            className="flex items-center gap-2"
            size="sm"
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
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Layout principal com filtros laterais */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Filtros laterais */}
        {showFilters && (
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <AgendaFilters 
                  filters={filters} 
                  onFiltersChange={setFilters}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calendário */}
        <div className={showFilters ? "lg:col-span-4" : "lg:col-span-5"}>
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <AgendaCalendar
                view={calendarView}
                filters={filters}
                onEventClick={handleEventClick}
                onDateSelect={handleDateSelect}
              />
            </CardContent>
          </Card>
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
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Paciente</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{selectedEvent.patientName}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Profissional</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{selectedEvent.professionalName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEvent.specialty}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Horário e localização */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Horário</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(selectedEvent.start).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(selectedEvent.start).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Local</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status e tipo */}
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Tipo: </span>
                  <Badge variant="outline">
                    {getTypeLabel(selectedEvent.type)}
                  </Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Convênio: </span>
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
