// src/components/SEO.tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

const SEO = ({ title, description, canonical }: SEOProps) => {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication', // Mudamos para ser mais específico
    name: 'B2Bot',
    applicationCategory: 'Sales',
    operatingSystem: 'Web',
    description: description,
    offers: {
      '@type': 'Offer',
      price: '0', // Indicar que há um teste gratuito ou plano inicial
      priceCurrency: 'BRL',
    },
    url: 'https://b2bot.com.br/',
    sameAs: [ // Adicionar redes sociais aqui quando tiver
      'https://b2bot.com.br/',
    ],
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
    </Helmet>
  );
};

export default SEO;
