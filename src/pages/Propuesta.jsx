import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle2, Calendar, Printer, Mail, ShieldCheck, Layers,
  Clock, Wallet, ExternalLink, FileText,
} from "lucide-react";
import Logo from "@/components/landing/Logo";

const WORKER = "https://ig-autopost.maudevchile.workers.dev";
const CAL_URL = "https://cal.com/lucas-maulen-mlfaql/30min";
const CONTACT = "contacto@maudev.cl";

const fmtCLP = (n) => "$" + Number(n || 0).toLocaleString("es-CL");
const fmtDate = (iso) =>
  iso ? new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }) : "—";

function Section({ icon: Icon, title, children }) {
  return (
    <section className="py-7 border-b border-border/40 last:border-0 print:break-inside-avoid">
      <h2 className="flex items-center gap-2.5 text-base font-bold mb-4">
        <span className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center print:hidden">
          <Icon className="h-4 w-4 text-primary" />
        </span>
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function Propuesta() {
  const { proposalId } = useParams();
  const [prop, setProp] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | notfound

  useEffect(() => {
    // La propuesta es privada entre maudev y el cliente: no debe indexarse.
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement("meta"); m.name = "robots"; document.head.appendChild(m); }
    m.setAttribute("content", "noindex,nofollow");
  }, []);

  useEffect(() => {
    fetch(`${WORKER}/proposal?id=${encodeURIComponent(proposalId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setProp(d); setState("ok"); document.title = `Propuesta · ${d.project?.title || "maudev"}`; })
      .catch(() => setState("notfound"));
  }, [proposalId]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (state === "notfound") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h1 className="text-xl font-bold mb-2">Propuesta no encontrada</h1>
          <p className="text-sm text-muted-foreground">El enlace no es válido o la propuesta ya no está disponible.</p>
          <a href="https://maudev.cl" className="inline-block mt-5 text-sm text-primary hover:underline">Ir a maudev.cl →</a>
        </div>
      </div>
    );
  }

  const p = prop;
  const validUntil = p.createdAt
    ? new Date(new Date(p.createdAt).getTime() + (p.validityDays || 14) * 86400000)
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {/* Barra superior (no se imprime) */}
      <div className="print:hidden sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="https://maudev.cl" className="flex items-center gap-2 text-primary">
            <Logo size={24} />
            <span className="text-sm font-bold text-foreground">mau<span className="text-primary">dev</span></span>
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/70 border border-border"
          >
            <Printer className="h-3.5 w-3.5" /> Descargar PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 print:py-4">
        {/* Encabezado */}
        <header className="mb-8 pb-8 border-b border-border/40">
          <p className="text-xs font-mono text-primary tracking-wider uppercase mb-2">// propuesta de proyecto</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">{p.project?.title}</h1>
          {p.project?.description && <p className="text-muted-foreground">{p.project.description}</p>}
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-5 text-sm">
            <span className="text-muted-foreground">Preparada para: <strong className="text-foreground">{p.client?.name}{p.client?.company ? ` · ${p.client.company}` : ""}</strong></span>
            <span className="text-muted-foreground">Fecha: <strong className="text-foreground">{p.createdAt ? fmtDate(p.createdAt.slice(0, 10)) : "—"}</strong></span>
            {validUntil && <span className="text-muted-foreground">Válida hasta: <strong className="text-foreground">{fmtDate(validUntil.toISOString().slice(0, 10))}</strong></span>}
          </div>
        </header>

        {/* Alcance */}
        <Section icon={Layers} title="Qué incluye este proyecto">
          <ul className="space-y-2.5">
            {(p.scope || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Metodología */}
        <Section icon={FileText} title="Cómo trabajamos (metodología Scrum)">
          <p className="mb-4">
            Trabajamos por <strong className="text-foreground">sprints</strong>: ciclos cortos con entregas que puedes
            ver funcionando. No esperas hasta el final para conocer tu producto — lo ves crecer y das feedback en cada etapa.
          </p>
          <div className="space-y-2">
            {(p.sprints || []).map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-card border border-border/60 px-4 py-3 print:border-gray-300">
                <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 rounded px-2 py-1 shrink-0 mt-0.5">{s.name}</span>
                <div>
                  <p className="text-xs text-muted-foreground">{s.weeks}</p>
                  <p className="text-sm text-foreground/90">{s.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Plazos */}
        <Section icon={Clock} title="Plazos">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-card border border-border/60 p-4 print:border-gray-300">
              <p className="text-xs text-muted-foreground mb-1">Inicio estimado</p>
              <p className="font-bold text-foreground">{fmtDate(p.startDate)}</p>
            </div>
            <div className="rounded-lg bg-card border border-border/60 p-4 print:border-gray-300">
              <p className="text-xs text-muted-foreground mb-1">Entrega estimada</p>
              <p className="font-bold text-foreground">{fmtDate(p.deliveryDate)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs">Los plazos consideran ciclos de feedback contigo; tu participación a tiempo ayuda a cumplirlos.</p>
        </Section>

        {/* Servicios externos */}
        {(p.external || []).length > 0 && (
          <Section icon={ExternalLink} title="Servicios de terceros">
            <p className="mb-3">
              Estos servicios son necesarios para operar y se contratan <strong className="text-foreground">a tu nombre</strong> (quedan
              tuyos, no nuestros). Sus costos se pagan directo al proveedor y no están incluidos en el precio del proyecto:
            </p>
            <div className="rounded-lg border border-border/60 overflow-hidden print:border-gray-300">
              {(p.external || []).map((e, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 last:border-0 text-sm">
                  <span className="text-foreground/90">{e.name}</span>
                  <span className="font-mono text-muted-foreground">{e.cost}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Inversión */}
        <Section icon={Wallet} title="Inversión">
          <div className="rounded-xl bg-card border border-primary/30 p-6 print:border-gray-400">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Precio fijo del proyecto</p>
                <p className="text-3xl font-black text-foreground">{fmtCLP(p.price)} <span className="text-sm font-normal text-muted-foreground">CLP</span></p>
              </div>
              <p className="text-xs text-muted-foreground">Sin costos ocultos.</p>
            </div>
            <div className="mt-5 pt-5 border-t border-border/40 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>50% al iniciar · 50% contra entrega</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>El código y el dominio quedan a tu nombre</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>Avances visibles durante todo el proyecto</span></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>30 días de soporte post-entrega incluidos</span></div>
            </div>
          </div>
        </Section>

        {/* Garantía / confianza */}
        <Section icon={ShieldCheck} title="Nuestro compromiso">
          <p>
            Todo lo de esta propuesta queda por escrito: alcance, plazos y precio. Si durante el proyecto quieres sumar
            cosas fuera del alcance, lo conversamos y cotizamos aparte antes de hacerlo — nunca habrá cobros sorpresa.
          </p>
        </Section>

        {/* CTA (no se imprime) */}
        <div className="print:hidden mt-8 rounded-xl bg-card border border-border p-6 text-center">
          <h3 className="font-bold mb-1.5">¿Avanzamos?</h3>
          <p className="text-sm text-muted-foreground mb-5">Acepta la propuesta o conversemos cualquier duda.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${CONTACT}?subject=${encodeURIComponent(`Acepto la propuesta: ${p.project?.title || ""}`)}&body=${encodeURIComponent("Hola, acepto la propuesta y quiero coordinar el inicio del proyecto.")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" /> Aceptar propuesta
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary border border-border font-semibold hover:bg-secondary/70"
            >
              <Calendar className="h-4 w-4" /> Agendar una llamada
            </a>
          </div>
        </div>

        <footer className="mt-10 pt-6 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            maudev · Desarrollo web, software a medida y automatización — Chile · <a href="https://maudev.cl" className="text-primary hover:underline">maudev.cl</a> · {CONTACT}
          </p>
        </footer>
      </div>
    </div>
  );
}
