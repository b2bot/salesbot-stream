import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TwoColumnSection from "@/components/sections/TwoColumnSection";

const TabsShowcase = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-6xl">
        <h2 className="sr-only">Navegue pelos principais recursos do B2Bot</h2>

        <div className="flex justify-center">
          <Tabs defaultValue="converse" className="w-full">
            <TabsList className="mx-auto mb-6 flex flex-wrap gap-2 bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="converse" className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg">
                Converse, informe e venda mais
              </TabsTrigger>
              <TabsTrigger value="campanhas" className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg">
                Campanhas personalizadas
              </TabsTrigger>
              <TabsTrigger value="crm" className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg">
                CRM de verdade
              </TabsTrigger>
              <TabsTrigger value="metricas" className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg">
                Métricas que importam
              </TabsTrigger>
            </TabsList>

            <TabsContent value="converse">
              <TwoColumnSection
                title="Converse, informe, e venda mais! Tudo pelo canal que o cliente já usa"
                description="Com o B2Bot, você integra os principais canais em uma plataforma intuitiva, organiza seu funil e facilita a colaboração entre times."
                bullets={[
                  "Atribuição de conversas por atendente ou equipe",
                  "Controle cada conversa em tempo real",
                  "Saiba exatamente onde estão suas oportunidades",
                ]}
                image="/lovable-uploads/9745c2d7-7b87-424a-86ef-47f2562b7a7c.png"
                imageAlt="Plataforma multicanal B2Bot"
              />
            </TabsContent>

            <TabsContent value="campanhas">
              <TwoColumnSection
                flip
                title="Mantenha seus leads engajados e retenha clientes com campanhas personalizadas"
                description="Fluxos por canal, perfil e comportamento com follow-ups automáticos. Zero trabalho repetitivo com mensagens manuais."
                bullets={[
                  "Fluxos personalizados por canal",
                  "Follow-ups automáticos",
                  "Mensagens programadas e segmentadas",
                ]}
                image="/lovable-uploads/06a5320d-12f9-4f48-8b36-c106ba18085f.png"
                imageAlt="Campanhas automáticas"
              />
            </TabsContent>

            <TabsContent value="crm">
              <TwoColumnSection
                title="Pare de usar planilhas. Visualize, acompanhe e converta com um CRM de verdade."
                description="Crie etapas personalizadas, arraste e solte leads entre fases e automatize tarefas repetitivas."
                bullets={[
                  "Cards com histórico, dados e documentos",
                  "Organize leads por etapas",
                  "Crie cards a partir das interações",
                ]}
                image="/lovable-uploads/f53fad4a-6665-4447-8e8d-3e3324d39fd4.png"
                imageAlt="CRM em kanban"
              />
            </TabsContent>

            <TabsContent value="metricas">
              <TwoColumnSection
                flip
                title="Meça o que importa. Melhore o que gera resultado"
                description="Acesse painéis claros para acompanhar desempenho em tempo real por canal, atendente e equipe."
                bullets={["Tempo de resposta", "Volume por canal", "Gargalos no funil"]}
                image="/lovable-uploads/ef0873d1-6907-444a-a292-5ee3fe5e586d.png"
                imageAlt="Relatórios e indicadores"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TabsShowcase;
