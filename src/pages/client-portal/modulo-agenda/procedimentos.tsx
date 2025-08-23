
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';
import { useProcedimentos, useDeleteProcedimento } from '@/hooks/client-portal/modulo-agenda/useProcedimentos';
import ProcedimentoModal from '@/components/client-portal/modulo-agenda/ProcedimentoModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const ProcedimentosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [selectedProcedimento, setSelectedProcedimento] = useState<any>(null);
  const [showProcedimentoModal, setShowProcedimentoModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    procedimento: any;
  }>({ open: false, procedimento: null });

  const { data: procedimentosData, isLoading } = useProcedimentos({
    status: statusFilter || undefined,
    tipo: tipoFilter || undefined,
  });

  const deleteProcedimento = useDeleteProcedimento();

  const handleNewProcedimento = () => {
    setSelectedProcedimento(null);
    setShowProcedimentoModal(true);
  };

  const handleEditProcedimento = (procedimento: any) => {
    setSelectedProcedimento(procedimento);
    setShowProcedimentoModal(true);
  };

  const handleDeleteProcedimento = (procedimento: any) => {
    setDeleteDialog({ open: true, procedimento });
  };

  const confirmDelete = async () => {
    try {
      await deleteProcedimento.mutateAsync(deleteDialog.procedimento.id);
      setDeleteDialog({ open: false, procedimento: null });
    } catch (error) {
      toast({
        title: "Erro ao cancelar procedimento",
        description: "Não foi possível cancelar o procedimento selecionado.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      agendado: 'secondary',
      preparacao: 'default',
      em_andamento: 'destructive',
      concluido: 'outline',
      cancelado: 'destructive'
    };
    return colors[status as keyof typeof colors] || 'secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      agendado: 'Agendado',
      preparacao: 'Preparação',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      cirurgia: 'Cirurgia',
      procedimento: 'Procedimento',
      exame: 'Exame'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  // Filtrar procedimentos por termo de busca
  const filteredProcedimentos = procedimentosData?.items?.filter(proc =>
    searchTerm === '' || 
    proc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.profissional_principal_nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Procedimentos</h1>
          <p className="text-muted-foreground">
            Gerencie cirurgias, procedimentos e exames especializados
          </p>
        </div>
        <Button onClick={handleNewProcedimento}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Procedimento
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por procedimento, paciente ou profissional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="preparacao">Preparação</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="cirurgia">Cirurgia</SelectItem>
                <SelectItem value="procedimento">Procedimento</SelectItem>
                <SelectItem value="exame">Exame</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Procedimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Procedimentos Agendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedimentos.map((procedimento) => (
                  <TableRow key={procedimento.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{procedimento.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          Duração: {procedimento.duracao_estimada}min
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {procedimento.paciente_nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{procedimento.profissional_principal_nome}</div>
                        {procedimento.equipe_nomes?.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            +{procedimento.equipe_nomes.length} da equipe
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{new Date(procedimento.data_inicio).toLocaleDateString('pt-BR')}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(procedimento.data_inicio).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {procedimento.sala_nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTipoLabel(procedimento.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(procedimento.status) as any}>
                        {getStatusLabel(procedimento.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProcedimento(procedimento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProcedimento(procedimento)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Procedimento */}
      <ProcedimentoModal
        open={showProcedimentoModal}
        onOpenChange={setShowProcedimentoModal}
        procedimento={selectedProcedimento}
        onSuccess={() => setSelectedProcedimento(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => 
        setDeleteDialog(prev => ({ ...prev, open }))
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Procedimento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este procedimento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProcedimentosPage;
