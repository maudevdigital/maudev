-- Guías iniciales sobre la Ley 21.719 (30 sep 2026). Después se editan desde el panel admin.

INSERT OR IGNORE INTO articulos (id, slug, titulo, descripcion, categoria, contenido, estado, publicado_el, actualizado_el) VALUES ('g-prorroga-21719', 'prorroga-ley-21719', 'Prórroga de la Ley 21.719: qué cambia y qué hacer mientras tanto', 'El Gobierno propuso postergar la Ley 21.719 al 1 de diciembre de 2027. Qué dice el proyecto, qué sigue vigente y por qué conviene adecuarse igual.', 'ley-21719', 'El 1 de septiembre de 2026 el Gobierno ingresó al Senado un proyecto que **posterga en un año** la entrada en vigencia de la [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272) de protección de datos personales: del **1 de diciembre de 2026** al **1 de diciembre de 2027**.

Es un proyecto, no una ley. **Mientras el Congreso no lo apruebe y se publique en el Diario Oficial, la fecha sigue siendo el 1 de diciembre de 2026.**

## Qué propone el proyecto

- **Nueva fecha:** la ley entraría en vigencia el 1 de diciembre de 2027.
- **Amonestación en vez de multa, para todos:** durante el primer año, la posibilidad de recibir una amonestación escrita en lugar de una multa, que hoy es solo para empresas de menor tamaño, se extendería a organizaciones de cualquier tamaño.
- **Una Agencia más robusta:** el consejo directivo de la Agencia de Protección de Datos Personales pasaría de tres a cinco integrantes.

El argumento del Ejecutivo es la complejidad técnica de implementar el nuevo régimen y la necesidad de que la Agencia esté instalada antes de fiscalizar.

## Qué no cambia

- **Las obligaciones son las mismas.** El proyecto mueve la fecha; no rebaja lo que la ley exige: consentimiento válido, finalidad informada, derechos de los titulares, seguridad y aviso de vulneraciones.
- **Las multas siguen siendo las mismas** una vez que la ley rija: hasta 5.000 UTM por infracciones leves, 10.000 por graves y 20.000 por gravísimas.
- **Tus clientes ya preguntan.** Un formulario sin finalidad informada o un banner de cookies que carga Google Analytics antes de aceptar se notan hoy, con o sin fiscalización.

## Qué conviene hacer ahora

1. **No detener la adecuación.** Si el proyecto no se aprueba a tiempo, el 1 de diciembre de 2026 llega igual.
2. **Empezar por el sitio web.** Es lo más visible y lo más rápido de corregir: [banner de cookies](/guias/cookies-ley-21719) y [formularios con canal de derechos](/guias/formularios-derechos-arcop-ley-21719).
3. **Medir la brecha.** El [autodiagnóstico gratis](/ley-21719#autodiagnostico) toma dos minutos y no guarda tus respuestas.

Actualizaremos esta guía cuando el proyecto avance en el Congreso.

**Fuentes:** [texto de la Ley 21.719 (BCN)](https://www.bcn.cl/leychile/navegar?idNorma=1209272) · [Carey Abogados](https://www.carey.cl/gobierno-ingresa-proyecto-de-ley-que-posterga-en-un-ano-entrada-en-vigor-de-la-ley-sobre-proteccion-de-datos-personales) · [La Tercera](https://www.latercera.com/pulso/noticia/proteccion-de-datos-personales-gobierno-ingresa-proyecto-que-posterga-en-un-ano-entrada-en-vigencia-de-la-ley/) · [Diario Financiero](https://www.df.cl/economia-y-politica/congreso/gobierno-ingresa-al-congreso-proyecto-que-posterga-por-un-ano-la-entrada-en)
', 'publicado', '2026-09-30', '2026-09-30');

INSERT OR IGNORE INTO articulos (id, slug, titulo, descripcion, categoria, contenido, estado, publicado_el, actualizado_el) VALUES ('g-cookies-21719', 'cookies-ley-21719', 'Cookies y Ley 21.719: qué debe tener el banner de tu sitio web', 'Qué exige la Ley 21.719 a las cookies y píxeles de tu sitio: consentimiento previo, rechazar tan fácil como aceptar, registro y revocación. Checklist técnico.', 'ley-21719', 'Las cookies de análisis y de publicidad, como Google Analytics o el píxel de Meta, identifican a quien visita tu sitio. Eso las convierte en **tratamiento de datos personales** bajo la [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272), y la base más común para usarlas es el **consentimiento**: libre, informado, específico e inequívoco, que además se puede revocar.

La Agencia de Protección de Datos Personales todavía no dicta instrucciones específicas sobre cookies. Lo que sigue es la lectura técnica de las exigencias de consentimiento de la ley, alineada con la práctica europea en la que se inspira.

## Lo que debe cumplir tu banner

1. **Nada se carga antes de aceptar.** Los scripts de análisis y publicidad no se ejecutan hasta que la persona elige. Un banner que avisa mientras Analytics ya está corriendo no pide consentimiento: informa un hecho consumado.
2. **Rechazar cuesta lo mismo que aceptar.** "Aceptar" y "Rechazar" van al mismo nivel, con el mismo tamaño y el mismo número de clics.
3. **Se puede elegir por finalidad.** Por separado: análisis, publicidad y las estrictamente necesarias (estas últimas no requieren consentimiento).
4. **Explica para qué y con quién.** Qué herramienta, para qué la usas y qué terceros reciben los datos, con enlace a tu política de privacidad.
5. **Se puede cambiar de opinión.** Un enlace permanente, por ejemplo en el pie de página, para revocar o modificar la elección.
6. **Queda registro.** La ley pone en tu lado la carga de probar que obtuviste el consentimiento. Guarda qué se eligió, cuándo y con qué versión del aviso, sin necesidad de guardar datos personales de quien elige.

## Errores frecuentes

- **Un plugin no es cumplimiento.** Instalarlo sin configurar el bloqueo previo deja todo igual.
- **Casillas marcadas por defecto.** El consentimiento tiene que ser una acción de la persona.
- **"Al seguir navegando aceptas".** Navegar no es una manifestación inequívoca de voluntad.
- **Olvidar los píxeles.** Meta, TikTok o LinkedIn cuentan igual que Analytics.

## Cómo revisarlo tú mismo

Abre tu sitio en una ventana privada y, antes de tocar el banner, abre las herramientas del navegador (F12 → Red). Si ves solicitudes a `google-analytics.com`, `googletagmanager.com` o `facebook.net`, esos terceros se cargan sin consentimiento.

En maudev.cl el banner funciona así: nada se carga antes de elegir, rechazar está al mismo nivel que aceptar y cada elección queda registrada sin datos personales. Si quieres el mismo resultado en tu sitio, revisa el [plan de adecuación](/ley-21719#planes) o haz primero el [autodiagnóstico](/ley-21719#autodiagnostico).

**Fuentes:** [texto de la Ley 21.719 (BCN)](https://www.bcn.cl/leychile/navegar?idNorma=1209272)
', 'publicado', '2026-09-30', '2026-09-30');

INSERT OR IGNORE INTO articulos (id, slug, titulo, descripcion, categoria, contenido, estado, publicado_el, actualizado_el) VALUES ('g-formularios-21719', 'formularios-derechos-arcop-ley-21719', 'Formularios web y derechos ARCOP bajo la Ley 21.719', 'Cómo adecuar los formularios de tu sitio a la Ley 21.719 y responder los derechos ARCOP: plazos de 30 días, bloqueo en 2 días hábiles y qué registrar.', 'ley-21719', 'Un formulario de contacto recoge nombre, correo y teléfono: datos personales. Bajo la [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272), eso te obliga a dos cosas: **recoger bien** y **responder bien** cuando alguien ejerce sus derechos.

## 1. Recoger bien: el formulario

- **Solo lo necesario.** Si para responder basta el correo, no pidas RUT ni dirección. La minimización es un principio de la ley, no una sugerencia.
- **Finalidad a la vista.** Una línea junto al botón que diga para qué usarás los datos y cuánto tiempo los guardarás, con enlace a tu política de privacidad.
- **Sin casillas premarcadas.** Si además quieres enviar novedades, esa es otra finalidad y necesita su propio consentimiento, sin marcar de antemano.
- **Plazo de conservación real.** Si prometes borrar a los 12 meses, algo tiene que borrar a los 12 meses. Una política que no se cumple es peor que ninguna.
- **Seguridad del envío.** HTTPS siempre, protección contra bots y acceso restringido a quien de verdad lee los mensajes.

## 2. Responder bien: los derechos ARCOP

La ley reconoce a cada persona los derechos de **acceso, rectificación, supresión, oposición y portabilidad**, además del **bloqueo temporal** mientras se resuelve una solicitud.

| Qué | Plazo |
|---|---|
| Responder una solicitud | **30 días corridos**, prorrogables una sola vez por otros 30 si lo comunicas antes de que venza el primero |
| Bloqueo temporal | **2 días hábiles** |

Tres cosas que marcan la diferencia en una fiscalización:

1. **Un canal definido.** Un formulario o una dirección de correo publicados, no "escríbenos por cualquier lado".
2. **Registro con fecha.** Cuándo llegó cada solicitud, qué se pidió, cuándo vence y cuándo se respondió.
3. **Verificar identidad antes de entregar datos.** Entregar los datos de alguien a otra persona es, en sí mismo, una infracción.

## Cómo lo resolvimos en maudev.cl

Nuestro [formulario de derechos](/eliminacion-datos#solicitud) entrega un folio y registra la fecha límite. Las solicitudes llegan a un panel donde se ve cuánto falta para vencer y se marca cuándo se respondieron. Los contactos del formulario se borran solos a los 12 meses, como promete la [política de privacidad](/privacidad).

Si quieres lo mismo en tu sitio, el [plan de adecuación](/ley-21719#planes) lo incluye. Para saber por dónde partir, haz el [autodiagnóstico gratis](/ley-21719#autodiagnostico).

**Fuentes:** [texto de la Ley 21.719 (BCN)](https://www.bcn.cl/leychile/navegar?idNorma=1209272)
', 'publicado', '2026-09-30', '2026-09-30');
