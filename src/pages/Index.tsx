import SEO from "@/components/SEO";
import Hero from "@/components/sections/Hero";
import FeaturesMatrix from "@/components/sections/FeaturesMatrix";
import TwoColumnSection from "@/components/sections/TwoColumnSection";
import CTASection from "@/components/sections/CTASection";
import Comparison from "@/components/sections/Comparison";
import TabsShowcase from "@/components/sections/TabsShowcase";

const Index = () => {
  return (
    <main>
      <SEO
        title="B2Bot CRM com WhatsApp, Instagram e Facebook"
        description="Domine seus canais, automatize processos e venda mais. CRM integrado ao WhatsApp, Instagram e Facebook."
        canonical="https://b2bot.com.br/crm-com-whatsapp-instagram-e-facebook/"
      />
      <Hero />
      <FeaturesMatrix />
      <TabsShowcase />

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

      <TwoColumnSection
        flip
        title="Mantenha seus leads engajados com campanhas personalizadas"
        description="Fluxos por canal, perfil e comportamento com follow-ups automáticos. Zero trabalho repetitivo com mensagens manuais."
        bullets={[
          "Fluxos personalizados por canal",
          "Follow-ups automáticos",
          "Mensagens programadas e segmentadas",
        ]}
        image="/lovable-uploads/06a5320d-12f9-4f48-8b36-c106ba18085f.png"
        imageAlt="Campanhas automáticas"
      />

      <TwoColumnSection
        title="Pare de usar planilhas. Visualize e converta com um CRM de verdade"
        description="Crie etapas personalizadas, arraste e solte leads entre fases e automatize tarefas repetitivas."
        bullets={[
          "Cards com histórico, dados e documentos",
          "Organize leads por etapas",
          "Crie cards a partir das interações",
        ]}
        image="/lovable-uploads/f53fad4a-6665-4447-8e8d-3e3324d39fd4.png"
        imageAlt="CRM em kanban"
      />

      <TwoColumnSection
        flip
        title="Receba pagamentos direto no WhatsApp"
        description="Envie links de pagamento no chat, receba instantaneamente e registre automaticamente a venda no histórico do cliente."
        bullets={["PIX, Cartões e Boletos", "Envio seguro e rastreável", "Sem sair da conversa"]}
        image="/lovable-uploads/7bc1b7ab-ab21-4f78-b15c-7dd53bd8eb60.png"
        imageAlt="Recebimentos integrados"
      />

      <TwoColumnSection
        title="Meça o que importa. Melhore o que gera resultado"
        description="Acesse painéis claros para acompanhar desempenho em tempo real por canal, atendente e equipe."
        bullets={["Tempo de resposta", "Volume por canal", "Gargalos no funil"]}
        image="/lovable-uploads/ef0873d1-6907-444a-a292-5ee3fe5e586d.png"
        imageAlt="Relatórios e indicadores"
      />

      <Comparison />
      <CTASection />
    </main>
  );
};

export default Index;
