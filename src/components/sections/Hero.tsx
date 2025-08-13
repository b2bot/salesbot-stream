import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/10 to-transparent" />
      <div className="container mx-auto py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="animate-enter">
          <p className="text-sm font-medium text-brand-deep">CRM com WhatsApp, Instagram e Facebook</p>
          <h1 className="mt-3 font-inter text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-transparent">
            Pare de perder vendas no WhatsApp. Transforme conversas em receita.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-prose">
            Centralize seu atendimento, automatize o follow-up e veja sua equipe vender mais, sem o caos de planilhas e mensagens perdidas. O B2Bot é o CRM que organiza seu processo para você focar no que importa: **o cliente**.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="hero">Iniciar teste gratuito</Button>
            <Button size="lg" variant="outline">Agendar demonstração</Button>
          </div>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
            {[
              "Não é necessário cartão",
              "Contatos Ilimitados",
              "API Oficial do WhatsApp Business",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle className="text-brand h-4 w-4" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <img
            src="/lovable-uploads/9745c2d7-7b87-424a-86ef-47f2562b7a7c.png"
            alt="Central de atendimento multicanal do B2Bot"
            className="w-full h-auto rounded-lg shadow-[var(--shadow-elevated)]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
