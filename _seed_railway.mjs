import pg from "pg";
const pool = new pg.Pool({ connectionString: "postgresql://postgres:eyPMuCMnMFwFSpPoROHxwmrErbkjbWwV@mainline.proxy.rlwy.net:30667/railway" });

await pool.query(`INSERT INTO products (name, description, price, currency, category, subcategory, image_url, featured, active) VALUES
  ('MauBot MT5 - Scalping Pro', 'Bot de trading automatizado para MetaTrader 5. Estrategia scalping en temporalidades bajas.', '49990', 'CLP', 'trading_scripts', 'mt5_mql5', '/images/maubot-scalping.webp', true, true),
  ('MauBot MT5 - Trend Follower', 'Expert Advisor para MT5 con sistema de seguimiento de tendencia en H1/H4.', '39990', 'CLP', 'trading_scripts', 'mt5_mql5', '/images/maubot-trend.webp', true, true),
  ('Indicador Market Structure', 'Indicador personalizado para detectar cambios de estructura de mercado (BOS/CHoCH).', '19990', 'CLP', 'trading_scripts', 'market_structure', '/images/indicator-ms.webp', true, true),
  ('Pack Indicadores Smart Money', 'Pack completo de indicadores SMC: Order Blocks, FVG, Liquidity Zones.', '29990', 'CLP', 'trading_scripts', 'market_structure', '/images/pack-smc.webp', false, true),
  ('Setup VPS para Trading', 'Servicio de configuracion completa de VPS optimizado para trading 24/7.', '25000', 'CLP', 'digital_service', 'vps_setup', '/images/vps-setup.webp', true, true),
  ('Mentoria Trading 1 Mes', 'Mentoria personalizada de trading durante 1 mes. Incluye sesiones en vivo y seguimiento.', '89990', 'CLP', 'digital_service', 'mentoring', '/images/mentoring.webp', true, true),
  ('MauBot MT5 - Grid Recovery', 'EA con sistema de recuperacion grid para mercados en rango. Gestion de riesgo avanzada.', '59990', 'CLP', 'trading_scripts', 'mt5_mql5', '/images/maubot-grid.webp', false, true),
  ('Mentoria Trading 3 Meses', 'Programa completo de 3 meses. Incluye acceso a comunidad privada y senales.', '199990', 'CLP', 'digital_service', 'mentoring', '/images/mentoring-3m.webp', false, true)
ON CONFLICT DO NOTHING`);

await pool.query(`INSERT INTO blog_posts (title, slug, content, excerpt, published, published_at, author, reading_time_min, tags) VALUES
  ('Introduccion al Trading Algoritmico', 'introduccion-trading-algoritmico', '<h2>Que es el Trading Algoritmico</h2><p>El trading algoritmico utiliza programas informaticos para ejecutar operaciones en los mercados financieros de forma automatizada.</p>', 'Descubre como los algoritmos estan revolucionando el trading moderno.', true, NOW(), 'MauDev', 3, 'trading,algoritmico,mt5'),
  ('Smart Money Concepts Explicado', 'smart-money-concepts-explicado', '<h2>Que es Smart Money</h2><p>Smart Money Concepts (SMC) es una metodologia de analisis tecnico basada en el comportamiento institucional del mercado.</p>', 'Aprende los conceptos fundamentales de Smart Money.', true, NOW(), 'MauDev', 5, 'smc,trading,educacion'),
  ('Como Configurar un VPS para Trading', 'como-configurar-vps-trading', '<h2>Por que necesitas un VPS</h2><p>Un VPS te permite ejecutar tus bots de trading 24/7 sin depender de tu computador personal.</p>', 'Guia paso a paso para configurar tu VPS de trading.', true, NOW(), 'MauDev', 4, 'vps,trading,tutorial'),
  ('Gestion de Riesgo en Trading', 'gestion-riesgo-trading', '<h2>La importancia del Risk Management</h2><p>La gestion de riesgo es el pilar mas importante del trading.</p>', 'Aprende las reglas fundamentales de gestion de riesgo.', true, NOW(), 'MauDev', 4, 'riesgo,trading,educacion')
ON CONFLICT DO NOTHING`);

const products = await pool.query("SELECT count(*) FROM products");
const posts = await pool.query("SELECT count(*) FROM blog_posts");
console.log("Products:", products.rows[0].count, "| Blog posts:", posts.rows[0].count);
await pool.end();
