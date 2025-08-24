
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, PieChart, Plus, CreditCard, Users, BarChart3 } from 'lucide-react';
import { useAgendaFinanceiro } from '@/hooks/client-portal/modulo-agenda/useAgendaFinanceiro';
import { format, subDays } from 'date-fns';
import { useForm } from 'react-hook-form';

const FinanceiroView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'receivable' | 'payable' | 'projection'>('receivable');
  const [showContaModal, setShowContaModal] = useState(false);
  const [showRateioModal, setShowRateioModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: financeiroData, isLoading } = useAgendaFinanceiro({
    ...dateRange,
    type: selectedType,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      paid: { label: 'Pago', variant: 'default' as const },
      overdue: { label: 'Vencido', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Modal para nova conta
  const ContaModal = () => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();

    const onSubmit = (data: any) => {
      console.log('Nova conta:', data);
      setShowContaModal(false);
      reset();
    };

    return (
      <Dialog open={showContaModal} onOpenChange={setShowContaModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select onValueChange={(value) => setValue('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receivable">A Receber</SelectItem>
                  <SelectItem value="payable">A Pagar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input {...register('descricao')} placeholder="Descrição da conta" />
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input {...register('valor')} type="number" step="0.01" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Input {...register('vencimento')} type="date" />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea {...register('observacoes')} placeholder="Observações adicionais" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowContaModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Conta</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Modal para novo rateio
  const RateioModal = () => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();

    const onSubmit = (data: any) => {
      console.log('Novo rateio:', data);
      setShowRateioModal(false);
      reset();
    };

    return (
      <Dialog open={showRateioModal} onOpenChange={setShowRateioModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Regra de Rateio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Profissional/Categoria</Label>
              <Input {...register('categoria')} placeholder="Ex: Dr. João, Cardiologia" />
            </div>
            <div className="space-y-2">
              <Label>Percentual (%)</Label>
              <Input {...register('percentual')} type="number" min="0" max="100" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Receita</Label>
              <Select onValueChange={(value) => setValue('tipo_receita', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="procedimento">Procedimento</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea {...register('observacoes')} placeholder="Regras específicas do rateio" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowRateioModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Rateio</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <DollarSign className="h-8 w-8" />
            Módulo Financeiro
          </h1>
          <p className="text-muted-foreground mt-1">
            Contas, rateios e projeções financeiras integradas com a agenda
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Resumo financeiro */}
      {financeiroData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contas a Receber</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(financeiroData.summary.totalReceivable)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    +15% vs mês anterior
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contas a Pagar</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {formatCurrency(financeiroData.summary.totalPayable)}
                  </p>
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    +8% vs mês anterior
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                  <p className={`text-2xl font-bold mt-1 ${
                    financeiroData.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(financeiroData.summary.netBalance)}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    +22% vs mês anterior
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projeção Receita</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(financeiroData.summary.projectedRevenue)}
                  </p>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-2">
                    <Calendar className="h-3 w-3" />
                    Próximos 30 dias
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs de conteúdo */}
      <Tabs defaultValue="contas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contas" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Contas
          </TabsTrigger>
          <TabsTrigger value="rateios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Rateios
          </TabsTrigger>
          <TabsTrigger value="projecoes" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Projeções
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Contas a Receber/Pagar
                </CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receivable">Contas a Receber</SelectItem>
                      <SelectItem value="payable">Contas a Pagar</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowContaModal(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Conta
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {financeiroData && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Paciente/Fornecedor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeiroData.contas
                      .filter(conta => conta.type === selectedType)
                      .map((conta) => (
                      <TableRow key={conta.id}>
                        <TableCell className="font-medium">{conta.description}</TableCell>
                        <TableCell>
                          {selectedType === 'receivable' ? conta.patientName : 'Fornecedor XYZ'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(conta.dueDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(conta.value)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(conta.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rateios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Rateios por Profissional
                </CardTitle>
                <Button onClick={() => setShowRateioModal(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Regra de Rateio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {financeiroData && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead className="text-right">Receita Bruta</TableHead>
                      <TableHead className="text-right">Taxas</TableHead>
                      <TableHead className="text-right">Receita Líquida</TableHead>
                      <TableHead className="text-center">% Participação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeiroData.rateios.map((rateio, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{rateio.professional}</TableCell>
                        <TableCell>{rateio.specialty}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(rateio.grossRevenue)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(rateio.fees)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(rateio.netRevenue)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {rateio.percentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projecoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Projeções de Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              {financeiroData && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-center">Consultas</TableHead>
                      <TableHead className="text-center">Procedimentos</TableHead>
                      <TableHead className="text-right">Receita Estimada</TableHead>
                      <TableHead className="text-right">Receita Confirmada</TableHead>
                      <TableHead className="text-center">Taxa Confirmação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeiroData.projecoes.map((projecao, index) => {
                      const confirmationRate = projecao.estimatedRevenue > 0 
                        ? (projecao.confirmedRevenue / projecao.estimatedRevenue) * 100 
                        : 0;

                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(new Date(projecao.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="text-center">{projecao.consultations}</TableCell>
                          <TableCell className="text-center">{projecao.procedures}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(projecao.estimatedRevenue)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(projecao.confirmedRevenue)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={confirmationRate >= 80 ? "default" : confirmationRate >= 60 ? "secondary" : "destructive"}
                            >
                              {confirmationRate.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ContaModal />
      <RateioModal />
    </div>
  );
};

export default FinanceiroView;
