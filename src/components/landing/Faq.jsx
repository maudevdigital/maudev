import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// FAQ corta: solo las 6 objeciones que realmente frenan una compra.
// El FAQ anterior tenía 253 líneas; contestar dudas que nadie tiene alarga la
// página y baja la conversión. Si una pregunta no bloquea la venta, se va.
//
// Mantiene el schema FAQPage para rich results en Google.
// ─────────────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: t("¿Cuánto se demora?", "How long does it take?"),
    a: t(
      "Una automatización simple queda lista en 3 a 7 días. Un proyecto a medida, entre 2 y 4 semanas. Te doy la fecha por escrito antes de partir.",
      "A simple automation is ready in 3 to 7 days. A custom project, 2 to 4 weeks. You get the date in writing before we start."
    ),
  },
  {
    q: t("¿Y si no funciona?", "What if it doesn't work?"),
    a: t(
      "30 días de garantía. Si lo que entregué no hace lo que acordamos, lo arreglo sin costo. Si no tiene arreglo, te devuelvo lo pagado.",
      "30-day warranty. If what I delivered doesn't do what we agreed, I fix it at no cost. If it can't be fixed, you get your money back."
    ),
  },
  {
    q: t("¿Me amarra a una mensualidad?", "Am I locked into a monthly fee?"),
    a: t(
      "No. Pagas la instalación una vez y queda tuyo. La mantención mensual existe pero es opcional, y puedes cancelarla cuando quieras.",
      "No. You pay for the setup once and it's yours. Monthly maintenance exists but it's optional, cancel anytime."
    ),
  },
  {
    q: t("¿El código queda a mi nombre?", "Do I own the code?"),
    a: t(
      "Sí, 100%. Las credenciales y el repositorio quedan a tu nombre. No trabajo con software que te obligue a quedarte conmigo.",
      "Yes, 100%. Credentials and repository are in your name. I don't work with software that forces you to stay with me."
    ),
  },
  {
    q: t("No soy técnico, ¿igual sirve?", "I'm not technical, does it still work?"),
    a: t(
      "Está pensado justamente para eso. Lo dejo andando y te muestro cómo usarlo en una llamada de 30 minutos. Si algo se cae, me escribes.",
      "That's exactly who it's built for. I set it up and walk you through it in a 30-minute call. If something breaks, you message me."
    ),
  },
  {
    q: t("¿Cómo se paga?", "How do I pay?"),
    a: t(
      "50% para empezar y 50% contra entrega. Transferencia, y también acepto USDT si estás fuera de Chile. Boleta siempre.",
      "50% upfront and 50% on delivery. Bank transfer, and I also accept USDT if you're outside Chile. Always with an invoice."
    ),
  },
];

function Item({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary"
      >
        <span className="text-base font-semibold">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="text-muted-foreground leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="dudas" className="scroll-mt-20 border-t border-border/60 py-20 lg:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-3xl font-black tracking-tight sm:text-4xl">
          {t("Lo que todos preguntan", "What everyone asks")}
        </h2>
        <div>
          {faqs.map((f, i) => (
            <Item
              key={i}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
