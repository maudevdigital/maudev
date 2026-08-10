import { useEffect } from "react";

// SEO por página en un solo lugar. Reemplaza el boilerplate repetido de
// document.title + <meta> + canonical + Open Graph + JSON-LD que antes se
// copiaba en cada página. Crea las etiquetas que faltan y limpia al desmontar.
//
// Uso:
//   useSeo({ title, description, path: "/automatizaciones", image, jsonLd });
//   useSeo({ title, noindex: true });   // hubs que no deben indexar (link-in-bio)
//
// `path` es relativo al dominio; el hook arma la URL canónica y og:url.

const ORIGIN = "https://maudev.cl";

export function useSeo({ title, description, path, image, type = "website", jsonLd, noindex } = {}) {
  const ldKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    if (title) document.title = title;

    const created = [];
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("content", content);
    };
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.head.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("href", href);
    };

    const normalizedPath = path === "/" ? "/" : path?.replace(/\/$/, "");
    const url = normalizedPath ? `${ORIGIN}${normalizedPath}` : undefined;
    const selectedImage = image || "/og-image.png";
    const img = selectedImage.startsWith("http") ? selectedImage : `${ORIGIN}${selectedImage}`;

    setMeta("name", "description", description);
    setLink("canonical", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);
    setMeta("name", "robots", noindex ? "noindex,follow" : "index,follow");

    if (jsonLd) {
      const ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.text = ldKey;
      document.head.appendChild(ld);
      created.push(ld);
    }

    return () => created.forEach((el) => el.remove());
    // ldKey (jsonLd estringificado) cubre el contenido de jsonLd sin re-render por identidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noindex, ldKey]);
}
