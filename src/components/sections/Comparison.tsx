const Comparison = () => {
  const sem = [
    "Respostas demoradas no WhatsApp",
    "Atendimento limitado ao horário comercial",
    "Equipe sobrecarregada com tarefas repetitivas",
    "Clientes desistindo por falta de retorno",
    "Zero controle sobre quem atendeu o quê",
    "Leads perdidos por falta de follow-up",
    "Campanhas manuais que não engajam",
    "Informações espalhadas entre planilhas e apps",
    "Nenhum dado pra tomar decisão com segurança",
  ];

  const com = [
    "Respostas automáticas e atendimento 24/7",
    "Equipe focada no que realmente gera vendas",
    "Auto distribuição de conversas por atendente",
    "Fluxos automáticos de follow-up e engajamento",
    "CRM visual com histórico de cada cliente",
    "Campanhas personalizadas com alta taxa de abertura",
    "Rastreabilidade de leads da origem até a conversão",
    "Painéis claros de desempenho por canal e equipe",
    "Tudo em um só lugar, fácil, integrado e escalável",
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card/50 p-6 opacity-75">
            <h3 className="font-semibold mb-4">Sem o B2Bot, o caos vira rotina:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              {sem.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border-2 border-brand/50 bg-card p-6 shadow-lg">
            <h3 className="font-semibold mb-4 text-brand">Com o B2Bot, a eficiência vira padrão:</h3>
            <ul className="space-y-2 text-sm text-foreground list-disc pl-5">
              {com.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
