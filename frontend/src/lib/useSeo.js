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

// `lang` y `alternates` son para las versiones en otro idioma.
//
// El sitio ya tuvo una versión bilingüe y hubo que sacarla: servía inglés en las
// mismas direcciones en español, así que Google indexaba una mezcla y ninguna
// versión posicionaba. La regla que evita repetirlo es simple y está impuesta
// acá: cada idioma vive en SU dirección, cada página declara el idioma que
// realmente tiene en <html lang>, y las tres se apuntan entre sí con hreflang
// —incluida ella misma, que es el error más común—.
//
//   useSeo({ ..., lang: "en", alternates: { es: "/", en: "/en", pt: "/pt" } })
export function useSeo({ title, description, path, image, type = "website", jsonLd, noindex, lang = "es-CL", alternates } = {}) {
  const ldKey = jsonLd ? JSON.stringify(jsonLd) : "";
  const altKey = alternates ? JSON.stringify(alternates) : "";

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
    // Las alternativas son varias etiquetas con el mismo rel, así que no sirve
    // el buscador por rel de setLink: se limpian y se vuelven a crear.
    const setAlternates = (mapa) => {
      document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
      if (!mapa) return;
      const idiomas = { es: "es-CL", en: "en", pt: "pt-BR" };
      const entradas = [
        ...Object.entries(mapa).map(([clave, ruta]) => [idiomas[clave] || clave, ruta]),
        // x-default es la que se sirve a quien no calza con ningún idioma
        // declarado. Va la española: es el mercado principal.
        ["x-default", mapa.es],
      ];
      for (const [hreflang, ruta] of entradas) {
        if (!ruta) continue;
        const el = document.createElement("link");
        el.setAttribute("rel", "alternate");
        el.setAttribute("hreflang", hreflang);
        el.setAttribute("href", `${ORIGIN}${ruta === "/" ? "/" : ruta.replace(/\/$/, "")}`);
        el.setAttribute("data-i18n", "1");
        document.head.appendChild(el);
        created.push(el);
      }
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

    // El atributo del documento tiene que decir el idioma que la página tiene
    // de verdad: es lo que leen el buscador y los lectores de pantalla.
    document.documentElement.setAttribute("lang", lang);

    setAlternates(alternates);
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
      // Se quitan el esquema general y el de la página que dejó el prerender
      // (data-seo), para no duplicarlo al montar.
      document.head.querySelectorAll('script[type="application/ld+json"][data-site-schema], script[data-seo]').forEach(el => el.remove());
      const ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.setAttribute("data-seo", "1");
      ld.text = ldKey;
      document.head.appendChild(ld);
      created.push(ld);
    }

    return () => {
      created.forEach((el) => el.remove());
      document.documentElement.setAttribute("lang", "es-CL");
    };
    // ldKey (jsonLd estringificado) cubre el contenido de jsonLd sin re-render por identidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noindex, ldKey, lang, altKey]);
}
