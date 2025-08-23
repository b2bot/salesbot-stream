
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '@/hooks/client-portal/fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

interface CheckInCheckOutButtonsProps {
  appointmentId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  patientName: string;
  startTime: string;
  className?: string;
}

const CheckInCheckOutButtons: React.FC<CheckInCheckOutButtonsProps> = ({
  appointmentId,
  status,
  patientName,
  startTime,
  className = ''
}) => {
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: () => 
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/check-in`, {
        method: 'POST',
        body: JSON.stringify({ appointmentId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Check-in realizado",
        description: `${patientName} fez check-in com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no check-in",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => 
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/check-out`, {
        method: 'POST',
        body: JSON.stringify({ appointmentId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      toast({
        title: "Check-out realizado",
        description: `Atendimento de ${patientName} finalizado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no check-out",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = () => {
    const statusConfig = {
      scheduled: { 
        label: 'Agendado', 
        variant: 'secondary' as const, 
        icon: Clock 
      },
      in_progress: { 
        label: 'Em Andamento', 
        variant: 'default' as const, 
        icon: UserCheck 
      },
      completed: { 
        label: 'Concluído', 
        variant: 'secondary' as const, 
        icon: CheckCircle 
      },
      cancelled: { 
        label: 'Cancelado', 
        variant: 'destructive' as const, 
        icon: XCircle 
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const canCheckIn = status === 'scheduled';
  const canCheckOut = status === 'in_progress';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusBadge()}
      
      {canCheckIn && (
        <Button
          size="sm"
          onClick={() => checkInMutation.mutate()}
          disabled={checkInMutation.isPending}
          className="flex items-center gap-1"
        >
          <UserCheck className="h-4 w-4" />
          Check-in
        </Button>
      )}

      {canCheckOut && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => checkOutMutation.mutate()}
          disabled={checkOutMutation.isPending}
          className="flex items-center gap-1"
        >
          <UserX className="h-4 w-4" />
          Check-out
        </Button>
      )}

      {(isCompleted || isCancelled) && (
        <div className="text-xs text-muted-foreground">
          {isCompleted ? 'Atendimento finalizado' : 'Consulta cancelada'}
        </div>
      )}
    </div>
  );
};

export default CheckInCheckOutButtons;
