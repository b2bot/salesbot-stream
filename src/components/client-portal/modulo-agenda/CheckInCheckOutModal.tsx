import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, UserX, Clock, User, MapPin, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithClientAuth } from '@/hooks/client-portal/fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface CheckInCheckOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamento: any;
  action: 'checkin' | 'checkout';
}

interface CheckInOutFormData {
  observacoes?: string;
  nps_nota?: number;
  nps_comentario?: string;
}

const CheckInCheckOutModal: React.FC<CheckInCheckOutModalProps> = ({
  open,
  onOpenChange,
  agendamento,
  action
}) => {
  const queryClient = useQueryClient();
  const isCheckOut = action === 'checkout';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<CheckInOutFormData>();

  const checkInOutMutation = useMutation({
    mutationFn: (data: CheckInOutFormData) => 
      fetchWithClientAuth(`/api/client-portal/modulo-agenda/${action}`, {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: agendamento.id,
          ...data
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-events'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast({
        title: isCheckOut ? "Check-out realizado" : "Check-in realizado",
        description: isCheckOut 
          ? `Atendimento de ${agendamento?.patientName ?? "Paciente"} finalizado com sucesso.`
          : `${agendamento?.patientName ?? "Paciente"} fez check-in com sucesso.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: isCheckOut ? "Erro no check-out" : "Erro no check-in",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckInOutFormData) => {
    checkInOutMutation.mutate(data);
  };

  const npsNota = watch('nps_nota');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCheckOut ? (
              <>
                <UserX className="h-5 w-5" />
                Check-out - Finalizar Atendimento
              </>
            ) : (
              <>
                <UserCheck className="h-5 w-5" />
                Check-in - Confirmar Chegada
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Informações do Agendamento */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{agendamento?.patientName ?? "Paciente não identificado"}</div>
                  <div className="text-sm text-muted-foreground">Paciente</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{agendamento?.professionalName ?? ""}</div>
                  <div className="text-sm text-muted-foreground">{agendamento?.specialty ?? ""}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {agendamento?.start 
                      ? new Date(agendamento.start).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "--:--"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {agendamento?.start
                      ? new Date(agendamento.start).toLocaleDateString('pt-BR')
                      : "--/--/----"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{agendamento?.location ?? ""}</div>
                  <div className="text-sm text-muted-foreground">Local</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                {agendamento?.insurance ?? ""}
              </Badge>
              <Badge variant={agendamento?.status === 'scheduled' ? 'secondary' : 'default'}>
                {agendamento?.status === 'scheduled' ? 'Agendado' : 'Em Andamento'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">
              {isCheckOut ? 'Observações do Atendimento' : 'Observações do Check-in'}
            </Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder={isCheckOut 
                ? "Descreva como foi o atendimento, procedimentos realizados, etc."
                : "Observações sobre a chegada do paciente (horário, condições, etc.)"
              }
              rows={3}
            />
          </div>

          {/* NPS (apenas no checkout) */}
          {isCheckOut && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Pesquisa de Satisfação (NPS)
              </h4>
              
              <div className="space-y-2">
                <Label>De 0 a 10, o quanto você recomendaria nossos serviços?</Label>
                <div className="flex gap-1">
                  {Array.from({ length: 11 }, (_, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant={npsNota === i ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setValue('nps_nota', i)}
                    >
                      {i}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Muito improvável</span>
                  <span>Muito provável</span>
                </div>
              </div>

              {npsNota !== undefined && (
                <div className="space-y-2">
                  <Label htmlFor="nps_comentario">Comentário (opcional)</Label>
                  <Textarea
                    id="nps_comentario"
                    {...register('nps_comentario')}
                    placeholder="Conte-nos mais sobre sua experiência..."
                    rows={2}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant={isCheckOut ? "destructive" : "default"}
            >
              {isSubmitting 
                ? (isCheckOut ? 'Finalizando...' : 'Confirmando...') 
                : (isCheckOut ? 'Finalizar Atendimento' : 'Confirmar Check-in')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInCheckOutModal;
