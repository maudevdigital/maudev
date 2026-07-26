import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import AutomationsGrid from "@/components/landing/AutomationsGrid";
import PortafolioPreview from "@/components/landing/PortafolioPreview";
import Steps from "@/components/landing/Steps";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import { useSeo } from "@/lib/useSeo";
import { t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// HOME ÚNICA
//
// Absorbe lo que antes eran 4 páginas separadas (/servicios, /precios,
// /automatizaciones y /portafolio). Esas rutas ahora redirigen acá con 301
// desde public/_redirects, así no se pierde el SEO ya indexado.
//
// Secuencia pensada para no hacer dudar:
//   gancho → qué resuelve y cuánto cuesta → prueba de que existe →
//   cómo funciona → objeciones → un solo botón.
//
// Una sola acción en toda la página: escribir por WhatsApp.
// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  useSeo({
    title: t(
      "Maudev · Automatización con IA para PYMEs en Chile",
      "Maudev · AI automation for small businesses in Chile"
    ),
    description: t(
      "Automatizo respuestas, agenda, cobros y seguimiento de tu PYME. Precio fijo por escrito, 30 días de garantía y el código queda tuyo. Escríbeme por WhatsApp.",
      "I automate replies, booking, payments and follow-ups for your business. Fixed price in writing, 30-day warranty, you own the code."
    ),
    path: "/",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <AutomationsGrid />
        <PortafolioPreview />
        <Steps />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
