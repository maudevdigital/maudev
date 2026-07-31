import CtaButton from "@/components/landing/CtaButton";

export default function FinalCta() {
  return (
    <section id="contacto" className="section-pad border-t border-border" aria-labelledby="cta-final-title">
      <div className="site-container">
        <div className="final-cta">
          <span className="eyebrow">Conversemos</span>
          <h2 id="cta-final-title" className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            ¿Qué tarea te gustaría dejar de hacer manualmente?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/62">
            Descríbela y te diremos si puede automatizarse, cuánto podría demorar y qué necesitaríamos para implementarla.
          </p>
          <div className="mt-9">
            <CtaButton size="lg" context="cta-final" label="Hablar sobre mi proceso" className="bg-white! text-ink! shadow-none! hover:bg-white/90!" />
          </div>
        </div>
      </div>
    </section>
  );
}
