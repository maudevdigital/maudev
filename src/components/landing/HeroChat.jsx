import { motion, useReducedMotion } from "framer-motion";
import { Zap, CheckCheck } from "lucide-react";
import { t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// La demo del hero, en HTML.
//
// Antes era un .webp de un teléfono: pesaba, no se adaptaba al tema y Google no
// podía leer nada de lo que pasaba dentro. Ahora la misma conversación es texto
// real en el DOM — indexable, nítido en cualquier pantalla y con los colores
// del tema. El verde es el de WhatsApp a propósito: es la señal de qué canal
// se está automatizando.
// ─────────────────────────────────────────────────────────────────────────────

const WA = "#25D366";

const messages = [
  {
    from: "cliente",
    text: t("Hola, ¿atienden mañana?", "Hi, are you open tomorrow?"),
    time: "9:41",
  },
  {
    from: "bot",
    text: t(
      "Sí. Tengo hora a las 10:30 o a las 16:00. ¿Cuál te acomoda?",
      "Yes. I have 10:30 or 16:00 available. Which one works for you?"
    ),
    time: "9:41",
  },
  {
    from: "cliente",
    text: t("16:00 perfecto", "16:00 works"),
    time: "9:42",
  },
  {
    from: "bot",
    text: t(
      "Listo, agendado. Te llegó la confirmación por correo.",
      "Done, you're booked. The confirmation is in your inbox."
    ),
    time: "9:42",
  },
];

export default function HeroChat() {
  const reduce = useReducedMotion();

  // Las burbujas entran una a una para que se lea como una conversación
  // ocurriendo, no como una captura. Con reduced-motion aparecen ya puestas.
  const bubble = (i) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: 0.5 + i * 0.35, ease: "easeOut" },
        };

  return (
    <figure className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
      {/* Mismo hairline del navbar: cose el hero con el resto del chrome */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent"
      />

      {/* Cabecera del hilo */}
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold text-muted-foreground"
        >
          JP
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">Juan Pérez</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: WA }}
            />
            {t("en línea", "online")}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary"
        >
          {t("automático", "automated")}
        </span>
      </div>

      {/* Hilo */}
      <div className="flex flex-col gap-2.5 bg-secondary/20 px-4 py-5">
        {messages.map((m, i) => {
          const esBot = m.from === "bot";
          return (
            <motion.div
              key={i}
              {...bubble(i)}
              className={`flex flex-col ${esBot ? "items-end" : "items-start"}`}
            >
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug",
                  esBot
                    ? "rounded-br-sm border text-foreground"
                    : "rounded-bl-sm border border-border bg-card text-foreground",
                ].join(" ")}
                style={
                  esBot
                    ? { background: `${WA}1f`, borderColor: `${WA}40` }
                    : undefined
                }
              >
                {m.text}
              </div>
              <span className="mt-1 flex items-center gap-1 px-1 font-mono text-[10px] text-muted-foreground">
                {m.time}
                {esBot && <CheckCheck className="h-3 w-3" style={{ color: WA }} aria-hidden="true" />}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Pie: dice qué se está mirando (y le da contexto al buscador) */}
      <figcaption className="flex items-center gap-2 border-t border-border/60 px-4 py-3 font-mono text-[11px] leading-tight text-muted-foreground">
        <Zap className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        {t(
          "Respondido y agendado sin intervención humana.",
          "Answered and booked with no human involved."
        )}
      </figcaption>
    </figure>
  );
}
