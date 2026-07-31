import { BadgeCheck, Code2, FileText, Headphones, KeyRound, PanelsTopLeft } from "lucide-react";

const commitments = [
  { icon: FileText, title: "Precio y alcance definidos", text: "Sabes qué incluye el proyecto antes de comenzar." },
  { icon: KeyRound, title: "Accesos a tu nombre", text: "Las cuentas e infraestructura quedan bajo tu control." },
  { icon: Code2, title: "Código entregable", text: "Recibes el código cuando el proyecto y sus licencias lo permiten." },
  { icon: BadgeCheck, title: "Garantía de funcionamiento", text: "Corregimos lo acordado si algo no opera como debería." },
  { icon: Headphones, title: "Soporte directo", text: "Hablas con quien entiende y construyó la solución." },
  { icon: PanelsTopLeft, title: "Proyectos reales", text: "Puedes revisar sistemas y sitios que ya están en producción." },
];

export default function TrustSection() {
  return (
    <section className="section-pad bg-ink text-white" aria-labelledby="confianza-title">
      <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <span className="eyebrow eyebrow-on-dark">Una relación sin dependencia</span>
          <h2 id="confianza-title" className="section-title mt-4 text-white">Tu sistema debe quedar en tus manos.</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">
            La confianza se construye con alcance, propiedad y responsabilidades por escrito.
          </p>
        </div>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {commitments.map(({ icon: Icon, title, text }) => (
            <article key={title} className="border-t border-white/12 pt-5">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
