
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  UserCheck, 
  Building, 
  MapPin,
  Heart,
  Truck
} from 'lucide-react';
import { useProfissionais, useDeleteProfissional } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useConvenios, useDeleteConvenio } from '@/hooks/client-portal/modulo-agenda/useConvenios';
import { useSalasUnidades, useDeleteSalaUnidade } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';
import ProfissionalModal from '@/components/client-portal/modulo-agenda/ProfissionalModal';
import ConvenioModal from '@/components/client-portal/modulo-agenda/ConvenioModal';
import SalaUnidadeModal from '@/components/client-portal/modulo-agenda/SalaUnidadeModal';
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

const ConfiguracoesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfissional, setSelectedProfissional] = useState<any>(null);
  const [selectedConvenio, setSelectedConvenio] = useState<any>(null);
  const [selectedSalaUnidade, setSelectedSalaUnidade] = useState<any>(null);
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const [showSalaUnidadeModal, setShowSalaUnidadeModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: string;
    item: any;
  }>({ open: false, type: '', item: null });

  // Hooks para dados
  const { data: profissionaisData, isLoading: loadingProfissionais } = useProfissionais({ 
    search: searchTerm 
  });
  const { data: conveniosData, isLoading: loadingConvenios } = useConvenios({ 
    search: searchTerm 
  });
  const { data: salasData, isLoading: loadingSalas } = useSalasUnidades({ 
    search: searchTerm 
  });

  // Mutations para delete
  const deleteProfissional = useDeleteProfissional();
  const deleteConvenio = useDeleteConvenio();
  const deleteSalaUnidade = useDeleteSalaUnidade();

  const handleEdit = (type: string, item: any) => {
    switch (type) {
      case 'profissional':
        setSelectedProfissional(item);
        setShowProfissionalModal(true);
        break;
      case 'convenio':
        setSelectedConvenio(item);
        setShowConvenioModal(true);
        break;
      case 'sala':
        setSelectedSalaUnidade(item);
        setShowSalaUnidadeModal(true);
        break;
    }
  };

  const handleDelete = (type: string, item: any) => {
    setDeleteDialog({ open: true, type, item });
  };

  const confirmDelete = async () => {
    const { type, item } = deleteDialog;
    
    try {
      switch (type) {
        case 'profissional':
          await deleteProfissional.mutateAsync(item.id);
          break;
        case 'convenio':
          await deleteConvenio.mutateAsync(item.id);
          break;
        case 'sala':
          await deleteSalaUnidade.mutateAsync(item.id);
          break;
      }
      setDeleteDialog({ open: false, type: '', item: null });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item selecionado.",
        variant: "destructive",
      });
    }
  };

  const handleNewItem = (type: string) => {
    switch (type) {
      case 'profissional':
        setSelectedProfissional(null);
        setShowProfissionalModal(true);
        break;
      case 'convenio':
        setSelectedConvenio(null);
        setShowConvenioModal(true);
        break;
      case 'sala':
        setSelectedSalaUnidade(null);
        setShowSalaUnidadeModal(true);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie profissionais, convênios, salas e outros cadastros auxiliares
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profissionais" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profissionais" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Profissionais
          </TabsTrigger>
          <TabsTrigger value="convenios" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Convênios
          </TabsTrigger>
          <TabsTrigger value="salas" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Salas/Unidades
          </TabsTrigger>
        </TabsList>

        {/* Profissionais */}
        <TabsContent value="profissionais">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Profissionais
                </CardTitle>
                <Button onClick={() => handleNewItem('profissional')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Profissional
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingProfissionais ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>CRM</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profissionaisData?.items?.map((profissional) => (
                      <TableRow key={profissional.id}>
                        <TableCell className="font-medium">
                          {profissional.nome}
                        </TableCell>
                        <TableCell>{profissional.especialidade_nome}</TableCell>
                        <TableCell>{profissional.crm}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={profissional.status === 'ativo' ? 'default' : 'secondary'}
                          >
                            {profissional.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit('profissional', profissional)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete('profissional', profissional)}
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
        </TabsContent>

        {/* Convênios */}
        <TabsContent value="convenios">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Convênios
                </CardTitle>
                <Button onClick={() => handleNewItem('convenio')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Convênio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingConvenios ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conveniosData?.items?.map((convenio) => (
                      <TableRow key={convenio.id}>
                        <TableCell className="font-medium">
                          {convenio.nome}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {convenio.tipo === 'particular' ? 'Particular' :
                             convenio.tipo === 'plano_saude' ? 'Plano de Saúde' : 
                             'Convênio'}
                          </Badge>
                        </TableCell>
                        <TableCell>{convenio.contato_nome || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={convenio.status === 'ativo' ? 'default' : 'secondary'}
                          >
                            {convenio.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit('convenio', convenio)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete('convenio', convenio)}
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
        </TabsContent>

        {/* Salas/Unidades */}
        <TabsContent value="salas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Salas/Unidades
                </CardTitle>
                <Button onClick={() => handleNewItem('sala')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sala/Unidade
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSalas ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salasData?.items?.map((sala) => (
                      <TableRow key={sala.id}>
                        <TableCell className="font-medium">
                          {sala.nome}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {sala.tipo === 'consultorio' ? 'Consultório' :
                             sala.tipo === 'sala_procedimento' ? 'Sala de Procedimento' :
                             sala.tipo === 'centro_cirurgico' ? 'Centro Cirúrgico' :
                             sala.tipo === 'enfermaria' ? 'Enfermaria' : 'Recepção'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {sala.localizacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              sala.status === 'ativo' ? 'default' :
                              sala.status === 'manutencao' ? 'destructive' : 'secondary'
                            }
                          >
                            {sala.status === 'ativo' ? 'Ativo' :
                             sala.status === 'manutencao' ? 'Manutenção' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit('sala', sala)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete('sala', sala)}
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
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProfissionalModal
        open={showProfissionalModal}
        onOpenChange={setShowProfissionalModal}
        profissional={selectedProfissional}
        onSuccess={() => setSelectedProfissional(null)}
      />

      <ConvenioModal
        open={showConvenioModal}
        onOpenChange={setShowConvenioModal}
        convenio={selectedConvenio}
        onSuccess={() => setSelectedConvenio(null)}
      />

      <SalaUnidadeModal
        open={showSalaUnidadeModal}
        onOpenChange={setShowSalaUnidadeModal}
        salaUnidade={selectedSalaUnidade}
        onSuccess={() => setSelectedSalaUnidade(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => 
        setDeleteDialog(prev => ({ ...prev, open }))
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfiguracoesPage;
