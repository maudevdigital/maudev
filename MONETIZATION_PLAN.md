# Plan de monetización maudev.cl — análisis bajo constraint ad-friendly

## Constraint clave que define todo el análisis

Antes de cualquier evaluación: el constraint real es **solo afiliados que Google Ads y Meta aprueben sin fricción**. Esto descarta de inmediato la ruta "obvia" de hacer ads sobre TradingView Partner, FTMO o cualquier prop firm. Google Ads en 2026 exige verificación de identidad para anunciantes en LATAM y requiere certificación específica para forex/CFDs/derivados; las prop firms operan en zona gris y los anuncios típicamente se rechazan o las cuentas se suspenden tras pocos approvals. Binary options y signal providers están banneados de plano. Resultado: cualquier producto "trading-adjacent" no es viable para campañas pagadas, aunque el match con tu audiencia orgánica sea perfecto.

Bajo ese filtro, la pregunta correcta no es "Semrush sí o no" sino "¿cuál es el SaaS limpio con mejor unit-economics para mis $50-150/mes?". Y ahí Semrush deja de ser la opción default — entra en competencia con Hostinger, Jotform, GetResponse, Systeme.io, Unbounce, LiveChat y otros SaaS B2B/PYME que Google aprueba sin pestañear.

## Verdict corto (revisado)

Semrush **es una opción válida y rentable bajo el constraint ad-friendly**, pero no la más eficiente para tu presupuesto. Con $50-150/mes te conviene priorizar **Hostinger como motor principal de paid ads** y mantener Semrush como pieza secundaria en contenido orgánico de mayor ticket. Para tu audiencia trader nativa (TradingView/FTMO), la ruta es 100% orgánica — blog, SEO, sin tocar Google Ads.

El cuello de botella sigue siendo el mismo: tu sitio no tiene tracking de conversiones activo. Sin GA4 + event tracking en clicks de afiliados, cualquier campaña paga es ciega.

## Lo que ya tienes en maudev.cl

Revisé el repo y confirmo el estado: AdSense ya está integrado (cliente `ca-pub-9062385247942411`), tienes JSON-LD de Organization y Blog, sitemap implícito vía rutas, blog funcional con `<AdSlotAuto />`, OG tags y SEO básico decente. La integración con Clerk + Flow.cl + Resend está sólida. Sin embargo, **Google Analytics 4 está comentado** en `artifacts/maudev/index.html` (placeholder `G-XXXXXXXXXX`), igual que Facebook Pixel. Esto es un bloqueador serio: no podemos pagar ads sin medir conversiones. Cualquier dólar invertido sin tracking es un dólar a ciegas.

No detecté ningún link de afiliado existente en el código — es un terreno limpio para diseñar el stack desde cero.

## Comparativa segmentada — afiliados ad-friendly vs solo orgánico

### Tier paid-ads-friendly (lo que sirve para tu presupuesto de $50-150/mes)

**Hostinger** — la opción de mejor unit-economics para tu caso. Comisión 40% que escala a 60% por volumen, mínimo payout $100 PayPal, cookie 30 días. Confirma elegibilidad de LATAM para los tiers Super/Elite. Producto barato (planes desde $2.99/mes) significa decisión de compra rápida, alta tasa de conversión y CPC accesible. Comisión promedio por venta de plan anual: $40-100. Match con tu audiencia: tus clientes de servicios de desarrollo (landing pages, fullstack) necesitan hosting — un upsell natural que además te posiciona como recomendador confiable.

**Semrush** (vía Impact.com) — $200 USD flat por sale + $10 por trial activado, cookie de 120 días, último-click. Ticket alto pero audiencia más nicho (SEOs, agencias, marketers). En español-LATAM los head-keywords están dominados por review-sites con DR 70+. CPC español-LATAM en SaaS marketing ~$1.00-3.50. Conv cold-ad → trial 2-5%, trial → paid 10-15%. Realidad: una venta cubre 80% de Claude Pro anual de un solo golpe, pero la frecuencia es baja. Funciona mejor como **secundario en blog evergreen** ("auditar SEO de tu landing page", "keywords para servicios digitales") combinado con Hostinger en el mismo post.

**Jotform** — 30% recurring sobre cada suscripción, cookie 60 días. Producto de formularios, audience B2B/freelance amplia, ad-friendly absoluto. Comisión recurring acumula ingreso pasivo a 12-24 meses.

**GetResponse** — 33% recurring o $100 flat por sale (CPA), cookie 120 días. Email marketing, ad-friendly, audiencia overlap con tus clientes de marketing/landing.

**Unbounce** — 20% recurring lifetime, cookie 120 días. Match exacto con tu servicio "landing pages": si vendes landings custom, podés derivar a Unbounce a quienes prefieren self-service. Comisión recurring suma a tu MRR.

**Systeme.io** — 60% recurring lifetime, sin tope de tiempo. Plataforma all-in-one para infoproductos. Ad-friendly y match con audiencia de emprendedores LATAM.

**LiveChat (Text)** — 20% lifetime, sube a 22% tras 5 customers. Explícitamente permite paid ads en sus términos.

### Tier solo-orgánico (no encender ads — match audiencia, riesgo policy)

**TradingView Partner Program** — 30% comisión sobre primera compra + $15 al referido, cookie 90 días. Match audiencia 10/10. Embedearlo en cada post de Pine Script es no-brainer, pero **no pagar ads contra esto**: Google flagea contenido "trading platform" con frecuencia y el costo de cuenta suspendida no compensa.

**FTMO** — tier Starter 5%, Pro 10%, Premier 15%, sobre challenge fees $200-$400. Comisión $10-60 por venta. **Solo orgánico**: las prop firms están en zona gris de Google Ads (clasificadas como "financial trading services" sin certificación clara), las cuentas se suspenden. Tu blog SEO sí lo soporta sin problema.

**PineConnector / Pineify** — nicho perfecto para tu audiencia, comisiones 20-30% recurring. Solo orgánico, mismo razonamiento.

**Brokers regulados (OANDA, IC Markets)** — payouts altos pero requieren certificación Google + restricciones geográficas + tu landing tiene que pasar review. No vale la pena con tu presupuesto y fase actual.

## Math de break-even — escenarios paid-ads bajo el constraint

Con $100/mes promedio en Google Ads y meta $240/año para Claude Pro (~$20/mes), necesitás cualquier número positivo de comisiones netas para cubrir la meta. Para escalar hacia Claude Max ($100-200/mes) querés $200-300/mes en comisiones netas. Estos son los escenarios realistas con productos ad-friendly:

**Escenario A — Hostinger (ruta más rápida)**: CPC promedio en español-LATAM para "hosting barato", "mejor hosting wordpress", "como crear sitio web" ~$0.30-1.20. Con $100/mes en ads = 80-330 clicks. Tasa conv hosting (producto cheap, alta urgencia): 3-6% = entre 3 y 20 ventas. Comisión promedio plan anual ~$50. Range esperado: $150-1000/mes en ventas, después de optimización 2-3 meses. **Probabilidad de cubrir Claude Pro mes 2 en adelante: alta**.

**Escenario B — Semrush solo (ruta lenta de ticket alto)**: CPC ~$1.00-3.50 para keywords core. Con $100/mes = 30-100 clicks. Trial conv 2-5% = 1-5 trials × $10 = $10-50. Trial → paid 10-15% = ~0.3 sales mensuales × $200 = $60. Range esperado: $20-150/mes inicialmente, $100-300/mes con contenido orgánico complementario. **Probabilidad mes 1-3: media. Mes 6+: alta pero volátil** (depende de cerrar 1 sale puntual cada mes).

**Escenario C — Mix Hostinger 70% + Semrush 30%** (recomendado): Hostinger captura volumen y velocidad; Semrush captura tickets altos cuando un visitante orgánico (no-paid) hace match con el ICP. Sumás recurring de Jotform/Unbounce/Systeme en blog para ingreso pasivo. Range esperado: $150-500/mes a partir del mes 2-3. **Esta es la ruta que recomiendo**.

**Escenario D — TradingView + FTMO orgánico apilado** (capa adicional): tu blog ya habla a esa audiencia. Cero ads pagados, 100% SEO. 5 referidos TV/mes × $10 + 2 FTMO/mes × $30 = ~$110/mes pasivo después de 3-6 meses de contenido. Suma a cualquier escenario anterior sin riesgo policy.

El cálculo honesto: con $50-150/mes y sin tracking aún instalado, esperá 4-8 semanas para ROAS positivo. La aceleración es viable pero no instantánea — el primer mes es construcción, el segundo es lectura de datos, del tercero en adelante es optimización.

## Recomendación concreta (revisada bajo constraint ad-friendly)

Tu setup óptimo es un stack en dos canales paralelos: **paid ads** apuntando a productos ad-friendly + **orgánico SEO** apuntando a tu audiencia trader nativa. No mezclar.

**Canal Paid Ads — orden de prioridad de aplicación**:
1. **Hostinger Affiliate** — aplicá hoy (link `hostinger.com/affiliates`). Aprobación 1-3 días. Va a ser tu motor principal de comisiones por velocidad y CV%.
2. **Semrush** (Impact.com) — ya estás en onboarding, completá. Se complementa con Hostinger en mismo blog post tipo "cómo lanzar tu landing page de servicios" (Hostinger CTA primario, Semrush CTA secundario para auditoría).
3. **Unbounce** — match exacto con tu servicio "landing pages". Aplicá tras Hostinger.
4. **Jotform / GetResponse / Systeme.io** — sumá uno de estos para componente recurring. Mi pick si tenés que elegir uno: GetResponse por flexibilidad (33% recurring O $100 flat).

**Canal Orgánico — solo blog SEO, sin ads**:
1. **TradingView Partner** — link en cada post de Pine Script + footer del blog.
2. **FTMO Affiliate** — CTA en posts de estrategias/money management.
3. **PineConnector / Pineify** — cuando publiques contenido de automatización TV → MT5.
4. **AdSense** — ya está, optimizá el placement (no más de 2 unidades por pantalla, no encima del fold en mobile).

**Roadmap de ads pagados** (importante: en orden):
1. Semana 1: GA4 instalado + componente `<AffiliateLink>` con event tracking + Hostinger aprobado.
2. Semana 2: 2 artículos publicados con Hostinger nativo + Google Search Console verificado.
3. Semana 3: Primera campaña Google Ads con $30-50 sobre 5-10 keywords de cola larga ("contratar landing page chile", "hosting wordpress argentina barato", "como hacer página web para emprendimiento").
4. Semana 4: Lectura de data, kill keywords con CTR < 1.5% o CV% bajo.
5. Mes 2+: si ROAS > 1.5x, escalar gradual hasta tu cap de $150/mes. Si no, iterar landing.

## Bloqueadores técnicos que hay que resolver

Antes de gastar el primer dólar en ads, hay que resolver:

**Tracking analytics**: descomentar el bloque de GA4 en `artifacts/maudev/index.html` y poner un Measurement ID real. Sin GA4 (o equivalente) no hay manera de saber qué tráfico convierte. Igual con Facebook Pixel si vas a hacer ads en Meta.

**Tracking de eventos en clicks afiliados**: cuando un visitante hace click en un link de TradingView Partner, hay que disparar un evento `affiliate_click` con parámetros (programa, ubicación en el sitio). Esto se hace con `gtag('event', ...)` y permite attribution real.

**Componente reusable de affiliate link**: no hardcodear UTMs por todos lados. Crear `<AffiliateLink program="tradingview" placement="blog-post-bottom" />` que arme el link, dispare el evento y abra en nueva pestaña con `rel="sponsored noopener"`.

**Disclosure legal**: bajo legislación chilena (Ley 19.628) y mejores prácticas, los links de afiliado deberían declararse. Una banda discreta "Algunos links de este artículo son afiliados" en el footer del blog basta.

**Velocidad del sitio**: no pude medir maudev.cl directamente desde acá (la sandbox tiene allowlist restrictivo de dominios). Recomiendo ejecutar PageSpeed Insights manualmente en `https://pagespeed.web.dev/?url=maudev.cl` y mirar especialmente LCP, INP y CLS — son los Core Web Vitals que afectan tanto Google Ads Quality Score como SEO orgánico. Vite + React con bundle splitting suele dar buenos números, pero las fonts de Google Fonts cargadas vía `<link>` blocking y AdSense pueden penalizar LCP. Si tu LCP está sobre 2.5s o INP sobre 200ms, eso baja tu Quality Score en Google Ads y te sube el CPC efectivo — afecta directo a la rentabilidad.

## Sobre la "API de Semrush" para conversiones

Aclaración importante: Semrush tiene dos APIs distintas y vale la pena no confundirlas. La **API de datos de Semrush** (la pública) sirve para consultar keywords, dominios, backlinks — es para SEO research, no para tracking de conversiones de afiliado. El tracking del programa de afiliados se hace a través de **Impact.com**, que es la plataforma donde estás ahora mismo en el screenshot. Impact tiene su propio panel donde generás tracking links, ves clicks, conversiones y comisiones — no se necesita "conectar" nada vía API para que funcionen las conversiones; basta con usar los links que Impact te genera.

Lo que sí podemos automatizar más adelante (cuando ya tengas volumen): la **Impact.com Partner API** permite traer reporting de conversiones a tu propio dashboard y armar lógica de optimización. Pero para tu fase actual (presupuesto bajo, sin tracking aún en el sitio), agregar esa capa es prematuro — primero conversion tracking básico, después automatización.

## Próximo paso recomendado

Completá el onboarding de Semrush/Impact (te quedan 2 minutos, no perdés nada por dejarlo abierto), aplicá en paralelo a **Hostinger Affiliate** que va a ser tu motor de paid ads, e instalá tracking en maudev.cl antes de tirar el primer dólar a Google Ads. El orden de mayor impacto: instalar GA4 + componente `<AffiliateLink>` con event tracking, aprobar Hostinger + completar Semrush, publicar 2-3 artículos evergreen con afiliados nativos ("cómo lanzar tu landing page de servicios" combinando Hostinger + Semrush + Unbounce), y solo después encender Google Ads con $30-50/mes en cola larga.

Si querés, te arranco ya con la implementación técnica del tracking en el repo (descomentar GA4, crear el componente `<AffiliateLink>` con event tracking, y agregar disclosure legal de afiliados en footer). Es lo único que está bloqueando el resto del plan.
