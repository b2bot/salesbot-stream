import { CheckCircle } from "lucide-react";

const features = [
  { title: "Ative automações", img: "/lovable-uploads/ec20a794-2a6d-453b-942b-cbc9f0738b34.png" },
  { title: "Chatbots Inteligentes", img: "/lovable-uploads/adc248f7-67c6-496e-9e8e-982b8d877118.png" },
  { title: "Disparos em Massa", img: "/lovable-uploads/ef0873d1-6907-444a-a292-5ee3fe5e586d.png" },
  { title: "Capture dados de leads", img: "/lovable-uploads/3e8af0ba-5746-4f06-b6cc-a7bd0f1be45a.png" },
  { title: "Follow-up inteligente", img: "/lovable-uploads/06a5320d-12f9-4f48-8b36-c106ba18085f.png" },
  { title: "Funis de venda multicanal", img: "/lovable-uploads/f53fad4a-6665-4447-8e8d-3e3324d39fd4.png" },
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
              <p className="text-sm text-muted-foreground">Automatize seus fluxos e aumente a conversão com eficiência.</p>
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
