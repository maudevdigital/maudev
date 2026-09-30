import { describe, expect, it } from "vitest";
import { analizar, urlRevisable } from "../src/revisor";

describe("revisor de cookies", () => {
  it("rechaza direcciones internas, IPs, puertos y protocolos raros", () => {
    for (const malo of ["localhost", "http://127.0.0.1", "http://10.0.0.1", "http://[::1]", "ftp://x.cl", "https://x.cl:8080", "intranet", "http://nas.local", "https://user:pw@x.cl"]) {
      expect(urlRevisable(malo), malo).toBeNull();
    }
    expect(urlRevisable("maudev.cl")?.toString()).toBe("https://maudev.cl/");
    expect(urlRevisable("http://tuempresa.cl/contacto")?.hostname).toBe("tuempresa.cl");
  });

  it("marca riesgo alto con Analytics y píxel sin gestor de consentimiento", () => {
    const html = `<html><script async src="https://www.googletagmanager.com/gtag/js?id=G-X"></script>
      <script>!function(f){f.fbq=function(){}}(window);fbq('init','1');</script><a href="/privacidad">Privacidad</a><form></form></html>`;
    const r = analizar(html, ["sesion"], "https://x.cl/");
    expect(r.nivel).toBe("alto");
    expect(r.terceros.map((t) => t.id)).toEqual(["google-analytics", "meta"]);
    expect(r.politica).toBe(true);
    expect(r.formularios).toBe(1);
    expect(r.cookiesServidor).toEqual(["sesion"]);
  });

  it("reconoce scripts bloqueados hasta aceptar y el gestor de consentimiento", () => {
    const html = `<script src="https://consent.cookiebot.com/uc.js"></script>
      <script type="text/plain" data-cookieconsent="statistics" src="https://www.googletagmanager.com/gtag/js"></script>
      <a href="/politica-de-privacidad">x</a>`;
    const r = analizar(html, [], "https://x.cl/");
    expect(r.gestor).toBe("Cookiebot");
    expect(r.terceros[0]).toMatchObject({ id: "google-analytics", bloqueado: true });
    expect(r.nivel).toBe("bajo");
  });

  it("un sitio limpio y con política sale bajo; sin política, medio", () => {
    expect(analizar(`<a href="/privacidad">p</a>`, [], "https://x.cl/").nivel).toBe("bajo");
    expect(analizar(`<p>hola</p>`, [], "https://x.cl/").nivel).toBe("medio");
  });
});
