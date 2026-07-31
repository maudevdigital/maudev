import { ClipboardCopy, Clock3, MessagesSquare } from "lucide-react";

const examples = [
  { icon: MessagesSquare, title: "Responder lo mismo", text: "Consultas, precios y disponibilidad una y otra vez." },
  { icon: ClipboardCopy, title: "Copiar entre sistemas", text: "Datos que pasan de WhatsApp a planillas y correos." },
  { icon: Clock3, title: "Coordinar a mano", text: "Reservas, pedidos y seguimientos que dependen de alguien." },
];

export default function ProblemSection() {
  return (
    <section className="section-pad border-y border-border bg-secondary/55" aria-labelledby="problema-title">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <span className="eyebrow">El costo de lo manual</span>
            <h2 id="problema-title" className="section-title mt-4">Tu equipo no debería funcionar como puente entre sistemas.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Muchas empresas pierden horas respondiendo mensajes, actualizando planillas y coordinando tareas que siguen reglas claras. Ahí suele haber una oportunidad real de automatización.
            </p>
            <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-0">
              {examples.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className={`sm:px-6 ${index === 0 ? "sm:pl-0" : "sm:border-l sm:border-border"}`}>
                  <Icon className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
