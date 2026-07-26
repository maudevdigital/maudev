import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

// Shell de página: Navbar + contenido + Footer sobre el fondo del sitio.
// Evita repetir <div className="min-h-screen …"><Navbar/>…<Footer/></div> en
// cada página. Usar: <PageShell> …secciones… </PageShell>.
export default function PageShell({ children, className }) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
