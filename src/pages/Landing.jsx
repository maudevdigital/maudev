import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
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

export default function Landing() {
  useSeo({
    title: "Automatización y software para empresas en Chile · Maudev",
    description: "Automatizamos respuestas, reservas, pagos, facturación, inventario y seguimiento para PYMEs. Alcance definido, código a tu nombre y soporte directo.",
    path: "/",
    image: "/og-image.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionsOverview />
        <ProcessDemo />
        <CaseStudies />
        <WorkProcess />
        <TrustSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
