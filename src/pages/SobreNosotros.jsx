import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Lightbulb, Shield, Users } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Code2,
    title: "Construimos lo que prometemos",
    text: "Stack moderno (React, Supabase, Cloudflare). Código mantenible, no soluciones desechables.",
  },
  {
    icon: Lightbulb,
    title: "Pensamos como dueños",
    text: "No vendemos horas: vendemos resultados. Te decimos lo que sí necesitas y lo que no.",
  },
  {
    icon: Shield,
    title: "Transparencia total",
    text: "Plazos realistas, presupuestos claros y comunicación directa. Sin sorpresas en la factura.",
  },
  {
    icon: Users,
    title: "Cercanía PYME",
    text: "Trabajamos con emprendedores. Hablamos tu idioma y nos adaptamos a tu ritmo.",
  },
];

export default function SobreNosotros() {
  useEffect(() => {
    document.title = "Sobre nosotros · Maudev";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-mono text-primary tracking-wider uppercase">// sobre nosotros</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">
            Somos un equipo que construye <span className="text-primary">software útil</span>
          </h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              Maudev nace en Chile con una idea simple: que cualquier emprendedor o PYME pueda acceder a desarrollo web,
              software a medida y automatización sin pagar tarifas de agencia grande ni quedarse con productos a medias.
            </p>
            <p>
              Combinamos formación en ingeniería civil informática con experiencia real construyendo
              plataformas en producción, desde e-commerce hasta SaaS de marketing, y aplicamos lo aprendido
              a cada proyecto que tomamos.
            </p>
            <p>
              No somos una agencia con cien personas. Somos un equipo pequeño y enfocado: tú hablas directo con quien
              diseña, escribe el código y deja tu sistema funcionando.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">¿Hablemos?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Cuéntanos qué necesitas. Si podemos ayudar, te lo decimos. Si no, te recomendamos quién sí.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Agendar diagnóstico
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
