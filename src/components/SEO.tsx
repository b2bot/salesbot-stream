import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

const SEO = ({ title, description, canonical }: SEOProps) => {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'B2Bot',
    url: 'https://b2bot.com.br/',
    sameAs: [
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
