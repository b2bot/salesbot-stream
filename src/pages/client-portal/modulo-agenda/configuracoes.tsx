
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Stethoscope,
  FileText, 
  MapPin,
  Users,
  GraduationCap,
  Settings
} from 'lucide-react';
import ProfissionalModal from '@/components/client-portal/modulo-agenda/ProfissionalModal';
import ConvenioModal from '@/components/client-portal/modulo-agenda/ConvenioModal';
import SalaUnidadeModal from '@/components/client-portal/modulo-agenda/SalaUnidadeModal';
import EspecialidadeModal from '@/components/client-portal/modulo-agenda/EspecialidadeModal';
import UsuarioModal from '@/components/client-portal/modulo-agenda/UsuarioModal';
import { useProfissionais } from '@/hooks/client-portal/modulo-agenda/useProfissionais';
import { useConvenios } from '@/hooks/client-portal/modulo-agenda/useConvenios';
import { useSalasUnidades } from '@/hooks/client-portal/modulo-agenda/useSalasUnidades';
import { useEspecialidades } from '@/hooks/client-portal/modulo-agenda/useEspecialidades';
import { useUsuarios } from '@/hooks/client-portal/modulo-agenda/useUsuarios';

const ConfiguracoesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('profissionais');
  
  // Modal states
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [showConvenioModal, setShowConvenioModal] = useState(false);
  const [showSalaModal, setShowSalaModal] = useState(false);
  const [showEspecialidadeModal, setShowEspecialidadeModal] = useState(false);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data hooks
  const { data: profissionaisData } = useProfissionais();
  const { data: conveniosData } = useConvenios();
  const { data: salasData } = useSalasUnidades();
  const { data: especialidadesData } = useEspecialidades();
  const { data: usuariosData } = useUsuarios();

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'profissional') setShowProfissionalModal(true);
    if (type === 'convenio') setShowConvenioModal(true);
    if (type === 'sala') setShowSalaModal(true);
    if (type === 'especialidade') setShowEspecialidadeModal(true);
    if (type === 'usuario') setShowUsuarioModal(true);
  };

  const handleModalClose = () => {
    setEditingItem(null);
    setShowProfissionalModal(false);
    setShowConvenioModal(false);
    setShowSalaModal(false);
    setShowEspecialidadeModal(false);
    setShowUsuarioModal(false);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ativo' || status === 'ativa') {
      return <Badge variant="default">Ativo</Badge>;
    }
    if (status === 'inativo' || status === 'inativa') {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    if (status === 'manutencao') {
      return <Badge variant="destructive">Manutenção</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="especialidades" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Especialidades
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        {/* Profissionais */}
        <TabsContent value="profissionais" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Profissionais</h2>
            <Button 
              onClick={() => setShowProfissionalModal(true)}
              className="flex items-center gap-2"
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
                            className="text-red-600 hover:text-red-700"
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
            <h2 className="text-xl font-semibold text-foreground">Convênios</h2>
            <Button 
              onClick={() => setShowConvenioModal(true)}
              className="flex items-center gap-2"
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
                            className="text-red-600 hover:text-red-700"
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
            <h2 className="text-xl font-semibold text-foreground">Salas e Unidades</h2>
            <Button 
              onClick={() => setShowSalaModal(true)}
              className="flex items-center gap-2"
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
                           sala.tipo === 'centro_cirurgico' ? 'Centro Cirúrgico' :
                           sala.tipo === 'sala_exames' ? 'Sala de Exames' : 'Sala Compartilhada'}
                        </Badge>
                      </TableCell>
                      <TableCell>{sala.logradouro || sala.localizacao}</TableCell>
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
                            className="text-red-600 hover:text-red-700"
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

        {/* Especialidades */}
        <TabsContent value="especialidades" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Especialidades</h2>
            <Button 
              onClick={() => setShowEspecialidadeModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Especialidade
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {especialidadesData?.items?.map((especialidade) => (
                    <TableRow key={especialidade.id}>
                      <TableCell className="font-medium">{especialidade.nome}</TableCell>
                      <TableCell>{especialidade.descricao || '-'}</TableCell>
                      <TableCell>{getStatusBadge(especialidade.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(especialidade, 'especialidade')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
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

        {/* Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Usuários do Sistema</h2>
            <Button 
              onClick={() => setShowUsuarioModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Nível de Acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosData?.items?.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {usuario.nivel_acesso === 'admin' ? 'Administrador' :
                           usuario.nivel_acesso === 'medico' ? 'Médico' :
                           usuario.nivel_acesso === 'recepcionista' ? 'Recepcionista' : 'Financeiro'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(usuario, 'usuario')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
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

      <EspecialidadeModal
        open={showEspecialidadeModal}
        onOpenChange={handleModalClose}
        especialidade={editingItem}
        onSuccess={handleModalClose}
      />

      <UsuarioModal
        open={showUsuarioModal}
        onOpenChange={handleModalClose}
        usuario={editingItem}
        onSuccess={handleModalClose}
      />
    </div>
  );
};

export default ConfiguracoesPage;
