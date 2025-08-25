import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Download, Edit, Users } from 'lucide-react';
import PacienteModal from '@/components/client-portal/modulo-agenda/PacienteModal';
import ClienteDetalhesPanel from '@/components/client-portal/modulo-agenda/ClienteDetalhesPanel';
import { useClientes } from '@/hooks/client-portal/modulo-agenda/useClientes';
import { format } from 'date-fns';

const ClientesPage: React.FC = () => {
    // CORREÇÃO: O estado inicial dos filtros foi alterado de '' para 'all'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [periodoFilter, setPeriodoFilter] = useState('all');
    const [selectedCliente, setSelectedCliente] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const { data: clientesData, isLoading } = useClientes({
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter, // Lógica para não enviar 'all' para a API
        // A lógica de período seria implementada no hook/API
    });

    const handleNewCliente = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    const handleEditCliente = (cliente: any) => {
        setSelectedCliente(cliente);
        setIsModalOpen(true);
    };

    const handleViewCliente = (cliente: any) => {
        setSelectedCliente(cliente);
        setIsPanelOpen(true);
    };

    const getStatusBadge = (status: string) => {
        return status === 'ativo' ?
            <Badge variant="default">Ativo</Badge> :
            <Badge variant="secondary">Inativo</Badge>;
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Gestão de Clientes/Pacientes
                    </h1>
                    <p className="text-muted-foreground">
                        Visualize, cadastre e gerencie os pacientes da clínica.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    <Button onClick={handleNewCliente}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Paciente
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-48">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome, CPF ou ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* CORREÇÃO: O valor do item "Todos" foi alterado de '' para 'all' */}
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="ativo">Ativos</SelectItem>
                                <SelectItem value="inativo">Inativos</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Período de Cadastro" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* CORREÇÃO: O valor do item "Qualquer data" foi alterado de '' para 'all' */}
                                <SelectItem value="all">Qualquer data</SelectItem>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Clientes */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Data de Nascimento</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Data de Cadastro</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientesData?.items?.map((cliente) => (
                                        <TableRow key={cliente.id}>
                                            <TableCell className="font-mono text-xs">{cliente.id}</TableCell>
                                            <TableCell className="font-medium">{cliente.nome}</TableCell>
                                            <TableCell>{format(new Date(cliente.data_nascimento), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{cliente.cpf}</TableCell>
                                            <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                                            <TableCell>{format(new Date(cliente.created_at), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewCliente(cliente)}
                                                    >
                                                        Visualizar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEditCliente(cliente)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Cadastro/Edição */}
            <PacienteModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                paciente={selectedCliente}
                onSuccess={() => {
                    setIsModalOpen(false);
                    // Adicionar refetch dos clientes aqui
                }}
            />

            {/* Painel de Detalhes */}
            <ClienteDetalhesPanel
                open={isPanelOpen}
                onOpenChange={setIsPanelOpen}
                cliente={selectedCliente}
            />
        </div>
    );
};

export default ClientesPage;