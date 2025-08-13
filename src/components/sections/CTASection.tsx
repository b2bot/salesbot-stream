import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 text-center bg-gradient-to-b from-brand/5 to-transparent">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-inter text-3xl md:text-4xl font-bold">Você está a um clique de transformar atendimento em vendas</h2>
        <p className="mt-3 text-muted-foreground">Fale com um atendente e ganhe acesso a um teste completo, sem cartão e sem enrolação.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button size="lg" variant="hero">Agendar minha demonstração gratuita</Button>
          <Button size="lg" variant="outline">Fale agora com um especialista</Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
