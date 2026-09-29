import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, X, Calendar, Calculator, Download } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { founder } from "@/data/site";

// Accesos de ayuda a petición del visitante; conserva el saludo por origen.
const CAL_URL = "https://cal.com/maudev/30min";

const SOURCE_GREETINGS = {
  tt: "¡Hola! Vienes de nuestro TikTok 🎵",
  ig: "¡Hola! Vienes de nuestro Instagram 📸",
  fb: "¡Hola! Vienes de nuestro Facebook 👋",
  li: "¡Hola! Vienes de nuestro LinkedIn 💼",
};

function detectSource(search) {
  const p = new URLSearchParams(search);
  const src = (p.get("src") || p.get("utm_source") || "").toLowerCase();
  if (/^tt$|tiktok/.test(src)) return "tt";
  if (/^ig$|instagram/.test(src)) return "ig";
  if (/^fb$|facebook|meta/.test(src)) return "fb";
  if (/^li$|linkedin/.test(src)) return "li";
  return null;
}

export default function ChatWidget() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  // Origen y nombre se fijan al entrar (los params se pierden al navegar).
  const [source] = useState(() => detectSource(window.location.search) || detectSource(search));
  const [visitorName] = useState(() => {
    const n = new URLSearchParams(window.location.search).get("n") || "";
    return n.replace(/[^\p{L}\p{N} @._-]/gu, "").slice(0, 30);
  });

  // Las opciones de contacto se abren únicamente a petición del visitante.
  const hidden = pathname === "/links" || pathname === "/ig";
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('button')?.focus();
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);

  if (hidden) return null;

  const close = () => setOpen(false);
  const toggle = () => {
    if (open) return close();
    setOpen(true);
  };

  const greeting = visitorName
    ? `¡Hola ${visitorName}! 👋`
    : (source && SOURCE_GREETINGS[source]) || "¡Hola! 👋";

  const actions = [
    {
      icon: Calendar,
      label: "Agendar diagnóstico gratis",
      sub: "30 min · eliges día y hora",
      onClick: () => window.open(CAL_URL, "_blank", "noopener"),
    },
    {
      icon: Calculator,
      label: "Ver automatizaciones",
      sub: "Agenda, boletas, cobros y más",
      onClick: () => { close(); navigate("/automatizacion"); },
    },
    {
      icon: Download,
      label: "Ver portafolio",
      sub: "Proyectos reales en producción",
      onClick: () => { close(); navigate("/casos"); },
    },
  ];

  return (
    <div className="print-hidden fixed bottom-5 right-5 z-50 hidden flex-col items-end gap-3 sm:flex">
        {open && (
          <div
            id="contact-options"
            ref={panelRef}
            role="dialog"
            aria-label="Opciones de contacto"
            className="w-[calc(100vw-2.5rem)] max-w-xs rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary/60 border-b border-border">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-black text-primary">
                  m
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight">{founder.firstName} · maudev</p>
                <p className="text-xs text-muted-foreground">Hablemos de tu proyecto</p>
              </div>
              <button onClick={() => { close(); triggerRef.current?.focus(); }} aria-label={"Cerrar chat"} className="h-7 w-7 rounded-md hover:bg-secondary flex items-center justify-center text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mensaje */}
            <div className="px-4 py-3.5">
              <>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed">
                    <p className="font-medium">{greeting}</p>
                    <p className="text-muted-foreground mt-1">
                      ¿Te ayudo con tu web, software o automatización? Elige por dónde partimos:
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {actions.map((a) => (
                      <button
                        key={a.label}
                        onClick={a.onClick}
                        className="w-full flex items-center gap-3 rounded-xl border border-border bg-background/60 hover:border-primary/40 hover:bg-primary/5 px-3.5 py-2.5 text-left transition-colors"
                      >
                        <a.icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold leading-tight">{a.label}</span>
                          <span className="block text-[11px] text-muted-foreground">{a.sub}</span>
                        </span>
                      </button>
                    ))}
                    <a
                      href={getWhatsAppUrl("Hola, estoy en su sitio web y quiero hablar sobre mi proyecto.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 px-3.5 py-2.5 text-sm font-semibold text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Escribir por WhatsApp
                    </a>
                  </div>
                </>
            </div>
          </div>
        )}

      {/* Burbuja */}
      <button
        ref={triggerRef}
        onClick={toggle}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        aria-expanded={open}
        aria-controls="contact-options"
        className="relative flex h-13 w-13 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5.5 w-5.5" />}
      </button>
    </div>
  );
}
