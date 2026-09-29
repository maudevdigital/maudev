import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PointerGlow from "@/components/landing/PointerGlow";
import { cn } from "@/lib/utils";

// Shell de página: Navbar + contenido + Footer sobre el fondo del sitio.
// Evita repetir <div className="min-h-screen …"><Navbar/>…<Footer/></div> en
// cada página. Usar: <PageShell> …secciones… </PageShell>.
//
// La verificación anti-bots NO va acá: se probó y mantiene tráfico de fondo en
// cada página del sitio, para algo que solo se necesita donde hay formulario.
// Vive en las pantallas que envían leads (ver TurnstileGate).
export default function PageShell({ children, className }) {
  return (
    <div className={cn("min-h-screen isolate bg-background text-foreground", className)}>
      <PointerGlow />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
