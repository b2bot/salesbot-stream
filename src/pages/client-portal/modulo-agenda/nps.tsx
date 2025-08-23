
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import { useAgendaNps, useCreateNps } from '@/hooks/client-portal/modulo-agenda/useAgendaNps';
import { format, subDays } from 'date-fns';

const NpsView: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [newNpsScore, setNewNpsScore] = useState(0);
  const [newNpsComment, setNewNpsComment] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: npsData, isLoading } = useAgendaNps({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    professionalId: selectedProfessional || undefined,
  });

  const createNpsMutation = useCreateNps();

  const handleCreateNps = () => {
    if (!selectedAppointment || newNpsScore === 0) return;

    createNpsMutation.mutate({
      appointmentId: selectedAppointment,
      score: newNpsScore,
      comment: newNpsComment || undefined,
    });

    setIsDialogOpen(false);
    setNewNpsScore(0);
    setNewNpsComment('');
    setSelectedAppointment('');
  };

  const getNpsColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNpsLabel = (score: number) => {
    if (score >= 9) return 'Promotor';
    if (score >= 7) return 'Neutro';
    return 'Detrator';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6" />
            Net Promoter Score (NPS)
          </h2>
          <p className="text-muted-foreground">
            Avaliação da satisfação dos pacientes
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Avaliação NPS</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Agendamento</Label>
                <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um agendamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apt-001">João Silva - Dr. Carlos (Cardiologia)</SelectItem>
                    <SelectItem value="apt-002">Maria Santos - Dra. Ana (Dermatologia)</SelectItem>
                    <SelectItem value="apt-003">Pedro Oliveira - Dr. José (Ortopedia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nota (0-10)</Label>
                <div className="flex gap-1">
                  {[...Array(11)].map((_, i) => (
                    <Button
                      key={i}
                      variant={newNpsScore === i ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setNewNpsScore(i)}
                    >
                      {i}
                    </Button>
                  ))}
                </div>
                {newNpsScore > 0 && (
                  <p className={`text-sm ${getNpsColor(newNpsScore)}`}>
                    {getNpsLabel(newNpsScore)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Comentário (opcional)</Label>
                <Textarea
                  placeholder="Comentários sobre o atendimento..."
                  value={newNpsComment}
                  onChange={(e) => setNewNpsComment(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCreateNps} 
                disabled={!selectedAppointment || newNpsScore === 0 || createNpsMutation.isPending}
                className="w-full"
              >
                {createNpsMutation.isPending ? 'Salvando...' : 'Salvar Avaliação'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os profissionais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os profissionais</SelectItem>
                  <SelectItem value="dr-carlos">Dr. Carlos (Cardiologia)</SelectItem>
                  <SelectItem value="dra-ana">Dra. Ana (Dermatologia)</SelectItem>
                  <SelectItem value="dr-jose">Dr. José (Ortopedia)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas NPS */}
      {npsData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">NPS Score</p>
                    <p className="text-3xl font-bold">{npsData.stats.npsScore}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Excelente
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nota Média</p>
                    <p className="text-3xl font-bold">{npsData.stats.averageScore.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">
                      {npsData.stats.totalResponses} avaliações
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Promotores</p>
                    <p className="text-3xl font-bold text-green-600">{npsData.stats.promoters}</p>
                    <p className="text-xs text-muted-foreground">
                      {npsData.stats.totalResponses > 0 
                        ? Math.round((npsData.stats.promoters / npsData.stats.totalResponses) * 100)
                        : 0}% do total
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Detratores</p>
                    <p className="text-3xl font-bold text-red-600">{npsData.stats.detractors}</p>
                    <p className="text-xs text-muted-foreground">
                      {npsData.stats.totalResponses > 0 
                        ? Math.round((npsData.stats.detractors / npsData.stats.totalResponses) * 100)
                        : 0}% do total
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição das notas */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição das Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">Promotores (9-10)</span>
                  <span className="text-sm">{npsData.stats.promoters} avaliações</span>
                </div>
                <Progress value={(npsData.stats.promoters / npsData.stats.totalResponses) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-600">Neutros (7-8)</span>
                  <span className="text-sm">{npsData.stats.passives} avaliações</span>
                </div>
                <Progress value={(npsData.stats.passives / npsData.stats.totalResponses) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-600">Detratores (0-6)</span>
                  <span className="text-sm">{npsData.stats.detractors} avaliações</span>
                </div>
                <Progress value={(npsData.stats.detractors / npsData.stats.totalResponses) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Lista de avaliações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Avaliações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {npsData.records.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{record.patientName}</h4>
                          <Badge variant="outline">{record.professionalName}</Badge>
                          <Badge 
                            variant={record.score >= 9 ? "default" : record.score >= 7 ? "secondary" : "destructive"}
                          >
                            {record.score}/10
                          </Badge>
                        </div>
                        {record.comment && (
                          <p className="text-sm text-muted-foreground">{record.comment}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(record.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NpsView;
