import { MessageSquare, FileSearch, ShieldCheck, Code2, Rocket, Check } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    phase: "Pre-lead",
    title: "Primer contacto y diagnóstico",
    desc: "Te escribes con nosotros y agendamos un diagnóstico gratuito de 20 minutos. Sin compromiso: el objetivo es entender tu negocio antes de proponer nada.",
    points: [
      "Por WhatsApp, Google Meet o correo",
      "Entendemos qué vendes y a quién",
      "Detectamos el problema real a resolver",
    ],
    detail: "Diagnóstico gratuito, sin compromiso",
  },
  {
    icon: FileSearch,
    step: "02",
    phase: "Lead",
    title: "Roadmap, preguntas y propuesta",
    desc: "Hacemos las preguntas correctas para dimensionar el proyecto y en menos de 24h recibes un documento técnico con alcance, tiempos reales y precio fijo.",
    points: [
      "¿Qué proceso quieres mejorar o automatizar?",
      "¿Tienes marca, dominio o sistemas actuales?",
      "¿Cuál es tu presupuesto y plazo objetivo?",
      "Propuesta con alcance, hitos y precio fijo",
    ],
    detail: "Respuesta garantizada en menos de 24h",
  },
  {
    icon: ShieldCheck,
    step: "03",
    phase: "Confianza",
    title: "Contrato y forma de pago",
    desc: "Firmamos un contrato que detalla alcance, hitos, propiedad del código y condiciones de pago. Si lo prefieres, puede formalizarse ante notario para máxima tranquilidad de ambas partes.",
    points: [
      "Contrato escrito; opción de firma ante notario",
      "Pagos en CLP, USD o USDT según tu país",
      "Anticipo 50% al inicio y 50% contra entrega",
      "El código queda 100% a tu nombre al pagar el saldo",
    ],
    detail: "Contrato notarial opcional para mayor confianza",
  },
  {
    icon: Code2,
    step: "04",
    phase: "Desarrollo",
    title: "Construcción iterativa",
    desc: "Trabajamos en ciclos cortos con entregas parciales para que veas el avance, pruebes y ajustes antes de la versión final. Comunicación constante en todo momento.",
    points: [
      "Acceso a versiones intermedias del proyecto",
      "Revisiones dentro del alcance sin costo extra",
      "Stack moderno y mantenible (ver abajo)",
    ],
    detail: "Ves el avance en tiempo real",
  },
  {
    icon: Rocket,
    step: "05",
    phase: "Entrega y post-venta",
    title: "Entrega del código y soporte",
    desc: "Te entregamos el proyecto completo, documentado y funcionando desde el primer día. Después seguimos acompañándote con soporte y mantención.",
    points: [
      "Repositorio Git privado (GitHub) con tu acceso",
      "Código fuente completo + ZIP de respaldo",
      "Traspaso de dominio, hosting y credenciales",
      "Documentación, guía de uso y soporte post-venta",
    ],
    detail: "Soporte post-entrega incluido",
  },
];

const stack = ["React", "Vite", "Tailwind CSS", "Node.js", "Supabase", "Cloudflare", "n8n", "Stripe"];

export default function ProcessSection() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border/30 overflow-hidden">
      <div className="absolute right-0 top-0 w-125 h-full bg-linear-to-l from-foreground/3 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left — sticky header */}
          <div className="lg:sticky lg:top-32">
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// proceso</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              Cómo trabajamos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Un proceso claro y transparente, desde el primer mensaje hasta el soporte post-venta.
              Sin burocracia, con contrato de por medio y el código siempre a tu nombre.
            </p>
            <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-4 py-2.5 rounded-lg hover:bg-primary/5 transition-colors">
              Iniciar proyecto ahora
            </a>
          </div>

          {/* Right — vertical timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-foreground/30 via-foreground/10 to-transparent" />

            <div className="space-y-0">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
             