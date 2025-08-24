import React, { useState } from 'react';
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
  XCircle,
  Building2,
  Clock,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  useGoogleBusinessAuth,
  useGoogleBusinessMetrics,
  useGoogleBusinessReviews,
  useGoogleBusinessInfo,
  useGoogleBusinessQuestions
} from '@/hooks/client-portal/modulo-agenda/useGoogleBusiness';

const DashboardView: React.FC = () => {
  const { metrics, chartData, loading: metricsLoading, refetch: refetchMetrics } = useGoogleBusinessMetrics();
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 11, 1),
    to: new Date(2024, 11, 7)
  });

  if (metricsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select defaultValue="7days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
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
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.views.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics?.views.change && metrics.views.change > 0 ? "text-green-600" : "text-red-600"}>
                {metrics?.views.change && metrics.views.change > 0 ? '+' : ''}{metrics?.views.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Buscas</CardTitle>
            <Search className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.searches.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics?.searches.change && metrics.searches.change > 0 ? "text-green-600" : "text-red-600"}>
                {metrics?.searches.change && metrics.searches.change > 0 ? '+' : ''}{metrics?.searches.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Ligações</CardTitle>
            <Phone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.calls.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics?.calls.change && metrics.calls.change > 0 ? "text-green-600" : "text-red-600"}>
                {metrics?.calls.change && metrics.calls.change > 0 ? '+' : ''}{metrics?.calls.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Site</CardTitle>
            <Globe className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.website.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics?.website.change && metrics.website.change > 0 ? "text-green-600" : "text-red-600"}>
                {metrics?.website.change && metrics.website.change > 0 ? '+' : ''}{metrics?.website.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Rotas</CardTitle>
            <Navigation className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics?.directions.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics?.directions.change && metrics.directions.change > 0 ? "text-green-600" : "text-red-600"}>
                {metrics?.directions.change && metrics.directions.change > 0 ? '+' : ''}{metrics?.directions.change}%
              </span> vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Evolução das Métricas</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="searches" stroke="hsl(var(--accent))" strokeWidth={2} />
                  <Line type="monotone" dataKey="calls" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Interações por Tipo</CardTitle>
            <CardDescription>Distribuição dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" />
                  <Bar dataKey="website" fill="hsl(var(--accent))" />
                  <Bar dataKey="directions" fill="hsl(var(--secondary))" />
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
  const { reviews, loading, replyToReview, refetch } = useGoogleBusinessReviews();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    
    await replyToReview(reviewId, replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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

      {/* Reviews List - Compact Layout */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id} className="border-l-4 border-l-primary/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{review.author}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                  <Badge variant={review.replied ? "default" : "secondary"}>
                    {review.replied ? 'Respondida' : 'Não respondida'}
                  </Badge>
                </div>
                {!review.replied && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setReplyingTo(review.id)}
                    className="ml-4"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Responder
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
              
              {review.replied && review.response && (
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Reply className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm text-primary">Sua resposta:</span>
                  </div>
                  <p className="text-sm">{review.response}</p>
                </div>
              )}
              
              {replyingTo === review.id && (
                <div className="space-y-3 mt-3 pt-3 border-t">
                  <Textarea 
                    placeholder="Digite sua resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReply(review.id)}>
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
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BusinessProfileView: React.FC = () => {
  const { info, loading, updateInfo } = useGoogleBusinessInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    category: ''
  });

  React.useEffect(() => {
    if (info) {
      setEditForm({
        name: info.name,
        address: info.address,
        phone: info.phone,
        website: info.website,
        category: info.category
      });
    }
  }, [info]);

  const handleSave = async () => {
    await updateInfo(editForm);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              <div>
                <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Dados principais da sua empresa no Google</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Nome da Empresa</Label>
                <p className="text-lg font-semibold text-foreground">{info?.name}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Categoria</Label>
                <p className="text-muted-foreground">{info?.category}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Telefone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <p className="text-muted-foreground">{info?.phone}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Website</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <p className="text-muted-foreground truncate">{info?.website}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Endereço</Label>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <p className="text-muted-foreground">{info?.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hours Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {info && Object.entries(info.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-foreground">{day}</span>
                  <span className={`text-sm ${hours === 'Fechado' ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Perfil Comercial</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu perfil no Google Meu Negócio
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const QuestionsView: React.FC = () => {
  const { questions, loading, answerQuestion } = useGoogleBusinessQuestions();
  const [answerText, setAnswerText] = useState('');
  const [answeringTo, setAnsweringTo] = useState<string | null>(null);

  const handleAnswer = async (questionId: string) => {
    if (!answerText.trim()) return;
    
    await answerQuestion(questionId, answerText);
    setAnsweringTo(null);
    setAnswerText('');
  };

  const unansweredQuestions = questions.filter(q => !q.answered);
  const answeredQuestions = questions.filter(q => q.answered);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((col) => (
            <div key={col} className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-12 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unanswered Questions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Perguntas Pendentes</h3>
            <Badge variant="secondary">{unansweredQuestions.length}</Badge>
          </div>
          
          {unansweredQuestions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma pergunta pendente</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {unansweredQuestions.map((question) => (
                <Card key={question.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-foreground mb-1">{question.question}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{question.author}</span>
                          <span>•</span>
                          <span>{question.date}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Não respondida
                      </Badge>
                    </div>
                    
                    {answeringTo === question.id ? (
                      <div className="space-y-3 pt-3 border-t">
                        <Textarea 
                          placeholder="Digite sua resposta..."
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAnswer(question.id)}>
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
                        className="mt-2"
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Answered Questions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Perguntas Respondidas</h3>
            <Badge variant="default">{answeredQuestions.length}</Badge>
          </div>
          
          {answeredQuestions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma pergunta respondida ainda</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {answeredQuestions.map((question) => (
                <Card key={question.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-foreground mb-1">{question.question}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{question.author}</span>
                          <span>•</span>
                          <span>{question.date}</span>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        Respondida
                      </Badge>
                    </div>
                    
                    {question.answer && (
                      <div className="bg-muted p-3 rounded-lg mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Reply className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm text-primary">Sua resposta:</span>
                        </div>
                        <p className="text-sm">{question.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfigurationView: React.FC = () => {
  const { auth, loading, connect, disconnect } = useGoogleBusinessAuth();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuração de Integração
          </CardTitle>
          <CardDescription>
            Conecte sua conta do Google para acessar os dados do Google Meu Negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${auth.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium text-foreground">
                  Status da Conexão: {auth.connected ? 'Conectado' : 'Não conectado'}
                </p>
                {auth.connected && auth.email && (
                  <p className="text-sm text-muted-foreground">
                    Conta: {auth.email}
                  </p>
                )}
                {auth.lastSync && (
                  <p className="text-sm text-muted-foreground">
                    Última sincronização: {new Date(auth.lastSync).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {auth.connected ? (
                <Button 
                  variant="destructive" 
                  onClick={disconnect}
                  disabled={loading}
                >
                  {loading ? 'Desconectando...' : 'Desconectar'}
                </Button>
              ) : (
                <Button 
                  onClick={connect}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Conectando...' : 'Conectar com Google'}
                </Button>
              )}
            </div>
          </div>

          {!auth.connected && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Como conectar:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Clique em "Conectar com Google"</li>
                <li>2. Faça login na sua conta Google</li>
                <li>3. Autorize o acesso aos dados do Google Meu Negócio</li>
                <li>4. Aguarde a confirmação da conexão</li>
              </ol>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Recursos Disponíveis:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Métricas de desempenho</li>
                <li>• Gerenciamento de avaliações</li>
                <li>• Informações do perfil comercial</li>
                <li>• Perguntas e respostas</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Permissões Necessárias:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Visualizar dados do perfil</li>
                <li>• Responder avaliações</li>
                <li>• Gerenciar informações</li>
                <li>• Responder perguntas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const GoogleMeuNegocio: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="border-b">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Google Meu Negócio</h1>
              <p className="text-muted-foreground">
                Gerencie sua presença online e acompanhe métricas do Google Business Profile
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Perguntas
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardView />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ReviewsView />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <BusinessProfileView />
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <QuestionsView />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <ConfigurationView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GoogleMeuNegocio;