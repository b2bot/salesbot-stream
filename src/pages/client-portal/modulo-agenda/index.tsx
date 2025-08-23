
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Star, 
  DollarSign,
  Stethoscope
} from 'lucide-react';
import AgendaView from './agenda';
import RelatoriosView from './relatorios';
import NpsView from './nps';
import FinanceiroView from './financeiro';

const ModuloAgendaIndex: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agenda');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            Módulo Agenda
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão completa de agendamentos médicos e centro cirúrgico
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">+12% vs ontem</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-green-600">+8% vs sem. anterior</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">NPS Médio</p>
                <p className="text-2xl font-bold">8.7</p>
                <p className="text-xs text-green-600">+0.3 vs mês anterior</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Mês</p>
                <p className="text-2xl font-bold">R$ 45.2k</p>
                <p className="text-xs text-green-600">+15% vs mês anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
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
        </TabsList>

        <TabsContent value="agenda" className="space-y-4">
          <AgendaView />
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
      </Tabs>
    </div>
  );
};

export default ModuloAgendaIndex;
