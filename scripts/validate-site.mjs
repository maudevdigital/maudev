import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { subservicios } from "../src/data/subservices.js";
import { desdePrecio, formatCLP } from "../src/data/from-price.js";
import { homeSeo } from "../src/data/seo.js";
import { EN, PT } from "../src/data/i18n.js";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "http://127.0.0.1:4180";
const routes = [
  "/",
  "/automatizacion",
  "/software-a-medida",
  "/desarrollo-web",
  "/ecommerce",
  "/mantencion",
  "/apps-moviles",
  "/diseno",
  "/en",
  "/en/contact",
  "/pt",
  "/pt/contato",
  "/servicios/landing-page",
  "/servicios/punto-de-venta",
  "/casos",
  "/casos/systempro",
  "/casos/scissorhands",
  "/casos/partsmr",
  "/casos/paraguayaccess",
  "/nosotros",
  "/contacto",
  "/automatizaciones/agenda-automatica",
  "/terminos",
  "/privacidad",
];

const server = spawn(process.execPath, [
  path.join(root, "node_modules", "vite", "bin", "vite.js"),
  "preview",
  "--host", "127.0.0.1",
  "--port", "4180",
], { cwd: root, stdio: "ignore" });

const failures = [];
const internalLinks = new Set();
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // El preview todavía está iniciando.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("El servidor de preview no respondió.");
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  // Turnstile queda fuera de la validación. Su widget sondea a Cloudflare en
  // segundo plano, así que /contacto nunca alcanza `networkidle` y la suite se
  // caía por timeout. Además, una validación que depende de un servicio
  // externo falla cuando falla ese servicio, no cuando falla el sitio.
  const sinTurnstile = (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  await context.route("**challenges.cloudflare.com**", sinTurnstile);

  await context.addInitScript(() => {
    localStorage.setItem("maudev_consent_v2", JSON.stringify({ version: 2, analytics: false, marketing: false }));
    localStorage.setItem("theme", "light");
    sessionStorage.setItem("chat_seen", "1");
  });

  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    assert(response?.ok(), `${route}: respuesta HTTP ${response?.status()}`);
    assert(await page.locator("h1").count() === 1, `${route}: debe tener exactamente un H1`);
    // El idioma tiene que coincidir con la ruta. Antes se exigía es-CL en
    // todas; con las versiones en inglés y portugués eso dejaría pasar
    // justamente el error que hundió al bilingüe anterior: contenido en un
    // idioma declarado como otro.
    const idiomaEsperado = route.startsWith("/en") ? "en" : route.startsWith("/pt") ? "pt-BR" : "es-CL";
    assert(
      await page.evaluate(() => document.documentElement.lang) === idiomaEsperado,
      `${route}: el atributo lang debe ser ${idiomaEsperado}`
    );
    // El blog se eliminó: ninguna página puede volver a enlazarlo.
    assert(
      await page.locator('a[href*="/blog"]').count() === 0,
      `${route}: hay un enlace al blog eliminado`
    );
    // Sin schema de artículos (el sitio ya no publica contenido editorial).
    const ldTypes = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (nodes) => nodes.map((node) => node.textContent).join(" ")
    );
    assert(
      !/"@type"\s*:\s*"(Article|BlogPosting|NewsArticle)"/.test(ldTypes),
      `${route}: contiene schema de artículo`
    );
    assert((await page.title()).includes("Maudev"), `${route}: title ausente o incompleto`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    const expectedCanonical = route === "/" ? "https://maudev.cl/" : `https://maudev.cl${route}`;
    assert(canonical === expectedCanonical, `${route}: canonical incorrecta (${canonical})`);
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), `${route}: desbordamiento horizontal`);
    assert(errors.length === 0, `${route}: errores de consola: ${errors.join(" | ")}`);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    hrefs.forEach((href) => internalLinks.add(href.split("#")[0] || "/"));
    await page.close();
  }

  const linkPage = await context.newPage();
  for (const href of internalLinks) {
    await linkPage.goto(`${baseUrl}${href}`, { waitUntil: "networkidle" });
    const isNotFound = await linkPage.getByRole("heading", { name: "Esta ruta no lleva a ningún proceso." }).count();
    assert(isNotFound === 0, `Enlace interno roto: ${href}`);
  }
  await linkPage.close();

  const responsivePage = await context.newPage();
  for (const width of [360, 390, 768, 1024, 1440]) {
    await responsivePage.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await responsivePage.goto(baseUrl, { waitUntil: "networkidle" });
    assert(!(await responsivePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), `Home ${width}px: desbordamiento horizontal`);
  }

  await responsivePage.setViewportSize({ width: 390, height: 844 });
  await responsivePage.goto(baseUrl, { waitUntil: "networkidle" });
  const menuButton = responsivePage.getByRole("button", { name: "Abrir menú" });
  assert(await menuButton.count() === 1, "Menú móvil: botón no encontrado");
  await menuButton.click();
  assert(await responsivePage.getByRole("navigation", { name: "Navegación móvil" }).isVisible(), "Menú móvil: no se abrió");
  await responsivePage.keyboard.press("Escape");
  assert(await responsivePage.getByRole("navigation", { name: "Navegación móvil" }).count() === 0, "Menú móvil: Escape no lo cerró");
  await responsivePage.close();

  const formPage = await context.newPage();
  await formPage.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("webhook") || url.includes("workers.dev")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    } else if (url.includes("challenges.cloudflare.com")) {
      // `continue()` en un manejador de página no cae al de contexto, así que
      // la exclusión de Turnstile hay que repetirla acá.
      await sinTurnstile(route);
    } else {
      await route.continue();
    }
  });
  await formPage.goto(`${baseUrl}/contacto`, { waitUntil: "networkidle" });
  const visibleFields = formPage.locator("form input:not([aria-hidden='true']), form textarea, form select");
  const unlabeled = await visibleFields.evaluateAll((elements) => elements.filter((element) => !element.labels?.length && !element.getAttribute("aria-label")).length);
  assert(unlabeled === 0, `Formulario: ${unlabeled} campos sin etiqueta`);
  await formPage.getByRole("button", { name: "Enviar mi consulta" }).click();
  assert(await formPage.getByRole("alert").isVisible(), "Formulario: no muestra error al enviar vacío");
  await formPage.getByLabel("Nombre").fill("Prueba QA");
  await formPage.getByLabel("Empresa o tipo de negocio").fill("Empresa de prueba");
  await formPage.getByLabel("Qué necesitas").fill("Validar el envio del formulario sin contactar servicios externos.");
  await formPage.getByLabel("Correo o WhatsApp").fill("qa@example.com");
  await formPage.getByRole("button", { name: "Enviar mi consulta" }).click();
  await formPage.getByRole("heading", { name: "Mensaje recibido" }).waitFor({ state: "visible" });
  await formPage.close();

  // Consentimiento por finalidad. Es lo único del sitio donde una regresión
  // silenciosa deja de cumplir la Ley 21.719: nada se ve distinto, pero se
  // carga un tercero que el visitante no autorizó. Cada permiso tiene que
  // cargar solo lo suyo, y ninguno de los dos arrastra al otro.
  //
  // Los scripts de Google y Meta se responden vacíos: acá se comprueba la
  // decisión del sitio, no que sus CDN estén arriba. Sin interceptarlos, un
  // fallo de red los quita del DOM (analytics.js los descarta con onerror) y
  // la prueba fallaría por el motivo equivocado.
  const sinTerceros = (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  const escenarios = [
    { nombre: "sin decisión", consent: null, ga: false, pixel: false },
    { nombre: "solo analítica", consent: { version: 2, analytics: true, marketing: false }, ga: true, pixel: false },
    { nombre: "solo publicidad", consent: { version: 2, analytics: false, marketing: true }, ga: false, pixel: true },
    { nombre: "todo rechazado", consent: { version: 2, analytics: false, marketing: false }, ga: false, pixel: false },
    { nombre: "todo aceptado", consent: { version: 2, analytics: true, marketing: true }, ga: true, pixel: true },
    // Quien aceptó bajo el esquema binario anterior conserva su elección y no
    // vuelve a ver el banner: la migración v1 → v2 vive en getConsent().
    { nombre: "migración desde v1", legacy: "granted", ga: true, pixel: true },
    { nombre: "rechazo previo en v1", legacy: "denied", ga: false, pixel: false },
  ];

  for (const escenario of escenarios) {
    const consentContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await consentContext.route("**challenges.cloudflare.com**", sinTurnstile);
    await consentContext.route("**googletagmanager.com**", sinTerceros);
    await consentContext.route("**connect.facebook.net**", sinTerceros);
    await consentContext.addInitScript(([consent, legacy]) => {
      if (consent) localStorage.setItem("maudev_consent_v2", JSON.stringify(consent));
      if (legacy) localStorage.setItem("maudev_consent_v1", legacy);
      localStorage.setItem("theme", "light");
      sessionStorage.setItem("chat_seen", "1");
    }, [escenario.consent ?? null, escenario.legacy ?? null]);

    const consentPage = await consentContext.newPage();
    await consentPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    // Con el hero montado, el efecto que aplica el consentimiento ya corrió:
    // vive en el mismo árbol de React y se ejecuta en el mismo commit.
    await consentPage.waitForSelector("#hero-title", { state: "attached" });
    const estado = await consentPage.evaluate(() => ({
      ga: Boolean(document.getElementById("maudev-ga")),
      pixel: Boolean(document.getElementById("maudev-pixel")),
      banner: Boolean(document.querySelector('[aria-label="Preferencias de cookies"]')),
    }));

    assert(
      estado.ga === escenario.ga,
      `Consentimiento (${escenario.nombre}): Google Analytics ${estado.ga ? "se cargó" : "no se cargó"} y debía ${escenario.ga ? "cargarse" : "no cargarse"}`
    );
    assert(
      estado.pixel === escenario.pixel,
      `Consentimiento (${escenario.nombre}): Meta Pixel ${estado.pixel ? "se cargó" : "no se cargó"} y debía ${escenario.pixel ? "cargarse" : "no cargarse"}`
    );
    // El banner solo corresponde mientras no haya una decisión que respetar.
    assert(
      estado.banner === (escenario.nombre === "sin decisión"),
      `Consentimiento (${escenario.nombre}): el banner ${estado.banner ? "aparece" : "no aparece"} y debía ${escenario.nombre === "sin decisión" ? "aparecer" : "no aparecer"}`
    );
    await consentContext.close();
  }

  // El HTML estático y la app tienen que decir lo mismo. Es un error que este
  // sitio ya cometió dos veces: el archivo que lee el rastreador prometía una
  // descripción y React montaba otra al hidratar. La última vez el estático
  // decía una cosa y la app agregaba "From USD 120" contra un catálogo que da
  // USD 100. Se compara el archivo construido contra la fuente que usa la app.
  const metaEstatica = async (archivo) => {
    const html = await fs.readFile(path.join(root, "dist", archivo), "utf8");
    return html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  };
  const decodificar = (texto) =>
    texto?.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  for (const [archivo, esperada, etiqueta] of [
    ["index.html", homeSeo.description, "portada"],
    ["en.html", EN.meta.description, "/en"],
    ["pt.html", PT.meta.description, "/pt"],
    [path.join("en", "contact.html"), EN.metaContacto.description, "/en/contact"],
    [path.join("pt", "contato.html"), PT.metaContacto.description, "/pt/contato"],
  ]) {
    const encontrada = decodificar(await metaEstatica(archivo));
    assert(
      encontrada === esperada,
      `Metadatos (${etiqueta}): el HTML estático no coincide con lo que monta la app.\n      estático: ${encontrada}\n      app:      ${esperada}`
    );
  }

  // Coherencia de precios. El precio es el dato que decide la compra y el que
  // Google muestra en el resultado de búsqueda: si el meta anuncia una cifra
  // que la página ya no cobra, el visitante llega con un número en la cabeza y
  // encuentra otro. Pasó: la portada anunciaba $390.000 con el catálogo en
  // $100.000, y nada lo detectó porque la cifra estaba escrita a mano.
  for (const servicio of subservicios) {
    const esperado = formatCLP(desdePrecio(servicio.id));
    for (const campo of ["metaTitle", "metaDescription"]) {
      const texto = servicio[campo];
      if (!texto) continue;
      const cifras = [...texto.matchAll(/\$[\d.]+/g)].map((coincidencia) => coincidencia[0]);
      if (!cifras.length) continue;
      assert(
        cifras.includes(esperado),
        `Precios: ${servicio.id}.${campo} anuncia ${cifras.join(" y ")}, pero el catálogo parte en ${esperado}`
      );
    }
  }

  // El camino de mayor intención del sitio: quien configura el cotizador ya
  // dijo qué quiere y cuán grande es. Esa elección viajaba en la URL y
  // /contacto la descartaba, así que el formulario volvía a preguntar lo que la
  // persona acababa de responder. Se comprueba de las dos puntas.
  const quotePage = await context.newPage();
  await quotePage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const quoteCta = quotePage.locator('a[href*="intencion=cotizar"]').first();
  await quoteCta.waitFor({ state: "attached" });
  const quoteHref = await quoteCta.getAttribute("href");
  assert(/tipo=/.test(quoteHref) && /tamano=/.test(quoteHref), `Cotizador: el CTA no lleva la elección (${quoteHref})`);
  await quotePage.close();

  const intentPage = await context.newPage();
  await intentPage.goto(`${baseUrl}/contacto?intencion=cotizar&tipo=sitio&tamano=medio`, { waitUntil: "domcontentloaded" });
  const proceso = intentPage.getByLabel("Qué necesitas");
  await proceso.waitFor({ state: "visible" });
  const prellenado = await proceso.inputValue();
  assert(
    prellenado.includes("sitio web") && prellenado.includes("4 y 7"),
    `Cotizador → formulario: la elección no llegó al mensaje ("${prellenado}")`
  );
  assert(
    await intentPage.getByText("Vienes del cotizador:").isVisible(),
    "Cotizador → formulario: no se confirma al visitante que su elección llegó"
  );

  // Una elección inventada en la URL no debe llegar a la pantalla: lo que se
  // muestra sale del catálogo, no de lo que traiga el parámetro.
  await intentPage.goto(`${baseUrl}/contacto?intencion=cotizar&tipo=<script>&tamano=xx`, { waitUntil: "domcontentloaded" });
  await intentPage.getByLabel("Qué necesitas").waitFor({ state: "visible" });
  assert(
    (await intentPage.getByLabel("Qué necesitas").inputValue()) === "",
    "Cotizador → formulario: un parámetro inválido se refleja en el formulario"
  );
  await intentPage.close();

  // Enviar vacío tiene que decir QUÉ falta y dejar el foco ahí. El mensaje
  // genérico anterior obligaba a revisar los cuatro campos a ojo.
  const erroresPage = await context.newPage();
  await erroresPage.goto(`${baseUrl}/contacto`, { waitUntil: "domcontentloaded" });
  await erroresPage.getByRole("button", { name: "Enviar mi consulta" }).click();
  const resumen = await erroresPage.getByRole("alert").textContent();
  assert(/tu nombre/.test(resumen), `Formulario: el resumen no nombra los campos que faltan ("${resumen}")`);
  assert(
    await erroresPage.getByLabel("Nombre").evaluate((campo) => campo === document.activeElement),
    "Formulario: al fallar la validación no se enfoca el primer campo que falta"
  );
  assert(
    (await erroresPage.getByLabel("Nombre").getAttribute("aria-invalid")) === "true",
    "Formulario: el campo con error no queda marcado como inválido"
  );
  await erroresPage.close();

  // Jerarquía de CTAs. Decisión deliberada, y del tipo que se revierte sola en
  // el próximo rediseño si nadie la vigila: el hero recibe el tráfico más frío
  // del sitio y su botón principal lleva al formulario, no a WhatsApp. Dos
  // razones, y ninguna es estética. Una, el número publicado es personal. Dos,
  // un clic a WhatsApp no dispara generate_lead ni la API de Conversiones, así
  // que esa conversación no existe para la medición ni para la optimización de
  // anuncios. WhatsApp se conserva abajo, donde la persona ya leyó y elige.
  const ctaPage = await context.newPage();
  await ctaPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await ctaPage.waitForSelector("#hero-title", { state: "attached" });

  const heroCta = ctaPage.locator('[data-cta="hero"]');
  assert(await heroCta.count() === 1, "Hero: falta el CTA principal al formulario");
  assert(
    (await heroCta.getAttribute("href")) === "/contacto",
    `Hero: el CTA principal ya no lleva al formulario (${await heroCta.getAttribute("href")})`
  );
  assert(
    await ctaPage.locator('.hero-section a[href*="wa.me"]').count() === 0,
    "Hero: volvió a mandar el tráfico frío directo a WhatsApp"
  );
  assert(
    await ctaPage.locator('#contacto a[href*="wa.me"]').count() > 0,
    "Cierre: desapareció la salida por WhatsApp, que es donde sí corresponde"
  );

  // El número sale de un único lugar y admite reemplazo por variable de
  // entorno. Si alguien vuelve a escribirlo a mano en un componente, el día que
  // exista el número de empresa ese punto se queda con el personal.
  const numeros = await ctaPage.locator('a[href*="wa.me"]').evaluateAll((enlaces) =>
    [...new Set(enlaces.map((enlace) => enlace.getAttribute("href").split("?")[0]))]
  );
  assert(numeros.length === 1, `WhatsApp: hay ${numeros.length} números distintos en la portada (${numeros.join(", ")})`);

  // Lo mismo en inglés y portugués. Ahí el botón del header y el del pie usan
  // la MISMA etiqueta, así que apuntar a destinos distintos —uno a WhatsApp y
  // otro al formulario— era además una contradicción visible.
  for (const [ruta, contacto] of [["/en", "/en/contact"], ["/pt", "/pt/contato"]]) {
    await ctaPage.goto(`${baseUrl}${ruta}`, { waitUntil: "domcontentloaded" });
    await ctaPage.waitForSelector("header a.btn-primary", { state: "attached" });
    assert(
      await ctaPage.locator("header a[href*='wa.me']").count() === 0,
      `${ruta}: el header manda el tráfico frío directo a WhatsApp`
    );
    const destinos = await ctaPage.locator("header a.btn-primary, footer a.btn-primary").evaluateAll(
      (enlaces) => [...new Set(enlaces.map((enlace) => enlace.getAttribute("href")))]
    );
    assert(
      destinos.length === 1 && destinos[0] === contacto,
      `${ruta}: el CTA de cabecera y el de pie deberían llevar los dos a ${contacto} (${destinos.join(", ")})`
    );
  }
  await ctaPage.close();

  const sitemap = await fs.readFile(path.join(root, "public", "sitemap.xml"), "utf8");
  for (const route of routes.slice(0, 15)) {
    const expected = route === "/" ? "https://maudev.cl/" : `https://maudev.cl${route}`;
    assert(sitemap.includes(`<loc>${expected}</loc>`), `Sitemap: falta ${expected}`);
  }
  assert(!/\/blog/.test(sitemap), "Sitemap: contiene URLs del blog eliminado");

  // Las páginas prerenderizadas deben quedar como `ruta.html` y NO como
  // `ruta/index.html`. Con la forma de directorio, Cloudflare Pages sirve la
  // URL con barra final y devuelve 308 a la que publica el sitemap: cada
  // página de servicio aparecería en Search Console como "URL con redirección".
  // TODA ruta que se prueba acá tiene que existir como archivo en dist. La
  // lista fija anterior dejaba fuera /terminos y /privacidad, y ambas llegaron
  // a producción devolviendo 404 pese a pasar la validación: `vite preview`
  // resuelve cualquier ruta con index.html y Cloudflare Pages no.
  for (const route of routes.filter((r) => r !== "/")) {
    const flat = path.join(root, "dist", `${route.slice(1)}.html`);
    const asDirectory = path.join(root, "dist", route.slice(1), "index.html");
    assert(
      await fs.access(flat).then(() => true, () => false),
      `Prerender: falta dist${route}.html`
    );
    assert(
      await fs.access(asDirectory).then(() => false, () => true),
      `Prerender: dist${route}/index.html provocaría un 308 hacia la barra final`
    );
  }

  // El destino de /blog/* vive en una Function de Cloudflare, no en _redirects:
  // un 301 masivo a la portada sería un soft 404.
  const redirects = await fs.readFile(path.join(root, "public", "_redirects"), "utf8");
  const blogRule = redirects.split("\n").find((line) => /^\/blog/.test(line.trim()));
  assert(!blogRule, `_redirects: /blog debe resolverse en functions/blog, no acá (${blogRule})`);
  const blogFunction = await fs.readFile(path.join(root, "functions", "blog", "[[path]].js"), "utf8");
  assert(/status:\s*410/.test(blogFunction), "functions/blog: falta la respuesta 410 Gone");

  await context.close();
  await browser.close();
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`Validación fallida (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validación completa: ${routes.length} rutas, 5 viewports, menú móvil, formulario, consentimiento, precios, cotizador, consola y sitemap.`);
