
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  FileText, 
  Building, 
  Users, 
  MapPin,
  Stethoscope
} from 'lucide-react';
import ProfissionalModal from '@/components/client-portal/modulo-agenda/ProfissionalModal';
import ConvenioModal from '@/components/client-portal/modulo-agenda/ConvenioModal';
import SalaUnidadeModal from '@/components/client-portal/modulo-agenda/SalaUnidadeModal';
import { useProfissionais } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useConvenios } from '@/hooks/client-portal/modulo-agenda/useConvenios';
import { useSalasUnidades } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';

const ConfiguracoesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('profissionais');
  
  // Modal states
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const [showSalaModal, setShowSalaModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data hooks
  const { data: profissionaisData } = useProfissionais();
  const { data: conveniosData } = useConvenios();
  const { data: salasData } = useSalasUnidades();

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'profissional') setShowProfissionalModal(true);
    if (type === 'convenio') setShowConvenioModal(true);
    if (type === 'sala') setShowSalaModal(true);
  };

  const handleModalClose = () => {
    setEditingItem(null);
    setShowProfissionalModal(false);
    setShowConvenioModal(false);
    setShowSalaModal(false);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ativo') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
    }
    if (status === 'inativo') {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    if (status === 'manutencao') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Manutenção</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Configurações</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie profissionais, convênios, salas e outros cadastros do sistema
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs de Configuração */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="profissionais" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Profissionais
          </TabsTrigger>
          <TabsTrigger value="convenios" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Convênios
          </TabsTrigger>
          <TabsTrigger value="salas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Salas/Unidades
          </TabsTrigger>
        </TabsList>

        {/* Profissionais */}
        <TabsContent value="profissionais" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Profissionais</h3>
            <Button 
              onClick={() => setShowProfissionalModal(true)}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Novo Profissional
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profissionaisData?.items?.map((profissional) => (
                    <TableRow key={profissional.id}>
                      <TableCell className="font-medium">{profissional.nome}</TableCell>
                      <TableCell>{profissional.crm}</TableCell>
                      <TableCell>{profissional.especialidade_nome}</TableCell>
                      <TableCell>{getStatusBadge(profissional.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(profissional, 'profissional')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Convênios */}
        <TabsContent value="convenios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Convênios</h3>
            <Button 
              onClick={() => setShowConvenioModal(true)}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Novo Convênio
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
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
                      <TableCell className="font-medium">{convenio.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {convenio.tipo === 'plano_saude' ? 'Plano de Saúde' : 
                           convenio.tipo === 'convenio' ? 'Convênio' : 'Particular'}
                        </Badge>
                      </TableCell>
                      <TableCell>{convenio.contato_nome || '-'}</TableCell>
                      <TableCell>{getStatusBadge(convenio.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(convenio, 'convenio')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salas/Unidades */}
        <TabsContent value="salas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Salas e Unidades</h3>
            <Button 
              onClick={() => setShowSalaModal(true)}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Nova Sala/Unidade
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salasData?.items?.map((sala) => (
                    <TableRow key={sala.id}>
                      <TableCell className="font-medium">{sala.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sala.tipo === 'consultorio' ? 'Consultório' :
                           sala.tipo === 'sala_procedimento' ? 'Sala de Procedimento' :
                           sala.tipo === 'centro_cirurgico' ? 'Centro Cirúrgico' :
                           sala.tipo === 'enfermaria' ? 'Enfermaria' : 'Recepção'}
                        </Badge>
                      </TableCell>
                      <TableCell>{sala.localizacao}</TableCell>
                      <TableCell>{sala.capacidade || '-'}</TableCell>
                      <TableCell>{getStatusBadge(sala.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(sala, 'sala')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProfissionalModal
        open={showProfissionalModal}
        onOpenChange={handleModalClose}
        profissional={editingItem}
        onSuccess={handleModalClose}
      />

      <ConvenioModal
        open={showConvenioModal}
        onOpenChange={handleModalClose}
        convenio={editingItem}
        onSuccess={handleModalClose}
      />

      <SalaUnidadeModal
        open={showSalaModal}
        onOpenChange={handleModalClose}
        salaUnidade={editingItem}
        onSuccess={handleModalClose}
      />
    </div>
  );
};

export default ConfiguracoesPage;
