import { Bot, Cpu, RefreshCw } from "lucide-react";
import { t } from "@/lib/i18n";

export const N8N_PRODUCTS = [
  {
    id: "whatsapp-bot-n8n",
    badge: t("Más Popular · Meta Ads Ready", "Most Popular · Meta Ads Ready"),
    icon: Bot,
    name: t("Pack WhatsApp AI Qualifying Bot", "WhatsApp AI Qualifying Bot Pack"),
    priceCLP: "$49.000",
    priceUSD: "$49 USD",
    period: t("Pago único", "One-time payment"),
    description: t(
      "Workflow completo en n8n que recibe leads de Meta Ads o formularios, los califica por WhatsApp usando OpenAI/Claude y los sincroniza a Supabase/CRM.",
      "Complete n8n workflow that captures leads from Meta Ads/forms, qualifies them via WhatsApp using OpenAI/Claude, and syncs to Supabase/CRM."
    ),
    features: [
      t("Flujo `.json` listo para importar en n8n", "Ready-to-import `.json` workflow for n8n"),
      t("Calificación inteligente por IA (OpenAI / Claude)", "AI Smart Qualification (OpenAI / Claude)"),
      t("Integración oficial con WhatsApp Business Cloud API", "Official WhatsApp Business Cloud API integration"),
      t("Sincronización a Supabase, Google Sheets o CRM", "Sync to Supabase, Google Sheets or CRM"),
      t("Notificaciones instantáneas a Slack / Telegram", "Instant Slack / Telegram notifications"),
      t("Soporte de despliegue de 7 días incluido", "7-day deployment support included"),
    ],
    checkoutUrlCLP: null, // Si es null abre el modal de registro y confirmación previa
    checkoutUrlUSD: null,
    featured: true,
  },
  {
    id: "auto-invoicing-n8n",
    badge: t("Automatización Operativa", "Operational Automation"),
    icon: RefreshCw,
    name: t("n8n Sync Facturación & Cobros", "n8n Auto Invoicing & Payments Sync"),
    priceCLP: "$129.000",
    priceUSD: "$139 USD",
    period: t("Pago único", "One-time payment"),
    description: t(
      "Sincroniza tus pagos recibidos en Mercado Pago, Stripe o Webpay con Google Sheets, envía recibos automáticos por email y prepara datos para el SII.",
      "Sync payments from Mercado Pago, Stripe, or Webpay to Google Sheets, send auto receipts by email, and prep data for tax reporting."
    ),
    features: [
      t("Conexión Webhooks para Webpay, MercadoPago y Stripe", "Webhook connectors for Webpay, MercadoPago & Stripe"),
      t("Generación automática de comprobantes en PDF", "Automatic PDF receipt generation"),
      t("Envío automático por correo y notificación a WhatsApp", "Auto email dispatch & WhatsApp alerts"),
      t("Registro contable limpio en planillas / Supabase", "Clean accounting log in Sheets / Supabase"),
      t("Guía de instalación paso a paso", "Step-by-step installation guide"),
    ],
    checkoutUrlCLP: null,
    checkoutUrlUSD: null,
    featured: false,
  },
  {
    id: "full-n8n-setup",
    badge: t("Servicio Paquetizado Express", "Express Productized Service"),
    icon: Cpu,
    name: t("Setup Servidor n8n + 3 Workflows", "n8n Server Setup + 3 Workflows"),
    priceCLP: "$290.000",
    priceUSD: "$315 USD",
    period: t("Instalación + 3 Workflows", "Setup + 3 Workflows"),
    description: t(
      "Desplegamos n8n en tu propio servidor VPS (Hetzner, DigitalOcean o Docker), configuramos la seguridad SSL y construimos 3 flujos a medida.",
      "We deploy n8n on your own VPS (Hetzner, DigitalOcean, or Docker), set up SSL security, and build 3 custom workflows for your business."
    ),
    features: [
      t("Instalación de n8n en tu VPS propio (100% privado)", "n8n installation on your own VPS (100% private)"),
      t("Dominio personalizado con certificado SSL HTTPS", "Custom domain with HTTPS SSL certificate"),
      t("Desarrollo e integración de 3 workflows a medida", "Development & integration of 3 custom workflows"),
      t("Capacitación técnica de 1 hora para tu equipo", "1-hour technical training session for your team"),
      t("30 días de garantía y soporte de estabilidad", "30 days warranty and stability support"),
    ],
    checkoutUrlCLP: null,
    checkoutUrlUSD: null,
    featured: false,
  },
];
