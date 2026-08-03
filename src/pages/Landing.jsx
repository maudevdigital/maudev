import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PlanTiers from "@/components/landing/PlanTiers";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionsOverview from "@/components/landing/SolutionsOverview";
import ProcessDemo from "@/components/landing/ProcessDemo";
import CaseStudies from "@/components/landing/CaseStudies";
import WorkProcess from "@/components/landing/WorkProcess";
import TrustSection from "@/components/landing/TrustSection";
import Faq, { faqs } from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import { useSeo } from "@/lib/useSeo";
import { founder } from "@/data/site";

export default function Landing() {
  useSeo({
    title: "Diseño y desarrollo de páginas web en Chile · Maudev",
    description: "Diseñamos y programamos sitios web rápidos y claros para empresas y emprendedores en Chile. Landing desde $390.000, con mantención mensual y automatizaciones opcionales.",
    path: "/",
    image: "/og-image.png",
    // Solo entidades que existen y son visibles en la página: la organización,
    // el sitio y el FAQ que el visitante puede leer más abajo. Sin reviews,
    // ratings, premios ni dirección: nada de eso está verificado.
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://maudev.cl/#organizacion",
          name: "Maudev",
          url: "https://maudev.cl",
          logo: "https://maudev.cl/logo-1024.png",
          image: "https://maudev.cl/og-image.png",
          description: "Diseño y desarrollo de páginas web para empresas en Chile, con mantención y automatización.",
          areaServed: { "@type": "Country", name: "Chile" },
          founder: { "@type": "Person", name: founder.name },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "contacto@maudev.cl",
            availableLanguage: ["es-CL"],
          },
        },
        {
          "@type": "WebSite",
          "@id": "https://maudev.cl/#sitio",
          url: "https://maudev.cl",
          name: "Maudev",
          inLanguage: "es-CL",
          publisher: { "@id": "https://maudev.cl/#organizacion" },
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <PlanTiers />
        <CaseStudies />
        <ProblemSection />
        <SolutionsOverview />
        <ProcessDemo />
        <WorkProcess />
        <TrustSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
