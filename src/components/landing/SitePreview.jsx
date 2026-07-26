import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { t } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// VISTA PREVIA DE UN SITIO
//
// Marco de navegador + captura real del sitio. Al pasar el mouse, si la captura
// es de página completa (alta), se desplaza sola simulando scroll.
//
// ── Por qué captura y NO un <iframe> en vivo ──
//
// 1. Se rompe: casi todos estos sitios mandan `X-Frame-Options: SAMEORIGIN`
//    (el propio maudev.cl lo hace, ver public/_headers). Un iframe mostraría
//    un cuadro en blanco o un error del navegador. Justo en la sección que
//    existe para demostrar que sabes hacer sitios.
// 2. Fuga de consentimiento: un iframe carga los scripts y cookies del sitio
//    embebido, incluidos SUS analíticas, antes de que el visitante acepte nada.
//    Eso rompe el gate de cookies que ya está montado.
// 3. Velocidad: tres sitios completos dentro de la home destruyen el LCP.
//
// La captura carga en milisegundos, siempre se ve bien y el botón "Ver en vivo"
// lleva al sitio real en otra pestaña, que es lo que el visitante quiere igual.
// ─────────────────────────────────────────────────────────────────────────────

/** "https://scissorhands.pages.dev/" → "scissorhands.pages.dev" */
function prettyHost(url) {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

export default function SitePreview({
  src,
  url,
  title,
  stack = [],
  className = "",
}) {
  const [failed, setFailed] = useState(false);
  const [tall, setTall] = useState(false);
  const imgRef = useRef(null);

  // Si la captura es de página completa (más del doble de alta que ancha),
  // habilitamos el desplazamiento en hover. Con capturas 16:9 no hace nada.
  const onLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setTall(h / w > 1.6);
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card ${className}`}>
      {/* Barra del navegador */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/50 px-3 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-background/70 px-2.5 py-1">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {prettyHost(url) || title}
          </span>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={t(`Abrir ${title} en una pestaña nueva`, `Open ${title} in a new tab`)}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Ventana */}
      <div className="group/preview relative aspect-video overflow-hidden bg-linear-to-br from-secondary via-background to-secondary">
        {/* Fallback: se ve si no hay captura o si falla la carga */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="select-none text-3xl font-black tracking-tight text-foreground/20">
            {title?.slice(0, 2).toUpperCase()}
          </span>
          <div className="flex flex-wrap justify-center gap-1.5 px-4">
            {stack.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded border border-border/40 bg-background/40 px-1.5 py-0.5 font-mono text-[9px] text-foreground/50"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {src && !failed && (
          <img
            ref={imgRef}
            src={src}
            alt={t(`Vista previa del sitio ${title}`, `Preview of the ${title} website`)}
            loading="lazy"
            decoding="async"
            onLoad={onLoad}
            onError={() => setFailed(true)}
            style={tall ? { transitionDuration: "3.5s" } : undefined}
            className={
              tall
                ? "absolute inset-x-0 top-0 w-full transition-transform ease-linear group-hover/preview:-translate-y-[calc(100%-100%*9/16)]"
                : "absolute inset-0 h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover/preview:scale-[1.03] group-hover/preview:grayscale-0"
            }
          />
        )}
      </div>
    </div>
  );
}
