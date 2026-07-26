# Prompts de imágenes para el home — Maudev

Pégalos tal cual en ChatGPT (GPT Image). Guarda cada resultado en `public/img/`
con el nombre exacto indicado, o la imagen no aparecerá.

```
public/img/hero-whatsapp.png
public/img/proceso.png
public/img/og.png
```

---

## Por qué NO hay personas en estos prompts

Las fotos de gente generadas con IA son hoy el mayor destructor de confianza en
sitios de empresas chicas: manos con seis dedos, caras de valle inquietante,
texto ilegible en las camisetas. El visitante no piensa "qué linda foto", piensa
"esto es falso". Y una vez que duda de la foto, duda del precio.

Los mockups de producto hacen lo contrario: muestran la cosa funcionando. Eso es
prueba, no decoración.

**Reglas para todos los prompts:**

- Monocromo (blanco / negro / grises) para calzar con `src/index.css`
- Sin rostros, sin manos, sin logos de marcas reales
- Texto dentro de la imagen: mínimo y en español (la IA falla con texto largo)
- Formato PNG
- Si un texto sale con errores de ortografía, **regenera** — no lo publiques

---

## 1 · Hero → `public/img/hero-whatsapp.png`

Cuadrada (1024×1024). Es la primera imagen que se ve: tiene que comunicar
"WhatsApp que responde solo" en dos segundos.

```
A clean product mockup of a modern smartphone floating at a slight three-quarter angle
on a soft light-grey studio background. The screen shows a WhatsApp-style chat interface
in Spanish, rendered crisply and legibly:

- An incoming grey message bubble reading: "Hola, atienden mañana?"
- An outgoing bubble reading: "Sí! Tengo hora a las 10:30 o 16:00. Cuál te acomoda?"
- A small grey bubble reading: "16:00 perfecto"
- A final bubble reading: "Listo, agendado. Te llegó la confirmación"
- A subtle "en línea" status under the contact name at the top

Above the phone, three thin minimalist line-art icons connected by a delicate dotted
line, suggesting an automated pipeline: a chat bubble icon, a calendar icon, a checkmark
icon. Extremely minimal, monochrome black and white with one single soft green accent
only on the WhatsApp send button.

Style: premium SaaS marketing render, sharp focus, soft realistic shadow under the phone,
generous negative space, no people, no hands, no brand logos. Flat even studio lighting.
Square composition, 1:1.
```

**Si el texto sale mal:** genera el teléfono vacío y pide aparte
`"same image but the phone screen is a blank light chat interface with no text"`;
después le pegas un screenshot real de tu bot. Queda mejor y es 100% verdadero.

---

## 2 · Cómo funciona → `public/img/proceso.png`

Horizontal (1200×900, 4:3). Tiene que explicar el flujo sin que nadie lea.

```
A minimalist isometric diagram of an automated business workflow on a clean white
background. Three floating rounded rectangular cards connected left-to-right by thin
dotted lines with small arrowheads, suggesting data flowing between them:

1. First card: a chat bubble icon, labelled "Mensaje"
2. Second card: a gear / node-graph icon, labelled "Automatización"
3. Third card: a calendar with a checkmark icon, labelled "Agendado"

Below the middle card, two smaller satellite cards branch downward with thin lines:
one with a document icon labelled "Boleta", one with an envelope icon labelled "Aviso".

Style: strictly monochrome — white cards, black thin line icons, medium grey connectors,
one single subtle green dot travelling along the first connector line. Soft long shadows
under each card. Extremely clean technical illustration, flat design, generous white
space, no people, no photorealism, no brand logos. Labels in Spanish, short, perfectly
spelled, small sans-serif type. Landscape composition, 4:3.
```

---

## 3 · Open Graph (compartir en WhatsApp / redes) → `public/img/og.png`

1200×630. Esta es la que se ve cuando alguien pega tu link en un chat. Hoy tienes
`og-image.png`; si te gusta más esta, reemplázala.

```
A wide minimalist banner, 1200x630, on a deep near-black background with a very subtle
fine grid pattern. Centred composition: a single thin white line-art icon of a chat
bubble containing a small gear, drawn with precise even stroke weight. Below it,
generous empty space.

Style: premium dark tech branding, monochrome white on near-black, one tiny soft green
glow behind the icon, cinematic subtle vignette, lots of negative space, no text,
no people, no logos. Sharp vector-like clarity. Wide landscape 1.91:1.
```

El texto del OG (título y descripción) lo pone `useSeo`, así que la imagen va
**sin texto** a propósito — así no se duplica ni se corta en móvil.

---

## 4 · Opcional — cabeceras de las 8 automatizaciones

Hoy cada `/automatizaciones/:slug` usa un video (`/social/pro-*.mp4`), que ya
comprimí a ~350 KB. **No necesitas imágenes acá.** Si algún video no te gusta,
usa esta plantilla cambiando la parte en `MAYÚSCULAS`:

```
A minimalist monochrome product mockup illustrating BREVE DESCRIPCIÓN DEL FLUJO,
shown as clean floating UI cards on a light grey background. Thin black line icons,
dotted connector lines, one subtle green accent. Premium SaaS render, soft shadows,
generous negative space, no people, no hands, no brand logos, no text.
Landscape 16:9.
```

Descripciones sugeridas por slug:

| Slug | `BREVE DESCRIPCIÓN DEL FLUJO` |
|---|---|
| `agenda-automatica` | a booking calendar filling itself with confirmed time slots |
| `boleta-electronica` | an invoice document being generated and emailed automatically |
| `pasarela-de-pago` | a payment checkout card showing a successful transaction |
| `control-inventario` | a stock dashboard with quantity counters and a low-stock alert |
| `pedidos-restaurante` | a food order ticket moving from received to ready |
| `presencia-profesionales` | a search result card ranking first above others |
| `automatiza-tareas` | repetitive task rows collapsing into a single automated flow |
| `mas-que-instagram` | a social profile card expanding into a full website layout |

---

## Después de generar

1. Guarda los archivos en `public/img/` con los nombres exactos de arriba.
2. Comprime antes de subir — **máximo 200 KB cada una** (usa Squoosh o TinyPNG).
   Una imagen de 3 MB en el hero arruina el LCP y con eso la conversión móvil.
3. `npm run dev` y revisa el home.

Mientras las imágenes no existan, **el sitio no se rompe**: cada `<img>` tiene un
`onError` que oculta el contenedor y el layout se reacomoda solo.

---

## 5 · Capturas del portafolio → automáticas

**No hay que hacerlas a mano.** Hay un script que las captura solo:

```bash
npm install                 # instala playwright (una vez)
npx playwright install chromium
npm run capture             # captura los 4 sitios
npm run capture scissorhands  # o solo uno
```

Además corre **solo, todos los lunes**, vía
`.github/workflows/capture-portfolio.yml`, y commitea las imágenes si el sitio
cambió. También se puede lanzar a mano desde la pestaña *Actions* de GitHub.

### Por qué capturas y no un iframe en vivo

No es una preferencia estética, está verificado. Los sitios responden:

```
X-Frame-Options: DENY
Content-Security-Policy: ... frame-ancestors 'none'
```

Dos cabeceras, cada una suficiente por sí sola, prohibiendo el embebido a
cualquiera. Son la defensa estándar contra **clickjacking**: sin ellas, alguien
puede embeber el sitio de tu cliente en una página falsa, poner botones
invisibles encima y hacer que sus usuarios hagan clic en cosas que no ven.

Debilitar eso en el sitio de un cliente para adornar tu portafolio es un mal
negocio. Además un iframe cargaría las cookies y trackers de ese sitio antes de
que el visitante acepte, rompiendo el consentimiento de `src/lib/consent.js`.

### Qué hace el script, en detalle

- Captura a **1280px** de ancho, página completa, recortada a **2560px** de alto
- Esa proporción 2:1 activa sola el **desplazamiento al pasar el mouse** de
  `SitePreview`, así que la tarjeta se siente viva sin ser un iframe
- Antes de capturar **hace scroll por toda la página y vuelve arriba**: muchos
  sitios animan la entrada del hero y, si capturas de inmediato, sale una franja
  negra (le pasa al de Scissorhands)
- Comprime a **≤220 KB**; si no llega, baja la resolución antes que la calidad
- Si un sitio está caído, **conserva la captura anterior** y sigue con el resto


---

## 6 · Scissorhands → `public/portfolio/scissorhands.png`

Estilo de casa del portafolio, sacado de `systempro.png` y `paraguayaccess.png`:
panel de interfaz flotando sobre fondo casi negro, **un solo titular legible** y
todo el resto del texto ilegible. Esa ilegibilidad no es un defecto, es lo que
hace que la imagen sea decorativa y no una afirmación.

```
A dark, premium abstract UI render for a barbershop booking website, 16:9.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint warm
glow behind the panel. A subtle soft reflection beneath.

Centre: a single large floating rounded-rectangle interface panel, seen at a very
slight three-quarter perspective, with a thin glassy edge highlight, soft drop shadow
and gentle depth blur toward the edges.

Inside the panel, the layout:
- Top left: ONE legible headline in an elegant serif typeface reading exactly "Barbería",
  with a small illegible subtitle underneath
- Left column: a narrow vertical menu of 6 rows, each with a tiny line icon
- Centre: a weekly booking calendar grid, with several time-slot pills highlighted in
  warm gold, suggesting confirmed appointments
- Right column: two stacked cards, one with an abstract circular progress ring, one with
  a small list of rows
- Bottom: a horizontal strip of 5 small rounded thumbnails, like a gallery

CRITICAL TEXT RULE: apart from the single word "Barbería", every other piece of text in
the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable words.
Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages, NO person
names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, warm cream text (#F5EDE4), gold and amber accents (#D9AB55)
for the highlighted elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

### La regla que hace segura esta imagen

**Ningún texto legible que afirme algo.** Una cifra de facturación, un nombre de
cliente o una marca distinta convierten una imagen decorativa en una afirmación
falsa sobre un negocio real e identificable de Quilpué. Con el texto ilegible, la
imagen solo comunica "sistema de reservas para barbería", que es verdad.

Si el modelo te devuelve números o palabras legibles, regenera agregando:
`all text except the word "Barbería" must be unreadable blurred abstract shapes,
no numbers of any kind anywhere in the image`.

### Después de generar

1. Guarda como `public/portfolio/scissorhands.png`
2. **1280×720** para que calce con las otras tres
3. Comprime a **≤450 KB** (las otras pesan ~400 KB)

### Cuando quieras subir el estándar

La captura real del sitio le gana a cualquier render: es la prueba de que el
trabajo existe, y el visitante puede verificarla. `npm run capture scissorhands`
la genera en 30 segundos, y el script ya trae el arreglo para el hero que se
queda en negro. No es urgente, pero llegado el momento vale más que la
ilustración.

---

## 7 · Las 8 automatizaciones → `public/img/auto/`

Ocho prompts completos, listos para copiar y pegar. **No hay que editar nada.**

- Formato: **1280×720** · guardar como `.webp` · **máximo 60 KB** cada una
- Son 8 imágenes en la misma página: a 200 KB cada una serían 1,6 MB de más
- Van en cian `#19d4d4` porque es **tu** marca. La de Scissorhands va dorada
  porque representa la marca del cliente. La coherencia es con el dueño de la
  página donde aparece la imagen.

**La regla que las hace seguras:** una sola palabra legible, todo lo demás
ilegible. Sin números, sin precios, sin nombres, sin caras. Así la imagen sugiere
sin afirmar nada que después no se pueda sostener.

Si el modelo te devuelve texto o números legibles, regenera agregando al final:

```
all text except the single highlighted word must be unreadable blurred abstract
shapes, no numbers of any kind anywhere in the image
```


---

### Agenda automática → `public/img/auto/agenda-automatica.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Agenda", with a
  small illegible subtitle underneath
- Main area: a weekly calendar grid, seven narrow columns and eight rows, with about
  six time-slot pills filled in glowing cyan spread across different days, suggesting
  confirmed bookings, and the remaining cells empty
- Right side: a narrow column with two small cards, the upper one holding a simple
  line-art clock icon, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Agenda", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Boleta electrónica → `public/img/auto/boleta-electronica.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Boletas", with a
  small illegible subtitle underneath
- Main area: a neat stack of three overlapping invoice documents seen slightly from
  above, the top one crisp with illegible line items and a large cyan circular
  checkmark badge in its lower right corner
- Right side: a narrow column with two small cards, the upper one holding a line-art
  envelope icon with a small cyan sent-arrow, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Boletas", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Cobros y pasarela de pago → `public/img/auto/pasarela-de-pago.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Pagos", with a
  small illegible subtitle underneath
- Main area: a centred checkout card containing a stylised credit-card shape with
  illegible masked digits, and below it a large glowing cyan circular checkmark
  indicating a successful transaction
- Right side: a narrow column with two small cards, the upper one holding a simple
  upward trend line in cyan, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Pagos", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Control de inventario → `public/img/auto/control-inventario.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Stock", with a
  small illegible subtitle underneath
- Main area: a table of eight product rows, each with a small horizontal quantity bar
  in cyan of varying length, and exactly one row highlighted in warm amber with a
  nearly empty bar, suggesting a low-stock alert
- Right side: a narrow column with two small cards, the upper one holding a line-art
  box icon, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Stock", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Pedidos para restaurantes → `public/img/auto/pedidos-restaurante.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Pedidos", with a
  small illegible subtitle underneath
- Main area: three vertical columns of order tickets, like a kanban board, each column
  headed by a short illegible label; the tickets in the third column carry small cyan
  checkmarks, suggesting orders moving from received to ready
- Right side: a narrow column with two small cards, the upper one holding a line-art
  bell icon, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Pedidos", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Presencia para profesionales → `public/img/auto/presencia-profesionales.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Presencia", with a
  small illegible subtitle underneath
- Main area: a vertical list of four search-result cards; the first one sits slightly
  forward, outlined in glowing cyan and brighter than the rest, while the three below
  it are dimmer and recede, suggesting ranking first
- Right side: a narrow column with two small cards, the upper one holding a line-art
  map-pin icon, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Presencia", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Automatización de tareas → `public/img/auto/automatiza-tareas.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Tareas", with a
  small illegible subtitle underneath
- Main area: on the left, twelve small repetitive grey rows stacked tightly; thin lines
  converge from them toward the right where they merge into a single thick glowing cyan
  flow line ending in one clean card, suggesting many manual steps collapsing into one
  automated process
- Right side: a narrow column with two small cards, the upper one holding a line-art
  gear icon, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Tareas", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Más que Instagram → `public/img/auto/mas-que-instagram.webp`

```
A dark premium abstract UI render, 16:9, for a small-business automation product.

Background: deep near-black (#0A0A0A) with a soft radial vignette and a faint cyan
glow behind the panel. A subtle soft reflection beneath.

Centre: one large floating rounded-rectangle interface panel at a very slight
three-quarter perspective, with a thin glassy edge highlight, soft drop shadow and
gentle depth blur toward the edges.

Inside the panel:
- Top left: ONE legible word in a clean sans-serif reading exactly "Web", with a
  small illegible subtitle underneath
- Main area: on the left a small narrow social-profile card with a tiny grid of square
  thumbnails; a dotted cyan line runs to the right where it expands into a full wide
  website layout with a header bar, a hero block and three content cards, suggesting
  outgrowing a social profile
- Right side: a narrow column with two small cards, the upper one holding a line-art
  globe icon, the lower one a short list of illegible rows

CRITICAL TEXT RULE: apart from the single word "Web", every other piece of text
in the image must be ILLEGIBLE — soft, blurred, abstract letterforms with no readable
words. Absolutely NO readable numbers, NO prices, NO currency amounts, NO percentages,
NO person names, NO brand names, NO logos, NO faces, NO photographs of people.

Palette: near-black surfaces, off-white text, cyan and teal accents (#19d4d4) on the
active elements. Cinematic soft lighting from the upper left.

Style: high-end dark SaaS product render, clean, minimal, sharp focus on the panel,
generous negative space. Landscape 16:9, 1280x720.
```

---

### Cuando las tengas

Guárdalas en `public/img/auto/` con los nombres exactos de arriba. Si salen en PNG
o pesadas, avísame y las convierto a WebP optimizado antes del push.

**Nada se rompe si faltan.** La tarjeta del home y el `poster` del video usan
`onError`: si el archivo no existe, la miniatura se oculta y la tarjeta queda con
ícono y texto, como estaba. Puedes desplegar hoy y agregarlas después.
