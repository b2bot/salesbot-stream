
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Stethoscope, 
  Users, 
  BarChart3,
  Star,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { ClientPortalProvider } from '@/providers/ClientPortalProvider';

const Index = () => {
  const navigate = useNavigate();

  const navigateToAgenda = () => {
    navigate('/client-portal/modulo-agenda');
  };

  return (
    <ClientPortalProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Stethoscope className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">Sistema de Gestão Médica</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Portal completo para gestão de clínicas e centros médicos com agenda inteligente, 
              relatórios avançados e integração financeira.
            </p>
          </div>

          {/* Main Module Card */}
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  Módulo de Agenda Médica
                </CardTitle>
                <p className="text-muted-foreground">
                  Sistema completo de agendamento com calendário interativo, check-in/check-out, 
                  relatórios e análise NPS
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Agenda Dinâmica</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Check-in Digital</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Relatórios</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">Sistema NPS</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-blue-600/80">Consultas esta semana</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8.7</div>
                    <div className="text-sm text-green-600/80">NPS Score médio</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">R$ 45.2k</div>
                    <div className="text-sm text-purple-600/80">Receita mensal</div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center pt-4">
                  <Button 
                    onClick={navigateToAgenda}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium"
                  >
                    Acessar Módulo de Agenda
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Agenda Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualização completa com filtros por profissional, especialidade, 
                  convênio e localização. Suporte a múltiplas agendas simultâneas.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Relatórios Avançados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Análises detalhadas de performance, taxa de ocupação, 
                  tempo médio de consulta e exportação para Excel.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Integração Financeira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mockup de integração com contas a pagar/receber, 
                  rateios por profissional e projeções de receita.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Módulo desenvolvido seguindo os padrões arquiteturais do Portal do Cliente
            </p>
          </div>
        </div>
      </div>
    </ClientPortalProvider>
  );
};

export default Index;
