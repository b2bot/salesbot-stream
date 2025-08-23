
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, PieChart } from 'lucide-react';
import { useAgendaFinanceiro } from '@/hooks/client-portal/modulo-agenda/useAgendaFinanceiro';
import { format, subDays } from 'date-fns';

const FinanceiroView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'receivable' | 'payable' | 'projection'>('receivable');
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
            <DollarSign className="h-6 w-6" />
            Integração Financeira
          </h2>
          <p className="text-muted-foreground">
            Mockup de integração com módulo financeiro
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Resumo financeiro */}
      {financeiroData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contas a Receber</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(financeiroData.summary.totalReceivable)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15% vs mês anterior
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contas a Pagar</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(financeiroData.summary.totalPayable)}
                  </p>
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8% vs mês anterior
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                  <p className={`text-2xl font-bold ${
                    financeiroData.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(financeiroData.summary.netBalance)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +22% vs mês anterior
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projeção Receita</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(financeiroData.summary.projectedRevenue)}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Próximos 30 dias
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs de conteúdo */}
      <Tabs defaultValue="contas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contas">Contas</TabsTrigger>
          <TabsTrigger value="rateios">Rateios</TabsTrigger>
          <TabsTrigger value="projecoes">Projeções</TabsTrigger>
        </TabsList>

        <TabsContent value="contas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contas a Receber/Pagar</CardTitle>
                <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receivable">Contas a Receber</SelectItem>
                    <SelectItem value="payable">Contas a Pagar</SelectItem>
                  </SelectContent>
                </Select>
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
              <CardTitle>Rateios por Profissional</CardTitle>
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
              <CardTitle>Projeções de Receita</CardTitle>
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
    </div>
  );
};

export default FinanceiroView;
