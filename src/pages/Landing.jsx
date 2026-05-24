import { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import ServicesSection from "../components/landing/ServicesSection";
import ProcessSection from "../components/landing/ProcessSection";
import PortafolioPreview from "../components/landing/PortafolioPreview";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import BlogPreview from "../components/landing/BlogPreview";
import FaqSection from "../components/landing/FaqSection";
import LeadCaptureSection from "../components/landing/LeadCaptureSection";
import Footer from "../components/landing/Footer";

// Imágenes opcionales para hero/services/blog. Dejar null para no mostrar.
// Para usar imágenes propias, agrega los archivos a /public y referencia "/hero.png" etc.
const HERO_IMAGE = null;
const SERVICES_IMAGE = null;
const BLOG_IMAGE = null;

export default function Landing() {
  useEffect(() => {
    document.title = "Maudev · Desarrollo web, software y automatización en Chile";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Desarrollamos sitios web, software a medida y automatización de procesos para emprendedores y PYMEs en Chile. Diagnóstico gratis.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection heroImage={HERO_IMAGE} />
      <StatsSection />
      <ServicesSection servicesImage={SERVICES_IMAGE} />
      <ProcessSection />
      <PortafolioPreview />
      <TestimonialsSection />
      <BlogPreview blogImage={BLOG_IMAGE} />
      <FaqSection />
      <LeadCaptureSection />
      <Footer />
    </div>
  );
}
