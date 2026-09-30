
export const faqs = [
  {
    q: "¿Los precios publicados son finales?",
    a: "Son montos desde, netos, más IVA. El precio exacto queda por escrito después del diagnóstico y no cambia durante el proyecto.",
  },
  {
    q: "¿Mi empresa tiene que cumplir la Ley 21.719?",
    a: "Sí, si trata datos personales: un formulario de contacto o una lista de clientes ya cuentan. Rige desde el 1 de diciembre de 2026.",
  },
  {
    q: "¿Cómo sigo el avance de mi proyecto?",
    a: "Con el portal de clientes: recibes un enlace de acceso y ves las fases, lo que está por aprobar y las horas de soporte usadas.",
  },
  {
    q: "¿Todo queda a nombre de mi empresa?",
    a: "Sí. Dominio, hosting, código y accesos se crean a tu nombre. Si cambias de proveedor, te llevas todo.",
  },
];

export default function Faq() {
  return (
    <section id="preguntas" className="section-pad scroll-mt-20" aria-labelledby="preguntas-title">
      <div className="site-container grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
        <div>
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 id="preguntas-title" className="section-title mt-4">Lo importante antes de empezar.</h2>
        </div>
        <div className="border-t border-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="faq-item group">
              <summary>
                <span>{faq.q}</span>
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
