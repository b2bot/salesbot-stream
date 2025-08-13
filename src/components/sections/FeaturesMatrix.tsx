import { CheckCircle } from "lucide-react";

const features = [
  { title: "Ative automações", description: "Crie fluxos de trabalho que economizam tempo e garantem que nenhum lead seja esquecido.", img: "/lovable-uploads/ec20a794-2a6d-453b-942b-cbc9f0738b34.png" },
  { title: "Chatbots Inteligentes", description: "Qualifique leads 24/7. Nossos chatbots respondem dúvidas, coletam dados e direcionam as melhores oportunidades para sua equipe.", img: "/lovable-uploads/adc248f7-67c6-496e-9e8e-982b8d877118.png" },
  { title: "Disparos em Massa", description: "Envie campanhas e notificações para milhares de contatos de uma só vez, com a segurança da API Oficial do WhatsApp.", img: "/lovable-uploads/ef0873d1-6907-444a-a292-5ee3fe5e586d.png" },
  { title: "Capture dados de leads", description: "Centralize informações importantes dos seus clientes automaticamente e tenha tudo à mão para uma abordagem de vendas eficaz.", img: "/lovable-uploads/3e8af0ba-5746-4f06-b6cc-a7bd0f1be45a.png" },
  { title: "Follow-up inteligente", description: "Programe sequências de mensagens para nutrir seus leads e garantir que nenhuma oportunidade de venda seja perdida por falta de contato.", img: "/lovable-uploads/06a5320d-12f9-4f48-8b36-c106ba18085f.png" },
  { title: "Funis de venda multicanal", description: "Organize seu processo de vendas em um funil visual e intuitivo, acompanhando cada lead da prospecção ao fechamento.", img: "/lovable-uploads/f53fad4a-6665-4447-8e8d-3e3324d39fd4.png" },
];

const FeaturesMatrix = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto text-center max-w-5xl">
        <h2 className="font-inter text-3xl md:text-4xl font-bold">
          Domine seus canais. <span className="text-brand">Automatize</span> processos. Venda mais.
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article key={f.title} className="rounded-xl border bg-card p-6 text-left hover:shadow-md transition-shadow">
              <img src={f.img} alt={f.title} loading="lazy" className="h-28 w-auto mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </article>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          {["Envie lembretes automáticos", "Receba pagamentos", "Análise de Performance"].map((b) => (
            <li key={b} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-brand" /> {b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturesMatrix;
