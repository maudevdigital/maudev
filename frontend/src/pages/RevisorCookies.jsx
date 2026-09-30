import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, Search, ShieldAlert } from "lucide-react";
import Breadcrumbs from "@/components/landing/Breadcrumbs";
import FinalCta from "@/components/landing/FinalCta";
import PageShell from "@/components/landing/PageShell";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/lib/useSeo";
import { trackAction } from "@/lib/MetaPixelTracker";
import guias from "@/data/guias-indice.json";

const guiaCookies = guias.some((g) => g.slug === "cookies-ley-21719");

// /ley-21719/revisor-cookies: herramienta gratuita. El backend descarga el HTML
// del sitio y lo analiza (backend/src/revisor.ts). No se guarda la dirección.

const NIVELES = {
  alto: { titulo: "Riesgo alto", texto: "Carga rastreadores antes de pedir consentimiento y no se ve un gestor de cookies.", icono: ShieldAlert, clase: "border-destructive/40 bg-destructive/5 text-destructive" },
  medio: { titulo: "Hay cosas por ajustar", texto: "No es grave, pero hay terceros o detalles que conviene corregir antes de que rija la ley.", icono: AlertTriangle, clase: "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400" },
  bajo: { titulo: "Bien encaminado", texto: "En el HTML inicial no aparecen rastreadores activos antes del consentimiento.", icono: CheckCircle2, clase: "border-primary/40 bg-primary/5 text-primary" },
};

// Por qué importa cada tercero y cómo se resuelve.
const EXPLICA = {
  "google-analytics": "Mide visitas con identificadores del visitante: necesita consentimiento previo. Se resuelve cargándolo solo después de aceptar, o con Consent Mode en modo denegado por defecto.",
  meta: "Envía a Meta datos del visitante para medir y segmentar anuncios. Debe esperar el consentimiento de publicidad.",
  tiktok: "Envía datos del visitante a TikTok para anuncios. Debe esperar el consentimiento de publicidad.",
  linkedin: "Envía datos del visitante a LinkedIn para anuncios. Debe esperar el consentimiento de publicidad.",
  "google-ads": "Seguimiento publicitario de Google. Debe esperar el consentimiento de publicidad.",
  hotjar: "Graba la navegación del visitante. Debe esperar el consentimiento de análisis.",
  clarity: "Graba la navegación del visitante. Debe esperar el consentimiento de análisis.",
  youtube: "El video incrustado avisa a Google de cada visita. Usa youtube-nocookie.com o carga el video solo al hacer clic.",
  "google-fonts": "Cada visita le entrega la IP del visitante a Google. Se resuelve alojando las tipografías en tu propio sitio.",
  "google-maps": "El mapa avisa a Google de cada visita. Se puede mostrar una imagen y cargar el mapa al hacer clic.",
  recaptcha: "Envía datos del visitante a Google para evaluar si es un bot. Hay alternativas que no rastrean, como Cloudflare Turnstile.",
};

function Hallazgo({ ok, titulo, texto }) {
  const Icono = ok ? CheckCircle2 : AlertTriangle;
  return (
    <li className="flex gap-3 border-t border-border pt-4">
      <Icono className={`mt-0.5 h-5 w-5 shrink-0 ${ok ? "text-primary" : "text-amber-600 dark:text-amber-400"}`} aria-hidden="true" />
      <div>
        <p className="font-semibold">{titulo}</p>
        {texto && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{texto}</p>}
      </div>
    </li>
  );
}

export default function RevisorCookies() {
  const [url, setUrl] = useState("");
  const [estado, setEstado] = useState({ cargando: false, error: "", r: null });

  useSeo({
    title: "Revisor de cookies gratis para la Ley 21.719 · Maudev",
    description: "Revisa gratis qué cookies, píxeles y terceros carga tu sitio antes del consentimiento, y qué corregir para la Ley 21.719. Sin registro.",
    path: "/ley-21719/revisor-cookies",
    image: "/og-image.png",
  });

  const revisar = async (e) => {
    e.preventDefault();
    if (estado.cargando) return;
    setEstado({ cargando: true, error: "", r: null });
    try {
      const res = await fetch("/api/publico/revisar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(datos.error || "No se pudo revisar el sitio.");
      setEstado({ cargando: false, error: "", r: datos });
      trackAction("revisor_cookies", { nivel: datos.nivel, terceros: datos.terceros.length });
    } catch (err) {
      setEstado({ cargando: false, error: err.message, r: null });
    }
  };

  const { r } = estado;
  const nivel = r && NIVELES[r.nivel];

  return (
    <PageShell>
      <main id="contenido" tabIndex={-1}>
        <section className="pb-16 pt-30 sm:pt-36">
          <div className="site-container">
            <Breadcrumbs items={[{ label: "Ley 21.719", href: "/ley-21719" }, { label: "Revisor de cookies" }]} />
            <span className="eyebrow">Herramienta gratuita</span>
            <h1 className="mt-5 max-w-[18ch] text-5xl font-extrabold leading-[1] tracking-[-0.04em] sm:text-6xl">¿Tu sitio rastrea antes de pedir permiso?</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Escribe la dirección de tu sitio y te mostramos qué cookies, píxeles y terceros carga antes del consentimiento, y cómo corregirlo para la Ley 21.719.
            </p>

            <form onSubmit={revisar} className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label htmlFor="url-revisar" className="sr-only">Dirección del sitio</label>
              <Input id="url-revisar" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="tuempresa.cl" inputMode="url" autoComplete="url" required className="h-14 flex-1 bg-background text-base" />
              {/* aria-busy y no disabled: deshabilitar el botón enfocado tiraba el foco al body. */}
              <button type="submit" aria-busy={estado.cargando} className={`btn btn-primary h-14 px-8 text-base ${estado.cargando ? "opacity-60" : ""}`}>
                <Search className="h-5 w-5" aria-hidden="true" /> {estado.cargando ? "Revisando…" : "Revisar"}
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">No guardamos la dirección ni el resultado. Revisamos solo la página que indiques.</p>

            <div aria-live="polite" className="max-w-3xl">
              {estado.error && <p className="mt-8 rounded-xl border border-destructive/40 bg-card p-4 text-sm text-destructive">{estado.error}</p>}
              {r && (
                <div className="mt-10">
                  <div className={`flex gap-4 rounded-2xl border p-6 ${nivel.clase}`}>
                    <nivel.icono className="h-7 w-7 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-2xl font-extrabold tracking-tight">{nivel.titulo}</p>
                      <p className="mt-1 text-sm text-foreground/80">{nivel.texto}</p>
                      <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{r.url}</p>
                    </div>
                  </div>

                  <ul className="mt-8 grid gap-4">
                    {r.terceros.map((t) => (
                      <Hallazgo key={t.id} ok={t.bloqueado} titulo={`${t.nombre}${t.bloqueado ? ": espera el consentimiento" : ": se carga sin consentimiento"}`} texto={t.bloqueado ? "Viene bloqueado hasta que la persona acepta. Bien." : EXPLICA[t.id]} />
                    ))}
                    {r.terceros.length === 0 && <Hallazgo ok titulo="Sin rastreadores ni terceros en el HTML inicial" />}
                    <Hallazgo ok={Boolean(r.gestor || r.consentMode)} titulo={r.gestor ? `Gestor de consentimiento: ${r.gestor}` : r.consentMode ? "Usa Consent Mode de Google" : "No se detecta gestor de consentimiento"}
                      texto={r.gestor || r.consentMode ? "Revisa que rechazar sea tan fácil como aceptar y que nada se cargue antes de elegir." : "Sin un aviso que pida permiso antes de cargar análisis o publicidad, no hay consentimiento válido."} />
                    <Hallazgo ok={r.cookiesServidor.length === 0} titulo={r.cookiesServidor.length ? `El servidor crea ${r.cookiesServidor.length} cookie(s) al entrar: ${r.cookiesServidor.join(", ")}` : "El servidor no crea cookies al entrar"}
                      texto={r.cookiesServidor.length ? "Si no son estrictamente necesarias (sesión, seguridad), también necesitan consentimiento." : null} />
                    <Hallazgo ok={r.politica} titulo={r.politica ? "Enlaza una política de privacidad" : "No se encontró enlace a una política de privacidad"}
                      texto={r.politica ? "Revisa que nombre a los terceros que reciben datos y cómo ejercer los derechos ARCOP." : "La ley exige informar qué datos tratas, para qué y con quién. Debe estar enlazada en todo el sitio."} />
                    {r.formularios > 0 && <Hallazgo ok={false} titulo={`${r.formularios} formulario(s) en la página`} texto="Cada formulario debe decir para qué usarás los datos y pedir solo los necesarios." />}
                    <Hallazgo ok={r.https} titulo={r.https ? "Usa HTTPS" : "No usa HTTPS"} texto={r.https ? null : "Los datos de los formularios viajan sin cifrar. Es lo primero que hay que corregir."} />
                  </ul>

                  <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                    Revisamos el HTML con que responde tu sitio. Lo que un gestor de etiquetas agrega después, al ejecutarse en el navegador, no aparece acá: una revisión completa necesita abrir el sitio como un visitante.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/contacto?plan=ley-diagnostico" onClick={() => trackAction("cta_principal_click", { ubicacion: "revisor-cookies" })} className="btn btn-primary h-12 px-6 text-sm">
                      Pedir diagnóstico completo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    {guiaCookies && <Link to="/guias/cookies-ley-21719" className="btn btn-ghost h-12 px-6 text-sm">Qué debe tener el banner</Link>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <FinalCta />
      </main>
    </PageShell>
  );
}
