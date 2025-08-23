
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useAgendaRelatorios } from '@/hooks/client-portal/modulo-agenda/useAgendaRelatorios';

interface RelatorioTableProps {
  startDate: string;
  endDate: string;
  groupBy: 'professional' | 'specialty' | 'insurance' | 'location' | 'day';
  professionalIds?: string[];
  specialtyIds?: string[];
  insuranceIds?: string[];
  locationIds?: string[];
}

const RelatorioTable: React.FC<RelatorioTableProps> = (props) => {
  const { data, isLoading } = useAgendaRelatorios(props);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}min`;
  };

  const exportToExcel = () => {
    if (!data) return;
    
    // Simulação de exportação - em produção, seria implementada a exportação real
    const csvContent = [
      ['Item', 'Total Atendimentos', 'Realizados', 'Cancelados', 'Receita', 'Tempo Médio'],
      ...data.items.map(item => [
        item.label,
        item.totalAtendimentos,
        item.atendimentosRealizados,
        item.atendimentosCancelados,
        item.receita,
        item.tempoMedioAtendimento
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-agenda-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhum dado encontrado para o período selecionado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Relatório de Atendimentos</CardTitle>
          <Button onClick={exportToExcel} size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">{data.summary.totalAtendimentos}</div>
            <div className="text-sm text-muted-foreground">Total de Atendimentos</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {data.summary.atendimentosRealizados}
            </div>
            <div className="text-sm text-muted-foreground">Realizados</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {formatCurrency(data.summary.receitaTotal)}
            </div>
            <div className="text-sm text-muted-foreground">Receita Total</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {formatTime(data.summary.tempoMedioGeral)}
            </div>
            <div className="text-sm text-muted-foreground">Tempo Médio</div>
          </div>
        </div>

        {/* Tabela detalhada */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Realizados</TableHead>
              <TableHead className="text-center">Cancelados</TableHead>
              <TableHead className="text-right">Receita</TableHead>
              <TableHead className="text-center">Tempo Médio</TableHead>
              <TableHead className="text-center">Taxa Sucesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item, index) => {
              const successRate = item.totalAtendimentos > 0 
                ? (item.atendimentosRealizados / item.totalAtendimentos) * 100 
                : 0;

              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-center">{item.totalAtendimentos}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {item.atendimentosRealizados}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.atendimentosCancelados > 0 ? (
                      <Badge variant="destructive">
                        {item.atendimentosCancelados}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.receita)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatTime(item.tempoMedioAtendimento)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={successRate >= 80 ? "default" : successRate >= 60 ? "secondary" : "destructive"}
                    >
                      {successRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RelatorioTable;
