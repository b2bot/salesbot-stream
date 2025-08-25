// /src/components/client-portal/modulo-agenda/ClienteDetalhesPanel.tsx

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, DollarSign, Calendar, Target, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface ClienteDetalhesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: any;
}

const ClienteDetalhesPanel: React.FC<ClienteDetalhesPanelProps> = ({ open, onOpenChange, cliente }) => {
  if (!cliente) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-1/2 lg:w-1/3 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{cliente.nome}</SheetTitle>
          <SheetDescription>
            ID: {cliente.id} - Status: <Badge variant={cliente.status === 'ativo' ? 'default' : 'secondary'}>{cliente.status}</Badge>
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          {/* Dados Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" /> Dados Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>CPF:</strong> {cliente.cpf}</p>
              <p><strong>Data de Nascimento:</strong> {format(new Date(cliente.data_nascimento), 'dd/MM/yyyy')}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>Endereço:</strong> {cliente.endereco}</p>
              <p><strong>Observações:</strong> {cliente.observacoes || 'Nenhuma'}</p>
            </CardContent>
          </Card>

          {/* Histórico Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><DollarSign className="h-5 w-5" /> Histórico Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Total Gasto:</strong> R$ 1.250,00</p>
              <p><strong>Pagamentos Realizados:</strong> 5</p>
              <p><strong>Pagamentos Pendentes:</strong> <Badge variant="destructive">1</Badge></p>
            </CardContent>
          </Card>

          {/* Histórico de Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5" /> Histórico de Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Total de Consultas:</strong> 8</p>
              <p><strong>Compareceu:</strong> 7</p>
              <p><strong>Faltas:</strong> 1</p>
            </CardContent>
          </Card>

          {/* Metas e Documentos */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Target className="h-5 w-5" /> Metas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">(Funcionalidade futura)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Paperclip className="h-5 w-5" /> Anexos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">(Funcionalidade futura)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ClienteDetalhesPanel;