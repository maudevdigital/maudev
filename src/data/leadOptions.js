// Opciones compartidas por todos los formularios de captura de leads.
// Centralizado para que el form de la landing, la LP de anuncios y el
// cotizador no diverjan entre sí.

import { t } from "@/lib/i18n";
import { Globe, Zap, Bot, CreditCard } from "lucide-react";

// Países habilitados. Cada uno define su prefijo, placeholder y rango de
// dígitos para validar el número (sin contar el prefijo).
export const COUNTRIES = [
  { code: "CL", flag: "🇨🇱", label: "Chile", dial: "+56", placeholder: "9 1234 5678", min: 8, max: 9 },
  { code: "US", flag: "🇺🇸", label: "Estados Unidos", dial: "+1", placeholder: "(555) 123-4567", min: 10, max: 10 },
  { code: "MX", flag: "🇲🇽", label: "México", dial: "+52", placeholder: "55 1234 5678", min: 10, max: 10 },
  { code: "CO", flag: "🇨🇴", label: "Colombia", dial: "+57", placeholder: "300 123 4567", min: 10, max: 10 },
  { code: "PE", flag: "🇵🇪", label: "Perú", dial: "+51", placeholder: "987 654 321", min: 9, max: 9 },
  { code: "AR", flag: "🇦🇷", label: "Argentina", dial: "+54", placeholder: "11 1234 5678", min: 10, max: 11 },
];

export const INTERESTS = [
  { value: "web_dev", label: t("Sitio o landing web", "Website or landing page"), icon: Globe, desc: t("Diseño + SEO + captación de leads", "Design + SEO + lead capture") },
  { value: "web_app", label: t("Software a medida", "Custom software"), icon: Zap, desc: t("Apps, dashboards e integraciones", "Apps, dashboards and integrations") },
  { value: "automation", label: t("Automatización", "Automation"), icon: Bot, desc: t("Procesos, bots y workflows", "Processes, bots and workflows") },
  { value: "payments", label: t("Integración de pagos / APIs", "Payments / APIs integration"), icon: CreditCard, desc: t("Stripe, MercadoPago, USDT", "Stripe, MercadoPago, USDT") },
  { value: "general", label: t("Consulta general", "General inquiry"), icon: Globe, desc: t("Cualquier otra duda", "Anything else") },
];
