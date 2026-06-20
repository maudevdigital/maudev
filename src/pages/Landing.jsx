import { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import ServicesSection from "../components/landing/ServicesSection";
import ProcessSection from "../components/landing/ProcessSection";
import GuaranteeSection from "../components/landing/GuaranteeSection";
import PortafolioPreview from "../components/landing/PortafolioPreview";
import ComparisonSection from "../components/landing/ComparisonSection";
import BlogPreview from "../components/landing/BlogPreview";
import FaqSection from "../components/landing/FaqSection";
import LeadCaptureSection from "../components/landing/LeadCaptureSection";
import Footer from "../components/landing/Footer";
import { t } from "@/lib/i18n";

// Imágenes opcionales para hero/services/blog. Dejar null para no mostrar.
// Para usar imágenes propias, agrega los archivos a /public y referencia "/hero.png" etc.
const HERO_IMAGE = null;
const SERVICES_IMAGE = null;
const BLOG_IMAGE = null;

export default function Landing() {
  useEffect(() => {
    document.title = t(
      "Maudev · Desarrollo web, software y automatización en Chile",
      "Maudev · Web development, software and automation in Chile"
    );
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        t(
          "Desarrollamos sitios web, software a medida y automatización de procesos para emprendedores y PYMEs en Chile. Diagnóstico gratis.",
          "We build websites, custom software and process automation for founders and SMBs in Chile. Free consult."
        )
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection heroImage={HERO_IMAGE} />
      <StatsSection />
      <ServicesSection servicesImage={SERVICES_IMAGE} />
      <ProcessSection />
      <GuaranteeSection />
      <PortafolioPreview />
      <ComparisonSection />
      <BlogPreview blogImage={BLOG_IMAGE} />
      <FaqSection />
      <LeadCaptureSection />
      <Footer />
    </div>
  );
}
