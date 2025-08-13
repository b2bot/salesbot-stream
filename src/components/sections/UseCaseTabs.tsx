import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const cardCls =
  "rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md";

const UseCaseTabs = () => {
  return (
    <section className="py-16 md:py-24" aria-labelledby="use-cases-heading">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8 md:mb-12">
          <p className="text-xs font-medium tracking-wider text-primary uppercase">
            Casos de uso
          </p>
          <h2 id="use-cases-heading" className="text-3xl md:text-4xl font-bold">
            Automatize jornadas de atendimento com resultados reais
          </h2>
        </header>

        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="mx-auto mb-10 flex w-full max-w-full gap-2 overflow-x-auto rounded-full border bg-muted/40 p-2">
            <TabsTrigger value="chatbot" className="rounded-full px-4 data-[state=active]:bg-background">
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="cadencia" className="rounded-full px-4 data-[state=active]:bg-background">
              Cadência
            </TabsTrigger>
            <TabsTrigger value="disparo" className="rounded-full px-4 data-[state=active]:bg-background">
              Disparo em Massa
            </TabsTrigger>
          </TabsList>

          {/* CHATBOT */}
          <TabsContent value="chatbot">
            <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2">
              <article className="space-y-5">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  Chatbot
                </p>
                <h3 className="text-2xl md:text-4xl font-bold">
                  Capture leads, responda dúvidas e resolva problemas 24h sem
                  sobrecarregar sua equipe
                </h3>
                <p className="text-muted-foreground">
                  Com o b2bot, você consegue atender a múltiplos clientes ao mesmo
                  tempo, sem sobrecarregar sua equipe, garantindo respostas rápidas e
                  mantendo a satisfação do cliente em alta.
                </p>
                <Button size="lg" variant="outline" aria-label="Agendar uma demonstração">
                  Agendar uma demonstração
                </Button>
              </article>
              <figure className="relative">
                <img
                  src="/lovable-uploads/15919b58-7474-4015-b6ee-5c5523b04349.png"
                  alt="Fluxo de conversa de chatbot no WhatsApp"
                  loading="lazy"
                  className="mx-auto w-full max-w-md rounded-2xl shadow-lg"
                />
              </figure>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className={cardCls}>
                <h4 className="font-semibold">Programe</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use o chatbot para coletar dados valiosos de clientes e leads, criando
                  perfis completos e permitindo que seu time de vendas foque apenas nas
                  oportunidades mais qualificadas.
                </p>
              </div>
              <div className={cardCls}>
                <h4 className="font-semibold">Automatize</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Automatize interações comuns e respostas frequentes. Isso libera sua
                  equipe de tarefas repetitivas e permite focar no que realmente importa:
                  vendas e suporte estratégico.
                </p>
              </div>
              <div className={cardCls}>
                <h4 className="font-semibold">Personalize</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Envie e receba imagens, vídeos, áudios e documentos para enriquecer a
                  comunicação.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* CADÊNCIA */}
          <TabsContent value="cadencia">
            <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2">
              <article className="space-y-5 order-2 md:order-1">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  Cadência
                </p>
                <h3 className="text-2xl md:text-4xl font-bold">
                  Sequências Automatizadas para manter seus leads e clientes engajados e
                  informados
                </h3>
                <p className="text-muted-foreground">
                  Venda mais e aumente a retenção com cadências inteligentes. Envie
                  lembretes, atualizações e ofertas no momento certo, mantendo seus
                  clientes sempre por perto. Cultive relacionamentos com potenciais
                  clientes através de conteúdos relevantes e oportunos.
                </p>
                <Button size="lg" variant="outline" aria-label="Agendar uma demonstração">
                  Agendar uma demonstração
                </Button>
              </article>
              <figure className="relative order-1 md:order-2">
                <img
                  src="/lovable-uploads/72172f35-680d-41cb-bb80-3f3979224da9.png"
                  alt="Mensagens automáticas de lembretes e cadência"
                  loading="lazy"
                  className="mx-auto w-full max-w-md rounded-2xl shadow-lg"
                />
              </figure>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className={cardCls}>
                <h4 className="font-semibold">Envio Programado</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure séries de mensagens para serem enviadas em horários e datas
                  específicas.
                </p>
              </div>
              <div className={cardCls}>
                <h4 className="font-semibold">Funis de venda multicanal</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crie funis personalizados por atendente, equipe ou serviços para gerir
                  demandas dos clientes. Tudo integrado em suas conversas.
                </p>
              </div>
              <div className={cardCls}>
                <h4 className="font-semibold">Lembretes e Notificações</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Envie lembretes automáticos sobre compromissos, renovações e
                  atualizações importantes.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* DISPARO EM MASSA */}
          <TabsContent value="disparo">
            <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2">
              <article className="space-y-5">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  Disparo em Massa
                </p>
                <h3 className="text-2xl md:text-4xl font-bold">
                  Campanhas e Disparos Personalizados
                </h3>
                <p className="text-muted-foreground">
                  Impulsione suas vendas com disparos em massa no WhatsApp. Atinga o
                  público certo no momento certo, aumentando as chances de conversão com
                  mensagens feitas sob medida.
                </p>
                <Button size="lg" variant="outline" aria-label="Agendar uma demonstração">
                  Agendar uma demonstração
                </Button>
              </article>
              <figure className="relative">
                <img
                  src="/lovable-uploads/1d10b7b6-0158-40fc-9b13-84463af531d7.png"
                  alt="Painel com engajamento e disparos em massa"
                  loading="lazy"
                  className="mx-auto w-full max-w-md rounded-2xl shadow-lg"
                />
              </figure>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className={cardCls}>
                <h4 className="font-semibold">Economize Tempo com Disparos Automatizados</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Programe disparos automáticos para diferentes segmentos de público e
                  mantenha uma comunicação ativa sem esforço manual constante.
                </p>
              </div>
              <div className={cardCls}>
                <h4 className="font-semibold">Alcance Seu Público com Precisão e Eficácia</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Com a API Oficial do WhatsApp, você garante que suas campanhas cheguem
                  diretamente aos clientes. Otimize seu marketing e veja os resultados em
                  tempo real.
                </p>
              </div>
              <div className={cardCls}>
                <h4 className="font-semibold">Resgate Clientes Inativos e Retome Negociações</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Utilize o b2bot para criar campanhas de reengajamento que trazem de
                  volta aqueles que já interagiram com seu negócio, oferecendo promoções
                  exclusivas.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default UseCaseTabs;
