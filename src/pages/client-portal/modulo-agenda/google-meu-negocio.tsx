import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Star, 
  MapPin,
  MessageCircle,
  Settings,
  TrendingUp,
  Phone,
  Globe,
  Navigation,
  Eye,
  Search,
  Calendar,
  Filter,
  Reply,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data
const mockMetrics = {
  views: { value: 2847, change: 12.5 },
  searches: { value: 1293, change: 8.3 },
  calls: { value: 186, change: -3.2 },
  website: { value: 324, change: 18.7 },
  directions: { value: 427, change: 15.1 }
};

const mockChartData = [
  { date: '01/12', views: 45, searches: 23, calls: 8, website: 12, directions: 15 },
  { date: '02/12', views: 52, searches: 28, calls: 6, website: 15, directions: 18 },
  { date: '03/12', views: 61, searches: 31, calls: 10, website: 18, directions: 22 },
  { date: '04/12', views: 58, searches: 25, calls: 7, website: 14, directions: 19 },
  { date: '05/12', views: 67, searches: 34, calls: 12, website: 21, directions: 25 },
  { date: '06/12', views: 74, searches: 38, calls: 9, website: 19, directions: 28 },
  { date: '07/12', views: 82, searches: 42, calls: 15, website: 24, directions: 31 }
];

const mockReviews = [
  {
    id: 1,
    author: 'Maria Silva',
    rating: 5,
    comment: 'Excelente atendimento! Dra. Ana foi muito atenciosa e esclareceu todas as minhas dúvidas. Recomendo!',
    date: '2024-12-07',
    replied: false
  },
  {
    id: 2,
    author: 'João Santos',
    rating: 4,
    comment: 'Boa clínica, ambiente limpo e organizado. Apenas o tempo de espera foi um pouco longo.',
    date: '2024-12-06',
    replied: true,
    response: 'Obrigado pelo feedback, João! Estamos trabalhando para reduzir o tempo de espera.'
  },
  {
    id: 3,
    author: 'Ana Costa',
    rating: 5,
    comment: 'Profissionais muito competentes e atendimento humanizado. Muito satisfeita com o resultado!',
    date: '2024-12-05',
    replied: false
  }
];

const mockBusinessInfo = {
  name: 'Clínica Saúde & Vida',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  phone: '(11) 3456-7890',
  website: 'https://clinicasaudevida.com.br',
  category: 'Clínica Médica',
  hours: {
    'Segunda': '08:00 - 18:00',
    'Terça': '08:00 - 18:00',
    'Quarta': '08:00 - 18:00',
    'Quinta': '08:00 - 18:00',
    'Sexta': '08:00 - 17:00',
    'Sábado': '08:00 - 12:00',
    'Domingo': 'Fechado'
  }
};

const mockQuestions = [
  {
    id: 1,
    question: 'Vocês atendem por convênio?',
    author: 'Cliente Anônimo',
    date: '2024-12-06',
    answered: false
  },
  {
    id: 2,
    question: 'Qual o horário de funcionamento no sábado?',
    author: 'Cliente Anônimo',
    date: '2024-12-05',
    answered: true,
    answer: 'Funcionamos aos sábados das 08:00 às 12:00.'
  }
];

const DashboardView: React.FC = () => {
  const [dateRange, setDateRange] = React.useState({
    from: new Date(2024, 11, 1),
    to: new Date(2024, 11, 7)
  });

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        <Select defaultValue="todas">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as unidades</SelectItem>
            <SelectItem value="centro">Centro - SP</SelectItem>
            <SelectItem value="vila">Vila Madalena - SP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.views.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockMetrics.views.change > 0 ? "text-green-600" : "text-red-600"}>
                {mockMetrics.views.change > 0 ? '+' : ''}{mockMetrics.views.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buscas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.searches.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockMetrics.searches.change > 0 ? "text-green-600" : "text-red-600"}>
                {mockMetrics.searches.change > 0 ? '+' : ''}{mockMetrics.searches.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ligações</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.calls.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockMetrics.calls.change > 0 ? "text-green-600" : "text-red-600"}>
                {mockMetrics.calls.change > 0 ? '+' : ''}{mockMetrics.calls.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.website.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockMetrics.website.change > 0 ? "text-green-600" : "text-red-600"}>
                {mockMetrics.website.change > 0 ? '+' : ''}{mockMetrics.website.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotas</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.directions.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockMetrics.directions.change > 0 ? "text-green-600" : "text-red-600"}>
                {mockMetrics.directions.change > 0 ? '+' : ''}{mockMetrics.directions.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução das Métricas</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="searches" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="calls" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interações por Tipo</CardTitle>
            <CardDescription>Distribuição dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" />
                  <Bar dataKey="website" fill="hsl(var(--secondary))" />
                  <Bar dataKey="directions" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ReviewsView: React.FC = () => {
  const [replyText, setReplyText] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select defaultValue="todas">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estrelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as avaliações</SelectItem>
            <SelectItem value="5">5 estrelas</SelectItem>
            <SelectItem value="4">4 estrelas</SelectItem>
            <SelectItem value="3">3 estrelas</SelectItem>
            <SelectItem value="2">2 estrelas</SelectItem>
            <SelectItem value="1">1 estrela</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="todas-respostas">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas-respostas">Todas</SelectItem>
            <SelectItem value="respondidas">Respondidas</SelectItem>
            <SelectItem value="nao-respondidas">Não respondidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{review.author}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                    <Badge variant={review.replied ? "default" : "secondary"}>
                      {review.replied ? 'Respondida' : 'Não respondida'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{review.comment}</p>
              
              {review.replied && review.response && (
                <div className="bg-muted p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="h-4 w-4" />
                    <span className="font-medium text-sm">Sua resposta:</span>
                  </div>
                  <p className="text-sm">{review.response}</p>
                </div>
              )}
              
              {!review.replied && (
                <div className="space-y-3">
                  {replyingTo === review.id ? (
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Digite sua resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setReplyingTo(null)}>
                          Enviar Resposta
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReplyingTo(review.id)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BusinessProfileView: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil Comercial</CardTitle>
          <CardDescription>Dados principais da sua empresa no Google</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome da Empresa</label>
                <p className="text-lg">{mockBusinessInfo.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Endereço</label>
                <p className="text-muted-foreground">{mockBusinessInfo.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <p className="text-muted-foreground">{mockBusinessInfo.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Website</label>
                <p className="text-muted-foreground">{mockBusinessInfo.website}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <p className="text-muted-foreground">{mockBusinessInfo.category}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block">Horário de Funcionamento</label>
              <div className="space-y-2">
                {Object.entries(mockBusinessInfo.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-sm">{day}:</span>
                    <span className="text-sm text-muted-foreground">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuestionsView: React.FC = () => {
  const [answerText, setAnswerText] = React.useState('');
  const [answeringTo, setAnsweringTo] = React.useState<number | null>(null);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        {mockQuestions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Pergunta de {question.author}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{question.date}</span>
                    <Badge variant={question.answered ? "default" : "secondary"}>
                      {question.answered ? 'Respondida' : 'Não respondida'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{question.question}</p>
              
              {question.answered && question.answer && (
                <div className="bg-muted p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="h-4 w-4" />
                    <span className="font-medium text-sm">Sua resposta:</span>
                  </div>
                  <p className="text-sm">{question.answer}</p>
                </div>
              )}
              
              {!question.answered && (
                <div className="space-y-3">
                  {answeringTo === question.id ? (
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Digite sua resposta..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setAnsweringTo(null)}>
                          Enviar Resposta
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setAnsweringTo(null);
                            setAnswerText('');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAnsweringTo(question.id)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ConfigurationView: React.FC = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Integração</CardTitle>
          <CardDescription>Conecte sua conta do Google Meu Negócio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium">Status da Conexão</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? 'Conectado ao Google Meu Negócio' : 'Não conectado'}
                </p>
              </div>
            </div>
            <Button 
              variant={isConnected ? "outline" : "default"}
              onClick={() => setIsConnected(!isConnected)}
            >
              {isConnected ? 'Desconectar' : 'Conectar com Google'}
            </Button>
          </div>

          {isConnected && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">API de Desempenho</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Ativa</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">API de Avaliações</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Ativa</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">API de Informações</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Ativa</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">API Q&A</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Ativa</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Última Sincronização</h4>
                <p className="text-sm text-muted-foreground">07/12/2024 às 14:30</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const GoogleMeuNegocioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="px-6 py-4 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Google Meu Negócio</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie sua presença no Google, avaliações e métricas de desempenho
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-card">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="px-6">
            <TabsList className="h-12 w-full justify-start bg-transparent p-0 border-b-0">
              <TabsTrigger 
                value="dashboard" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="avaliacoes" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <Star className="h-4 w-4 mr-2" />
                Avaliações
              </TabsTrigger>
              <TabsTrigger 
                value="perfil" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Perfil Comercial
              </TabsTrigger>
              <TabsTrigger 
                value="perguntas" 
                className="h-12 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none bg-transparent"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Perguntas & Respostas
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
            <TabsContent value="dashboard" className="mt-0 border-0 p-0">
              <DashboardView />
            </TabsContent>

            <TabsContent value="avaliacoes" className="mt-0 border-0 p-0">
              <ReviewsView />
            </TabsContent>

            <TabsContent value="perfil" className="mt-0 border-0 p-0">
              <BusinessProfileView />
            </TabsContent>

            <TabsContent value="perguntas" className="mt-0 border-0 p-0">
              <QuestionsView />
            </TabsContent>

            <TabsContent value="configuracoes" className="mt-0 border-0 p-0">
              <ConfigurationView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default GoogleMeuNegocioPage;