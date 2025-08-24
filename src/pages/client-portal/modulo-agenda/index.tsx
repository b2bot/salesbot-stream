
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
    <div className="min-h-screen bg-background">
      {/* Header com título e subtítulo */}
      <div className="border-b bg-card">
        <div className="px-6 py-4 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Módulo Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Sistema completo de gestão de agendamentos para clínicas e centros médicos
          </p>
        </div>
      </div>

      {/* Navigation Tabs - Estilo idêntico aos outros módulos */}
      <div className="border-b bg-card">
        <Tabs defaultValue="agenda" className="w-full">
          <div className="px-6">
            <TabsList className="h-12 w-full justify-start bg-transparent p-0 border-b-0">
              <TabsTrigger 
                value="agenda" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agenda
              </TabsTrigger>
              <TabsTrigger 
                value="procedimentos" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <Scissors className="h-4 w-4 mr-2" />
                Procedimentos
              </TabsTrigger>
              <TabsTrigger 
                value="relatorios" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger 
                value="nps" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <Star className="h-4 w-4 mr-2" />
                NPS
              </TabsTrigger>
              <TabsTrigger 
                value="financeiro" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger 
                value="configuracoes" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            <TabsContent value="agenda" className="mt-0 border-0 p-0">
              <AgendaView />
            </TabsContent>

            <TabsContent value="procedimentos" className="mt-0 border-0 p-0">
              <ProcedimentosPage />
            </TabsContent>

            <TabsContent value="relatorios" className="mt-0 border-0 p-0">
              <RelatoriosView />
            </TabsContent>

            <TabsContent value="nps" className="mt-0 border-0 p-0">
              <NpsView />
            </TabsContent>

            <TabsContent value="financeiro" className="mt-0 border-0 p-0">
              <FinanceiroView />
            </TabsContent>

            <TabsContent value="configuracoes" className="mt-0 border-0 p-0">
              <ConfiguracoesPage />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ModuloAgendaIndex;
