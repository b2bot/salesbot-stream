import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
// CORREÇÃO: Componentes da tabela adicionados à importação
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, TrendingUp, Users, Clock, Zap, Target, UserCheck, UserX } from 'lucide-react';
import { format, subDays } from 'date-fns';
import RelatorioTable from '@/components/client-portal/modulo-agenda/RelatorioTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as ReBarChart, Pie, PieChart as RePieChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';


// --- PARTE NOVA: COMPONENTE PARA RELATÓRIOS DE CONVERSÃO ---
const RelatorioConversao: React.FC = () => {
    // Mock de dados para os gráficos
    const agendamentosMes = [
        { name: 'Semana 1', agendamentos: 30 },
        { name: 'Semana 2', agendamentos: 45 },
        { name: 'Semana 3', agendamentos: 40 },
        { name: 'Semana 4', agendamentos: 55 }
    ];
    const origemAgendamento = [
        { name: 'WhatsApp', value: 400, fill: 'var(--color-whatsapp)' },
        { name: 'Instagram', value: 300, fill: 'var(--color-instagram)' },
        { name: 'Indicação', value: 200, fill: 'var(--color-indicacao)' },
        { name: 'Outros', value: 100, fill: 'var(--color-outros)' }
    ];
    const rankingProfissionais = [
        { profissional: 'Dr. Carlos Mendes', conversao: 85 },
        { profissional: 'Dra. Ana Costa', conversao: 78 },
        { profissional: 'Dr. José Silva', conversao: 72 },
    ];
    const chartConfig = {
        whatsapp: { label: "WhatsApp", color: "hsl(var(--chart-1))" },
        instagram: { label: "Instagram", color: "hsl(var(--chart-2))" },
        indicacao: { label: "Indicação", color: "hsl(var(--chart-3))" },
        outros: { label: "Outros", color: "hsl(var(--chart-4))" }
    };


    return (
        <div className="space-y-6">
            {/* Filtros para a nova aba */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros de Atendimento e Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Período</Label>
                            <DatePickerWithRange date={{ from: subDays(new Date(), 30), to: new Date() }} onDateChange={() => { }} />
                        </div>
                        <div className="space-y-2">
                            <Label>Profissional</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="dr-carlos">Dr. Carlos Mendes</SelectItem>
                                    <SelectItem value="dra-ana">Dra. Ana Costa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Unidade</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas</SelectItem>
                                    <SelectItem value="centro">Centro</SelectItem>
                                    <SelectItem value="vila-madalena">Vila Madalena</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Origem do Lead</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="indicacao">Indicação</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KPIs de Conversão */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Leads Recebidos</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">1,254</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Taxa de Agendamento</CardTitle><UserCheck className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">75%</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Taxa de No-Show</CardTitle><UserX className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-destructive">12%</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Taxa de Conversão Final</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-primary">60%</div></CardContent>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Evolução de Agendamentos no Mês</CardTitle></CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={agendamentosMes}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="agendamentos" stroke="hsl(var(--primary))" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Origem dos Agendamentos</CardTitle></CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={origemAgendamento} dataKey="value" nameKey="name" innerRadius={50} />
                                </RePieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            {/* Ranking de Profissionais */}
            <Card>
                <CardHeader><CardTitle>Ranking de Profissionais por Taxa de Conversão</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Posição</TableHead>
                                <TableHead>Profissional</TableHead>
                                <TableHead className="text-right">Taxa de Conversão</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankingProfissionais.map((prof, index) => (
                                <TableRow key={prof.profissional}>
                                    <TableCell>{index + 1}º</TableCell>
                                    <TableCell className="font-medium">{prof.profissional}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">{prof.conversao}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL QUE ORGANIZA AS ABAS ---
const RelatoriosView: React.FC = () => {
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 30),
        to: new Date()
    });
    const [groupBy, setGroupBy] = useState<'professional' | 'specialty' | 'insurance' | 'location' | 'day'>('professional');
    const [professionalIds, setProfessionalIds] = useState<string[]>([]);
    const [specialtyIds, setSpecialtyIds] = useState<string[]>([]);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="h-6 w-6" />
                        Relatórios
                    </h2>
                    <p className="text-muted-foreground">
                        Análise detalhada de performance e indicadores
                    </p>
                </div>
            </div>

            <Tabs defaultValue="atendimento_conversao">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="performance_atendimento">Performance de Atendimento</TabsTrigger>
                    <TabsTrigger value="atendimento_conversao">Atendimento e Conversão</TabsTrigger>
                </TabsList>

                {/* Conteúdo da Aba Original */}
                <TabsContent value="performance_atendimento" className="pt-4 space-y-6">
                    {/* Filtros Completos*/}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filtros do Relatório de Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Período</Label>
                                    <DatePickerWithRange
                                        date={dateRange}
                                        onDateChange={setDateRange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Agrupar por</Label>
                                    <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">Profissional</SelectItem>
                                            <SelectItem value="specialty">Especialidade</SelectItem>
                                            <SelectItem value="insurance">Convênio</SelectItem>
                                            <SelectItem value="location">Localização</SelectItem>
                                            <SelectItem value="day">Dia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Profissional (opcional)</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos os profissionais" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os profissionais</SelectItem>
                                            <SelectItem value="dr-silva">Dr. João Silva</SelectItem>
                                            <SelectItem value="dra-santos">Dra. Maria Santos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Especialidade (opcional)</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas as especialidades" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as especialidades</SelectItem>
                                            <SelectItem value="cardiologia">Cardiologia</SelectItem>
                                            <SelectItem value="ortopedia">Ortopedia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                                        <p className="text-2xl font-bold">87.5%</p>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            +5.2% vs período anterior
                                        </p>
                                    </div>
                                    <BarChart3 className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pacientes Únicos</p>
                                        <p className="text-2xl font-bold">342</p>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            +12.3% vs período anterior
                                        </p>
                                    </div>
                                    <Users className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Tempo Médio Consulta</p>
                                        <p className="text-2xl font-bold">32min</p>
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 rotate-180" />
                                            +2min vs período anterior
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-orange-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Taxa Cancelamento</p>
                                        <p className="text-2xl font-bold">4.2%</p>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 rotate-180" />
                                            -1.1% vs período anterior
                                        </p>
                                    </div>
                                    <BarChart3 className="h-8 w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabela de relatório */}
                    {dateRange.from && dateRange.to && (
                        <RelatorioTable
                            startDate={format(dateRange.from, 'yyyy-MM-dd')}
                            endDate={format(dateRange.to, 'yyyy-MM-dd')}
                            groupBy={groupBy}
                            professionalIds={professionalIds}
                            specialtyIds={specialtyIds}
                        />
                    )}
                </TabsContent>

                {/* Conteúdo da Nova Aba */}
                <TabsContent value="atendimento_conversao" className="pt-4">
                    <RelatorioConversao />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RelatoriosView;