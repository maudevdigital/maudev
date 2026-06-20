import { useState } from "react";
import { ArrowRight, CheckCircle, MessageCircle, FileSignature, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { trackLeadEvent } from "@/lib/MetaPixelTracker";
import { getWhatsAppUrl, whatsappEnabled } from "@/components/landing/WhatsAppFloat";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { availability, proofPoints, CTA_LABEL } from "@/data/site";
import { INTERESTS } from "@/data/leadOptions";

const interests = INTERESTS.filter((i) => ["web_dev", "web_app", "automation"].includes(i.value));

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.35 } },
};

const floatY = {
  initial: { opacity: 0, scale: 0.85, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

export default function HeroSection({ heroImage }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await api.entities.Lead.create({
        email,
        interest: selected || "general",
        source: "hero_funnel",
        status: "new",
        consent: true,
        ...getLeadAttribution(),
      });
      await trackLeadEvent({
        email,
        params: { content_name: "Hero funnel", content_category: selected || "general" },
      });
      setStep(2);
      toast.success(t("Solicitud recibida. Te contactamos en menos de 24h.", "Request received. We'll get back to you within 24h."));
    } catch {
      toast.error(t("No pudimos enviar la solicitud. Intenta nuevamente.", "We couldn't send your request. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/4 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-wider uppercase">
                {availability.label} · {availability.period}
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6"
            >
              {t("Deja de perder clientes", "Stop losing customers")}
              <br />
              <span className="text-primary glow-text">{t("por una web que no vende.", "to a website that doesn't sell.")}</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-8"
            >
              {t(
                "Construimos la web, el software y las automatizaciones que convierten visitas en clientes y te devuelven horas cada semana. Hablas directo con quien escribe el código.",
                "We build the website, software and automations that turn visits into customers and give you hours back every week. You talk directly with whoever writes the code."
              )}
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono mb-8"
            >
              {proofPoints.map((p, i) => (
                <span key={p} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${i === 1 ? "bg-primary" : "bg-foreground"}`} />
                  {p}
                </span>
              ))}
            </motion.div>

            {heroImage && (
              <div className="lg:hidden mb-8 rounded-xl overflow-hidden border border-border/50">
                <img src={heroImage} alt="Maudev - desarrollo web y software" className="w-full h-auto" />
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="relative">
            {/* Floating card — compromiso verificable (contrato) */}
            <motion.div
              variants={floatY}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -top-5 -right-2 lg:-right-6 z-20 hidden lg:flex items-center gap-3 bg-card/95 border border-border shadow-xl shadow-black/20 rounded-xl px-4 py-2.5 backdrop-blur-sm"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <FileSignature className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none mb-0.5">{t("Contrato y precio fijo", "Contract & fixed price")}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{t("por escrito, antes de empezar", "in writing, before we start")}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating card — compromiso verificable (código propio) */}
            <motion.div
              variants={floatY}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute -bottom-5 -left-2 lg:-left-8 z-20 hidden lg:flex items-center gap-3 bg-card/95 border border-border shadow-xl shadow-black/20 rounded-xl px-4 py-2.5 backdrop-blur-sm"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Code2 className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none mb-0.5">{t("Código 100% tuyo", "Code 100% yours")}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{t("repositorio a tu nombre", "repository in your name")}</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={slideRight}
              initial="hidden"
              animate="show"
              className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 glow-cyan"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-3 w-3 rounded-full bg-foreground/20" />
                <div className="h-3 w-3 rounded-full bg-foreground/30" />
                <div className="h-3 w-3 rounded-full bg-foreground/40" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">maudev_funnel</span>
              </div>

              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-mono text-muted-foreground mb-4">
                    <span className="text-primary">$</span> select --growth-system
                  </p>
                  <h3 className="text-lg font-semibold mb-4">{t("¿Qué quieres vender o automatizar?", "What do you want to sell or automate?")}</h3>
                  <div className="space-y-3">
                    {interests.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => { setSelected(item.value); setStep(1); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-mono text-muted-foreground mb-2">
                    <span className="text-primary">$</span> init --roadmap
                  </p>
                  <h3 className="text-lg font-semibold mb-2">{t("Recibe tu plan de captación", "Get your lead-gen plan")}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t(
                      "Ingresa tu email y en menos de 24h te contactamos con una propuesta inicial: embudo, SEO, automatizaciones y próximos pasos.",
                      "Enter your email and within 24h we'll contact you with an initial proposal: funnel, SEO, automations and next steps."
                    )}
                  </p>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border focus:border-primary h-12"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !email}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {loading ? t("Enviando...", "Sending...") : CTA_LABEL}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← {t("Volver", "Back")}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-6">
                  <div className="h-16 w-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("¡Solicitud recibida!", "Request received!")}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t(
                      "Te contactamos con el roadmap inicial en menos de 24h. ¿Quieres respuesta inmediata?",
                      "We'll contact you with the initial roadmap within 24h. Want an immediate reply?"
                    )}
                  </p>
                  {whatsappEnabled && (
                    <a
                      href={getWhatsAppUrl(t(
                        "Hola, acabo de solicitar un diagnóstico en maudev.cl y me gustaría hablar sobre mi proyecto.",
                        "Hi, I just requested a free consult on maudev.cl and would like to discuss my project."
                      ))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 mb-3"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t("Escribir por WhatsApp ahora", "Message on WhatsApp now")}
                    </a>
                  )}
                  <p className="text-xs text-muted-foreground font-mono">
                    {t("También te llegará la propuesta por email.", "You'll also receive the proposal by email.")}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
