import { useState } from "react";
import { ArrowRight, Zap, Globe, Bot, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/maudev";
import { getLeadAttribution } from "@/lib/lead-tracking";
import { toast } from "sonner";
import { motion } from "framer-motion";

const interests = [
  { id: "web_dev", label: "Sitio o landing web", icon: Globe, desc: "Diseño + SEO + captación de leads" },
  { id: "web_app", label: "Software a medida", icon: Zap, desc: "Apps, dashboards e integraciones" },
  { id: "automation", label: "Automatización", icon: Bot, desc: "Procesos, bots y workflows" },
];

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
      setStep(2);
      toast.success("Solicitud recibida. Te enviaremos el roadmap inicial.");
    } catch {
      toast.error("No pudimos enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/4 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

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
                Disponible · Chile · Remoto global
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6"
            >
              Tu próximo proyecto,
              <br />
              <span className="text-primary glow-text">construido para escalar.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-8"
            >
              Desarrollamos webs, software a medida y automatizaciones que generan clientes reales.
              Diseño, código y soporte en un solo equipo.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono mb-8"
            >
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                +25 proyectos entregados
              </span>
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                SEO técnico incluido
              </span>
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Respuesta en 24h
              </span>
            </motion.div>

            {heroImage && (
              <div className="lg:hidden mb-8 rounded-xl overflow-hidden border border-border/50">
                <img src={heroImage} alt="Maudev - desarrollo web y software" className="w-full h-auto" />
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="relative">
            {/* Floating proof card — top */}
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
                <div className="h-8 w-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none mb-0.5">Lead calificado</p>
                  <p className="text-[10px] text-muted-foreground font-mono">hace 2 minutos</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating proof card — bottom */}
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
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none mb-0.5">+40% conversión</p>
                  <p className="text-[10px] text-muted-foreground font-mono">landing optimizada</p>
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
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">maudev_funnel</span>
              </div>

              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-mono text-muted-foreground mb-4">
                    <span className="text-primary">$</span> select --growth-system
                  </p>
                  <h3 className="text-lg font-semibold mb-4">¿Qué quieres vender o automatizar?</h3>
                  <div className="space-y-3">
                    {interests.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setSelected(item.id); setStep(1); }}
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
                  <h3 className="text-lg font-semibold mb-2">Recibe tu plan de captación</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Ingresa tu email y te enviaremos una propuesta inicial con embudo, SEO,
                    automatizaciones y próximos pasos.
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
                    {loading ? "Enviando..." : "Solicitar diagnóstico gratis"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Volver
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Solicitud recibida</h3>
                  <p className="text-sm text-muted-foreground">
                    El sistema notificó al equipo y preparó la respuesta automática.
                    Te contactaremos con el roadmap.
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
