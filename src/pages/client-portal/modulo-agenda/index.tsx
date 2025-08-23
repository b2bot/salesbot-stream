
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  Star, 
  DollarSign,
  Scissors
} from 'lucide-react';
import AgendaView from './agenda';
import RelatoriosView from './relatorios';
import NpsView from './nps';
import FinanceiroView from './financeiro';
import ConfiguracoesPage from './configuracoes';
import ProcedimentosPage from './procedimentos';

const ModuloAgendaIndex: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Módulo Agenda</h1>
        <p className="text-muted-foreground">
          Sistema completo de gestão de agendamentos para clínicas e centros médicos
        </p>
      </div>

      <Tabs defaultValue="agenda" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="procedimentos" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Procedimentos
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="nps" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            NPS
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-4">
          <AgendaView />
        </TabsContent>

        <TabsContent value="procedimentos" className="space-y-4">
          <ProcedimentosPage />
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <RelatoriosView />
        </TabsContent>

        <TabsContent value="nps" className="space-y-4">
          <NpsView />
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <FinanceiroView />
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <ConfiguracoesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuloAgendaIndex;
