import { Helmet } from "react-helmet-async";

const SITE_NAME = "MauDev";
const SITE_URL = "https://maudev.cl";
const DEFAULT_DESCRIPTION = "Plataforma chilena de herramientas de trading: indicadores Pine Script para TradingView, scripts MQL5 para MetaTrader 5, y servicios de desarrollo digital.";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Indicadores de Trading, Pine Script & Herramientas MT5`;
  const canonicalUrl = canonical || `${SITE_URL}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_CL" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}