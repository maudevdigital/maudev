import { Helmet } from "react-helmet-async";

const SITE_NAME = "MauDev";
const SITE_URL = "https://maudev.cl";
const DEFAULT_DESCRIPTION = "Plataforma chilena de herramientas de trading: indicadores Pine Script para TradingView, scripts MQL5 para MetaTrader 5, y servicios de desarrollo digital.";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;

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
  /** Emoji or text shown before the title in the browser tab */
  tabPrefix?: string;
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
  tabPrefix,
}: SEOHeadProps) {
  const baseTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Indicadores de Trading, Pine Script & Herramientas MT5`;
  const fullTitle = tabPrefix ? `${tabPrefix} ${baseTitle}` : baseTitle;
  const canonicalUrl = canonical || `${SITE_URL}${window.location.pathname}`;
  const image = ogImage || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#0D0D0D" />
      <meta name="msapplication-TileColor" content="#00D4FF" />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={baseTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={baseTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

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