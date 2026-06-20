import { MessageSquare, FileSearch, ShieldCheck, Code2, Rocket, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { CTA_LABEL } from "@/data/site";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    phase: t("Pre-lead", "Pre-lead"),
    title: t("Primer contacto y diagnóstico", "First contact and assessment"),
    desc: t(
      "Te escribes con nosotros y agendamos un diagnóstico gratuito de 20 minutos. Sin compromiso: el objetivo es entender tu negocio antes de proponer nada.",
      "You reach out and we book a free 20-minute assessment. No commitment: the goal is to understand your business before proposing anything."
    ),
    points: [
      t("Por WhatsApp, Google Meet o correo", "Via WhatsApp, Google Meet or email"),
      t("Entendemos qué vendes y a quién", "We learn what you sell and to whom"),
      t("Detectamos el problema real a resolver", "We pinpoint the real problem to solve"),
    ],
    detail: t("Diagnóstico gratuito, sin compromiso", "Free assessment, no commitment"),
  },
  {
    icon: FileSearch,
    step: "02",
    phase: t("Lead", "Lead"),
    title: t("Roadmap, preguntas y propuesta", "Roadmap, questions and proposal"),
    desc: t(
      "Hacemos las preguntas correctas para dimensionar el proyecto y en menos de 24h recibes un documento técnico con alcance, tiempos reales y precio fijo.",
      "We ask the right questions to scope the project and within 24h you get a technical document with scope, realistic timelines and a fixed price."
    ),
    points: [
      t("¿Qué proceso quieres mejorar o automatizar?", "Which process do you want to improve or automate?"),
      t("¿Tienes marca, dominio o sistemas actuales?", "Do you have a brand, domain or existing systems?"),
      t("¿Cuál es tu presupuesto y plazo objetivo?", "What is your budget and target deadline?"),
      t("Propuesta con alcance, hitos y precio fijo", "Proposal with scope, milestones and fixed price"),
    ],
    detail: t("Respuesta garantizada en menos de 24h", "Guaranteed reply within 24h"),
  },
  {
    icon: ShieldCheck,
    step: "03",
    phase: t("Confianza", "Trust"),
    title: t("Contrato y forma de pago", "Contract and payment"),
    desc: t(
      "Firmamos un contrato que detalla alcance, hitos, propiedad del código y condiciones de pago. Si lo prefieres, puede formalizarse ante notario para máxima tranquilidad de ambas partes.",
      "We sign a contract detailing scope, milestones, code ownership and payment terms. If you prefer, it can be notarized for maximum peace of mind for both parties."
    ),
    points: [
      t("Contrato escrito; opción de firma ante notario", "Written contract; option to sign before a notary"),
      t("Pagos en CLP, USD o USDT según tu país", "Payments in CLP, USD or USDT depending on your country"),
      t("Anticipo 50% al inicio y 50% contra entrega", "50% upfront and 50% on delivery"),
      t("El código queda 100% a tu nombre al pagar el saldo", "The code is 100% yours once the balance is paid"),
    ],
    detail: t("Contrato notarial opcional para mayor confianza", "Optional notarized contract for added trust"),
    link: { to: "/contrato", label: t("Leer el modelo de contrato →", "Read the contract template →") },
  },
  {
    icon: Code2,
    step: "04",
    phase: t("Desarrollo", "Development"),
    title: t("Construcción iterativa", "Iterative build"),
    desc: t(
      "Trabajamos en ciclos cortos con entregas parciales para que veas el avance, pruebes y ajustes antes de la versión final. Comunicación constante en todo momento.",
      "We work in short cycles with partial deliveries so you can see progress, test and adjust before the final version. Constant communication throughout."
    ),
    points: [
      t("Acceso a versiones intermedias del proyecto", "Access to intermediate versions of the project"),
      t("Revisiones dentro del alcance sin costo extra", "Revisions within scope at no extra cost"),
      t("Stack moderno y mantenible (ver abajo)", "Modern, maintainable stack (see below)"),
    ],
    detail: t("Ves el avance en tiempo real", "You see progress in real time"),
  },
  {
    icon: Rocket,
    step: "05",
    phase: t("Entrega y post-venta", "Delivery & after-sales"),
    title: t("Entrega del código y soporte", "Code delivery and support"),
    desc: t(
      "Te entregamos el proyecto completo, documentado y funcionando desde el primer día. Después seguimos acompañándote con soporte y mantención.",
      "We hand over the complete project, documented and working from day one. After that we keep supporting you with maintenance and help."
    ),
    points: [
      t("Repositorio Git privado (GitHub) con tu acceso", "Private Git repository (GitHub) with your access"),
      t("Código fuente completo + ZIP de respaldo", "Full source code + ZIP backup"),
      t("Traspaso de dominio, hosting y credenciales", "Handover of domain, hosting and credentials"),
      t("Documentación, guía de uso y soporte post-venta", "Documentation, user guide and after-sales support"),
    ],
    detail: t("Soporte post-entrega incluido", "Post-delivery support included"),
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
            <span className="text-xs font-mono text-primary tracking-wider uppercase">// {t("proceso", "process")}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 mb-4">
              {t("Cómo trabajamos", "How we work")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t(
                "Un proceso claro y transparente, desde el primer mensaje hasta el soporte post-venta. Sin burocracia, con contrato de por medio y el código siempre a tu nombre.",
                "A clear, transparent process from the first message to after-sales support. No bureaucracy, with a contract in place and the code always in your name."
              )}
            </p>
            <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 px-4 py-2.5 rounded-lg hover:bg-primary/5 transition-colors">
              {CTA_LABEL}
            </a>
          </div>

          {/* Right — vertical timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-foreground/30 via-foreground/10 to-transparent" />

            <div className="space-y-0">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative flex gap-8 pb-10 last:pb-0 group"
                >
                  <div className="relative shrink-0 w-12 flex justify-center">
                    <div className="relative z-10 h-12 w-12 rounded-xl bg-card border border-border group-hover:border-foreground/40 flex items-center justify-center transition-colors duration-300">
                      <s.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="flex-1 pt-1.5 pb-2">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono text-primary font-bold tracking-widest">{s.step}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 border border-border/60 rounded px-2 py-0.5">
                        {s.phase}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
                    <ul className="space-y-1.5 mb-3">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-foreground mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center text-[11px] font-mono text-muted-foreground/60 border border-border/50 px-2.5 py-1 rounded-md bg-secondary/30">
                        {s.detail}
                      </span>
                      {s.link && (
                        <Link
                          to={s.link.to}
                          className="text-[11px] font-mono text-primary hover:underline"
                        >
                          {s.link.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech stack — marquee infinito (lista duplicada para el loop) */}
            <div className="mt-10 pt-8 border-t border-border/40">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                {t("Tecnologías que usamos", "Technologies we use")}
              </p>
              <div className="relative overflow-hidden marquee-mask">
                <div className="marquee-track flex w-max">
                  {[...stack, ...stack].map((tech, i) => (
                    <span key={`${tech}-${i}`} className="mr-2 text-xs font-mono px-3 py-1.5 rounded-md bg-secondary border border-border/60 text-muted-foreground whitespace-nowrap">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
