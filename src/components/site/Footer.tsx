const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Plataforma</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Atendimento</li>
            <li>CRM</li>
            <li>Chatbot</li>
            <li>Campanhas</li>
            <li>Cadência</li>
            <li>Recebimentos</li>
            <li>Indicadores</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Integrações</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Integração N8N</li>
            <li>Integração Make</li>
            <li>Webhook e API</li>
            <li>Integrações Personalizadas</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Soluções</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Pré-vendas</li>
            <li>Vendas</li>
            <li>Suporte</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Institucional</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Nossos Planos</li>
            <li>Trabalhe Conosco</li>
            <li>Fale Conosco</li>
            <li>Política de Privacidade</li>
            <li>Termos de Uso</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Recursos</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Blog</li>
            <li>Guias e e-books</li>
            <li>Perguntas Frequentes</li>
            <li>Materiais Gratuitos</li>
            <li>Glossário</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Ferramentas</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Calculadora de preços do WhatsApp</li>
            <li>Gerador de links do WhatsApp</li>
            <li>Gerador de botões do WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} B2Bot. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
