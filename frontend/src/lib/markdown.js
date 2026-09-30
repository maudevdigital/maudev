import { Marked } from "marked";

// Markdown de las guías → HTML. Lo usan el build (scripts/descargar-guias.mjs,
// que genera las páginas estáticas) y la vista previa del editor admin, así que
// los dos muestran exactamente lo mismo.
//
// Seguro por construcción: el HTML crudo dentro del Markdown se escapa (no se
// ejecuta) y los enlaces solo aceptan http(s), rutas del sitio, anclas y mailto.
// Los enlaces externos abren en otra pestaña con rel="noopener".

const escapar = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hrefSeguro = (href) => /^(https?:\/\/|\/|#|mailto:)/i.test(href || "");

const marked = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return escapar(text);
    },
    link({ href, title, tokens }) {
      const texto = this.parser.parseInline(tokens);
      if (!hrefSeguro(href)) return texto;
      const externo = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?maudev\.cl/i.test(href);
      const t = title ? ` title="${escapar(title)}"` : "";
      return `<a href="${escapar(href)}"${t}${externo ? ' target="_blank" rel="noopener noreferrer"' : ""}>${texto}</a>`;
    },
    heading({ tokens, depth }) {
      const texto = this.parser.parseInline(tokens);
      const id = texto.replace(/<[^>]+>/g, "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return `<h${depth} id="${id}">${texto}</h${depth}>\n`;
    },
  },
});

export function markdownAHtml(md) {
  return marked.parse(md ?? "");
}

/** Minutos de lectura a 200 palabras por minuto. */
export function minutosDeLectura(md) {
  return Math.max(1, Math.round(String(md ?? "").split(/\s+/).filter(Boolean).length / 200));
}
