const stages = [
  { number: "01", title: "Diagnóstico", text: "Entendemos el proceso, las excepciones y el resultado que necesitas." },
  { number: "02", title: "Desarrollo", text: "Construimos por etapas y te mostramos avances que puedes probar." },
  { number: "03", title: "Implementación", text: "Dejamos el sistema operando, documentado y listo para tu equipo." },
];

export default function WorkProcess() {
  return (
    <section id="proceso" className="section-pad scroll-mt-20 border-y border-border bg-secondary/55" aria-labelledby="proceso-title">
      <div className="site-container">
        <div className="max-w-3xl">
          <span className="eyebrow">Cómo trabajamos</span>
          <h2 id="proceso-title" className="section-title mt-4">Tres etapas, con decisiones claras en cada una.</h2>
        </div>
        <ol className="mt-12 grid border-y border-border md:grid-cols-3">
          {stages.map((stage, index) => (
            <li key={stage.number} className={`py-8 md:px-8 md:py-10 ${index > 0 ? "border-t border-border md:border-l md:border-t-0" : "md:pl-0"}`}>
              <span className="font-mono text-xs font-semibold text-primary">{stage.number}</span>
              <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.035em]">{stage.title}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">{stage.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
