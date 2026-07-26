import type { ProReelProps } from "./ProReel";

// Reels ProReel (animaciones/luces/transiciones) de la semana 29 jun–5 jul,
// derivados de la serie 2 del blog. Voz Brian, música y acento variados.
export type ProScriptDef = ProReelProps & { id: string; label: string };

export const proScripts: ProScriptDef[] = [
  {
    id: "pro-errores", label: "Errores caros", voice: "pro-errores.mp3", music: "music-viral1.wav", accent: "#19d4d4", tagline: "Hecho bien a la primera",
    scenes: [
      { text: "Hay un error que te hace pagar 2 veces.", fx: "slideU", frames: 95 },
      { text: "Elegir por precio.", fx: "scale", frames: 60, accent: true, size: 84 },
      { text: "El software barato no es barato:", fx: "slideL", frames: 90 },
      { text: "es incompleto.", fx: "scale", frames: 60, accent: true, size: 88 },
      { text: "Lo que falta lo pagas después.", fx: "slideR", frames: 90 },
      { text: "Compara por lo que incluye.", fx: "slideU", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-precio", label: "Precio software", voice: "pro-precio.mp3", music: "music-viral2.wav", accent: "#38b6ff", tagline: "Precios claros, sin humo",
    scenes: [
      { text: "¿Cuánto cuesta un software?", fx: "slideU", frames: 80 },
      { text: "Depende. Y mucho.", fx: "scale", frames: 60, accent: true, size: 84 },
      { text: "El mismo proyecto", fx: "slideL", frames: 65 },
      { text: "puede costar 10 veces distinto.", fx: "slideR", frames: 95, accent: true },
      { text: "Alcance, lógica, integraciones,", fx: "slideU", frames: 85 },
      { text: "y quién lo construye.", fx: "wipe", frames: 80, accent: true },
    ],
  },
  {
    id: "pro-integraciones", label: "Integraciones", voice: "pro-integraciones.mp3", music: "music-viral3.wav", accent: "#2ee6a6", tagline: "Que tus sistemas se hablen",
    scenes: [
      { text: "El valor de tu software", fx: "slideU", frames: 80 },
      { text: "no está en las pantallas.", fx: "slideL", frames: 85, accent: true },
      { text: "Está en que tus herramientas", fx: "slideR", frames: 85 },
      { text: "se hablen entre sí.", fx: "scale", frames: 75, accent: true },
      { text: "Sin integraciones: copiar y pegar.", fx: "slideU", frames: 95 },
      { text: "Con integraciones: todo fluye solo.", fx: "wipe", frames: 95, accent: true },
    ],
  },
  {
    id: "pro-mvp", label: "MVP", voice: "pro-mvp.mp3", music: "music-viral4.wav", accent: "#8b9cff", tagline: "Empieza con lo mínimo viable",
    scenes: [
      { text: "No necesitas", fx: "slideU", frames: 60 },
      { text: "la app completa.", fx: "scale", frames: 70, accent: true, size: 84 },
      { text: "Necesitas un MVP:", fx: "slideL", frames: 65 },
      { text: "lo mínimo que ya aporta valor.", fx: "slideR", frames: 95, accent: true },
      { text: "Construye poco. Aprende rápido.", fx: "slideU", frames: 90 },
      { text: "Crece con lo que facturas.", fx: "wipe", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-mantencion", label: "Mantención", voice: "pro-mantencion.mp3", music: "music-tension.wav", accent: "#19d4d4", tagline: "Cuida tu inversión",
    scenes: [
      { text: "Presupuestas el software.", fx: "slideU", frames: 80 },
      { text: "¿Y la mantención?", fx: "scale", frames: 65, accent: true },
      { text: "El software, como un auto,", fx: "slideL", frames: 80 },
      { text: "tiene costo de uso.", fx: "slideR", frames: 75, accent: true },
      { text: "15 a 20% al año.", fx: "scale", frames: 70, size: 84 },
      { text: "Lo que no se mantiene, envejece.", fx: "slideU", frames: 90, accent: true },
    ],
  },
  {
    id: "pro-ia", label: "IA para PYMEs", voice: "pro-ia.mp3", music: "music-focus.wav", accent: "#38b6ff", tagline: "IA con criterio",
    scenes: [
      { text: "Todos te ofrecen IA.", fx: "slideU", frames: 75 },
      { text: "¿Pero qué sirve de verdad?", fx: "slideL", frames: 80, accent: true },
      { text: "Sí: responder leads, resumir, 24/7.", fx: "slideR", frames: 100 },
      { text: "No: decisiones críticas sin supervisión.", fx: "wipe", frames: 100, accent: true },
      { text: "La IA es una herramienta,", fx: "slideU", frames: 80 },
      { text: "no reemplaza tu criterio.", fx: "scale", frames: 80, accent: true },
    ],
  },
  {
    id: "pro-seguridad", label: "Seguridad", voice: "pro-seguridad.mp3", music: "music-night.wav", accent: "#8b9cff", tagline: "Protege a tus clientes",
    scenes: [
      { text: "La seguridad de tu software", fx: "slideU", frames: 80 },
      { text: "es invisible.", fx: "scale", frames: 60, accent: true },
      { text: "Hasta que falla.", fx: "scale", frames: 60, size: 84 },
      { text: "Una filtración cuesta clientes,", fx: "slideL", frames: 85 },
      { text: "multas y reputación.", fx: "slideR", frames: 75, accent: true },
      { text: "Exígela desde el día uno.", fx: "slideU", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-checklist", label: "Antes de pagar", voice: "pro-checklist.mp3", music: "music-uplift.wav", accent: "#2ee6a6", tagline: "Exige lo correcto",
    scenes: [
      { text: "Antes de pagar por software,", fx: "slideU", frames: 85 },
      { text: "exige esto:", fx: "scale", frames: 55, accent: true, size: 84 },
      { text: "El código a TU nombre.", fx: "slideL", frames: 80 },
      { text: "Precio y alcance por escrito.", fx: "slideR", frames: 80 },
      { text: "Avances que ves funcionando.", fx: "slideU", frames: 80 },
      { text: "Si lo evaden, corre.", fx: "scale", frames: 75, accent: true },
    ],
  },

  // ── Semana 6–12 jul: 10 nuevos, basados en los 3 temas ganadores de IG ──
  {
    id: "pro-plazos-semana", label: "Para la otra semana", voice: "pro-plazos-semana.mp3", music: "music-tension.wav", accent: "#38b6ff", tagline: "Bien hecho, a la primera",
    scenes: [
      { text: "¿Te prometen un sistema serio para la otra semana?", fx: "slideU", frames: 100 },
      { text: "Desconfía.", fx: "scale", frames: 55, accent: true, size: 90 },
      { text: "El software bien hecho toma tiempo.", fx: "slideL", frames: 90 },
      { text: "Los atajos se pagan caro después.", fx: "slideR", frames: 90 },
      { text: "Mejor bien hecho que rápido y mal.", fx: "slideU", frames: 90, accent: true },
    ],
  },
  {
    id: "pro-cuanto-demora", label: "Cuánto demora", voice: "pro-cuanto-demora.mp3", music: "music-viral2.wav", accent: "#19d4d4", tagline: "Plazos realistas",
    scenes: [
      { text: "¿Cuánto demora un software de verdad?", fx: "slideU", frames: 85 },
      { text: "Un MVP: semanas.", fx: "slideL", frames: 70, accent: true },
      { text: "Un sistema mediano: meses.", fx: "slideR", frames: 78, accent: true },
      { text: "¿Te prometen todo en días?", fx: "slideU", frames: 75 },
      { text: "O es una plantilla, o te cobrarán de más.", fx: "wipe", frames: 100, accent: true },
    ],
  },
  {
    id: "pro-rapido-caro", label: "Rápido y barato", voice: "pro-rapido-caro.mp3", music: "music-viral1.wav", accent: "#8b9cff", tagline: "Lo barato sale caro",
    scenes: [
      { text: "Lo rápido y barato", fx: "slideU", frames: 60 },
      { text: "se paga dos veces.", fx: "scale", frames: 68, accent: true, size: 86 },
      { text: "Sin pruebas. Sin seguridad. Sin soporte.", fx: "slideL", frames: 95 },
      { text: "Lo que ahorras hoy", fx: "slideR", frames: 60 },
      { text: "lo gastas arreglando mañana.", fx: "slideU", frames: 88, accent: true },
    ],
  },
  {
    id: "pro-3-preguntas", label: "3 preguntas", voice: "pro-3-preguntas.mp3", music: "music-uplift.wav", accent: "#2ee6a6", tagline: "Pregunta antes de firmar",
    scenes: [
      { text: "Antes de pagarle a alguien por tu software,", fx: "slideU", frames: 95 },
      { text: "pregunta 3 cosas.", fx: "scale", frames: 60, accent: true, size: 86 },
      { text: "¿De quién queda el código?", fx: "slideL", frames: 80 },
      { text: "¿Hay precio y alcance por escrito?", fx: "slideR", frames: 85 },
      { text: "¿Voy a ver avances funcionando?", fx: "slideU", frames: 85 },
      { text: "Si las evade, corre.", fx: "scale", frames: 70, accent: true },
    ],
  },
  {
    id: "pro-codigo-nombre", label: "El código es tuyo", voice: "pro-codigo-nombre.mp3", music: "music-viral3.wav", accent: "#38b6ff", tagline: "El código es tuyo",
    scenes: [
      { text: "Hay una pregunta", fx: "slideU", frames: 58 },
      { text: "que espanta a los malos proveedores.", fx: "slideL", frames: 92, accent: true },
      { text: "¿El código queda a mi nombre?", fx: "scale", frames: 85, size: 80 },
      { text: "Si dudan,", fx: "slideR", frames: 52 },
      { text: "es tu señal para salir corriendo.", fx: "slideU", frames: 85, accent: true },
      { text: "El código es tuyo. Siempre.", fx: "scale", frames: 75, accent: true },
    ],
  },
  {
    id: "pro-senales-estafa", label: "Señales de estafa", voice: "pro-senales-estafa.mp3", music: "music-night.wav", accent: "#19d4d4", tagline: "Ojo con las señales",
    scenes: [
      { text: "Señales de que te van a estafar con tu software:", fx: "slideU", frames: 100 },
      { text: "Te cotizan sin entender tu negocio.", fx: "slideL", frames: 90 },
      { text: "No muestran avances hasta el final.", fx: "slideR", frames: 90 },
      { text: "Precio sospechosamente bajo.", fx: "slideU", frames: 80 },
      { text: "Si ves esto, huye.", fx: "scale", frames: 72, accent: true, size: 84 },
    ],
  },
  {
    id: "pro-hechos", label: "Hechos, no promesas", voice: "pro-hechos.mp3", music: "music-focus.wav", accent: "#2ee6a6", tagline: "Hechos, no promesas",
    scenes: [
      { text: "No creas en promesas.", fx: "slideU", frames: 68 },
      { text: "Cree en cosas funcionando.", fx: "scale", frames: 75, accent: true, size: 82 },
      { text: "Pide ver proyectos reales, no capturas.", fx: "slideL", frames: 95 },
      { text: "Habla con quien programa,", fx: "slideR", frames: 72 },
      { text: "no solo con un vendedor.", fx: "slideU", frames: 75, accent: true },
      { text: "Los hechos no mienten.", fx: "scale", frames: 70, accent: true },
    ],
  },
  {
    id: "pro-valor-real", label: "El valor real", voice: "pro-valor-real.mp3", music: "music-viral4.wav", accent: "#8b9cff", tagline: "Que tus sistemas se hablen",
    scenes: [
      { text: "El valor de tu software", fx: "slideU", frames: 75 },
      { text: "no está en las pantallas bonitas.", fx: "slideL", frames: 92, accent: true },
      { text: "Está en que tus herramientas se hablen.", fx: "slideR", frames: 92 },
      { text: "Sin integraciones,", fx: "slideU", frames: 58 },
      { text: "tu equipo copia y pega todo el día.", fx: "scale", frames: 92, accent: true },
    ],
  },
  {
    id: "pro-copiar-pegar", label: "Copiar y pegar", voice: "pro-copiar-pegar.mp3", music: "music-viral1.wav", accent: "#2ee6a6", tagline: "Automatiza lo repetitivo",
    scenes: [
      { text: "¿Copias y pegas datos entre apps", fx: "slideU", frames: 88 },
      { text: "todos los días?", fx: "scale", frames: 60, accent: true },
      { text: "Ese es tiempo y plata que pierdes.", fx: "slideL", frames: 90, accent: true },
      { text: "Cuando tus sistemas se conectan,", fx: "slideR", frames: 85 },
      { text: "la información fluye sola.", fx: "slideU", frames: 78, accent: true },
      { text: "Y tu equipo se dedica a vender.", fx: "scale", frames: 82, accent: true },
    ],
  },
  // ── Lote 3 (jue 9 - dom 12 jul) · temas ATP frescos · voz Gustavo ──
  {
    id: "pro-google", label: "Aparecer en Google", voice: "pro-google.mp3", music: "music-viral1.wav", accent: "#19d4d4", tagline: "Que te encuentren",
    scenes: [
      { text: "¿Por qué tu negocio no aparece en Google?", fx: "slideU", frames: 95 },
      { text: "No es mala suerte.", fx: "scale", frames: 60, accent: true, size: 86 },
      { text: "Tu página no está optimizada,", fx: "slideL", frames: 78 },
      { text: "tarda en cargar,", fx: "slideR", frames: 58 },
      { text: "o no está en Google Maps.", fx: "slideU", frames: 78 },
      { text: "Aparecer es técnica, no magia.", fx: "scale", frames: 85, accent: true },
    ],
  },
  {
    id: "pro-dominio", label: "Tu dominio", voice: "pro-dominio.mp3", music: "music-focus.wav", accent: "#38b6ff", tagline: "El activo más barato",
    scenes: [
      { text: "Tu dominio es la dirección", fx: "slideU", frames: 70 },
      { text: "de tu negocio en internet.", fx: "slideL", frames: 75 },
      { text: "Cuesta 12 mil pesos al año.", fx: "scale", frames: 75, accent: true, size: 82 },
      { text: "Si queda a nombre de tu proveedor,", fx: "slideR", frames: 85 },
      { text: "tu negocio es rehén.", fx: "scale", frames: 65, accent: true, size: 84 },
      { text: "Cómpralo tú. Renuévalo tú. Es tuyo.", fx: "slideU", frames: 92, accent: true },
    ],
  },
  {
    id: "pro-web-vende", label: "Web que vende", voice: "pro-web-vende.mp3", music: "music-viral3.wav", accent: "#2ee6a6", tagline: "Claro convierte",
    scenes: [
      { text: "Una página bonita", fx: "slideU", frames: 58 },
      { text: "no es una página que vende.", fx: "slideL", frames: 80, accent: true },
      { text: "Las que venden tienen:", fx: "slideR", frames: 62 },
      { text: "mensaje claro en 3 segundos,", fx: "slideU", frames: 78 },
      { text: "un botón visible, prueba social,", fx: "slideL", frames: 82 },
      { text: "y carga instantánea.", fx: "slideR", frames: 65 },
      { text: "Lo bonito atrae. Lo claro convierte.", fx: "scale", frames: 92, accent: true },
    ],
  },
  {
    id: "pro-velocidad", label: "Velocidad", voice: "pro-velocidad.mp3", music: "music-tension.wav", accent: "#8b9cff", tagline: "Cada segundo cuenta",
    scenes: [
      { text: "Tu página tarda 5 segundos en cargar.", fx: "slideU", frames: 92 },
      { text: "Más de la mitad de las visitas", fx: "slideL", frames: 75 },
      { text: "se va antes de verla.", fx: "scale", frames: 65, accent: true, size: 84 },
      { text: "La velocidad no es un detalle técnico:", fx: "slideR", frames: 85 },
      { text: "es plata.", fx: "scale", frames: 55, accent: true, size: 96 },
      { text: "Cada segundo cuenta.", fx: "slideU", frames: 70, accent: true },
    ],
  },
  {
    id: "pro-corredores", label: "Corredores", voice: "pro-corredores.mp3", music: "music-uplift.wav", accent: "#19d4d4", tagline: "Cartera con casa propia",
    scenes: [
      { text: "Si eres corredor de propiedades,", fx: "slideU", frames: 80 },
      { text: "escucha esto.", fx: "scale", frames: 55, accent: true, size: 88 },
      { text: "Los portales te arriendan visibilidad.", fx: "slideL", frames: 88 },
      { text: "Una web propia con tus fichas,", fx: "slideR", frames: 78 },
      { text: "filtros y WhatsApp directo", fx: "slideU", frames: 72 },
      { text: "trabaja para ti, no para el portal.", fx: "scale", frames: 88, accent: true },
    ],
  },
  {
    id: "pro-maps", label: "Google Maps", voice: "pro-maps.mp3", music: "music-viral4.wav", accent: "#38b6ff", tagline: "Existe donde te buscan",
    scenes: [
      { text: "Si tu negocio no está en Google Maps,", fx: "slideU", frames: 90 },
      { text: "para medio Chile no existe.", fx: "scale", frames: 78, accent: true, size: 80 },
      { text: "El perfil es gratis,", fx: "slideL", frames: 58 },
      { text: "sale en las búsquedas de tu comuna,", fx: "slideR", frames: 85 },
      { text: "y junta reseñas que venden por ti.", fx: "slideU", frames: 85 },
      { text: "Hazlo hoy. Es gratis.", fx: "scale", frames: 70, accent: true, size: 84 },
    ],
  },
  {
    id: "pro-cuando-no", label: "Cuándo NO", voice: "pro-cuando-no.mp3", music: "music-night.wav", accent: "#2ee6a6", tagline: "Honestidad primero",
    scenes: [
      { text: "3 casos donde NO te conviene", fx: "slideU", frames: 78 },
      { text: "pagar una web todavía.", fx: "scale", frames: 68, accent: true, size: 82 },
      { text: "Si no tienes claro qué vendes.", fx: "slideL", frames: 80 },
      { text: "Si vives bien del boca a boca.", fx: "slideR", frames: 80 },
      { text: "Si no vas a responder los mensajes.", fx: "slideU", frames: 85 },
      { text: "Primero el proceso. Después la tecnología.", fx: "scale", frames: 95, accent: true },
    ],
  },
  {
    id: "pro-logo-web", label: "Logo o web", voice: "pro-logo-web.mp3", music: "music-viral2.wav", accent: "#8b9cff", tagline: "Invierte donde entra la plata",
    scenes: [
      { text: "¿Logo bonito o página que vende?", fx: "slideU", frames: 85 },
      { text: "Si el presupuesto alcanza para uno,", fx: "slideL", frames: 82 },
      { text: "parte por la que vende.", fx: "scale", frames: 70, accent: true, size: 82 },
      { text: "El logo se mejora después.", fx: "slideR", frames: 72 },
      { text: "Los clientes que se van hoy, no vuelven.", fx: "slideU", frames: 92, accent: true },
      { text: "Invierte donde entra la plata.", fx: "scale", frames: 82, accent: true },
    ],
  },
  {
    id: "pro-saas-medida", label: "SaaS o a medida", voice: "pro-saas-medida.mp3", music: "music-viral2.wav", accent: "#38b6ff", tagline: "La herramienta correcta",
    scenes: [
      { text: "¿SaaS o software a medida?", fx: "slideU", frames: 80 },
      { text: "El SaaS gana en lo estándar.", fx: "slideL", frames: 82 },
      { text: "Lo a medida gana", fx: "slideR", frames: 58 },
      { text: "cuando el proceso es tu ventaja.", fx: "scale", frames: 85, accent: true },
      { text: "O cuando ya peleas con la herramienta.", fx: "slideU", frames: 90 },
      { text: "La jugada maestra: combinar.", fx: "scale", frames: 78, accent: true, size: 80 },
    ],
  },
  // ── Lote 4 · temas ATP frescos (aprobados 7-jul) · voz Gustavo ──
  {
    id: "pro-agenda", label: "Agenda online", voice: "pro-agenda.mp3", music: "music-viral1.wav", accent: "#19d4d4", tagline: "Tu hora, a un clic",
    scenes: [
      { text: "Los chilenos agendan todo online.", fx: "slideU", frames: 80 },
      { text: "El Registro Civil, la revisión técnica, el médico.", fx: "slideL", frames: 95 },
      { text: "¿Y tu negocio?", fx: "scale", frames: 55, accent: true, size: 88 },
      { text: "Sigue agendando por WhatsApp.", fx: "slideR", frames: 75 },
      { text: "Las horas que te piden de noche, las pierdes.", fx: "slideU", frames: 92, accent: true },
      { text: "Una agenda online atiende 24/7 por ti.", fx: "scale", frames: 90, accent: true },
    ],
  },
  {
    id: "pro-restaurante", label: "Restaurantes", voice: "pro-restaurante.mp3", music: "music-viral3.wav", accent: "#2ee6a6", tagline: "Pedidos sin comisión",
    scenes: [
      { text: "201 mil personas buscan", fx: "slideU", frames: 70 },
      { text: "restaurante cerca de mí, cada mes.", fx: "scale", frames: 88, accent: true, size: 78 },
      { text: "¿Tu restaurante aparece?", fx: "slideL", frames: 65 },
      { text: "Las apps de delivery te cobran hasta 30 por ciento.", fx: "slideR", frames: 98, accent: true },
      { text: "Con web propia: carta, reservas y pedidos directos.", fx: "slideU", frames: 98 },
      { text: "Cero comisión. Todo el margen para ti.", fx: "scale", frames: 88, accent: true },
    ],
  },
  {
    id: "pro-boleta", label: "Boleta electrónica", voice: "pro-boleta.mp3", music: "music-focus.wav", accent: "#38b6ff", tagline: "Vende y factura solo",
    scenes: [
      { text: "¿Sigues haciendo las boletas a mano", fx: "slideU", frames: 82 },
      { text: "en la página del SII?", fx: "slideL", frames: 62 },
      { text: "Es obligatoria desde 2021.", fx: "scale", frames: 70, accent: true, size: 84 },
      { text: "Y miles de pymes re-digitan todo cada noche.", fx: "slideR", frames: 92 },
      { text: "Un sistema a medida emite la boleta al vender,", fx: "slideU", frames: 95 },
      { text: "descuenta stock y ordena tu contabilidad.", fx: "scale", frames: 90, accent: true },
    ],
  },
  {
    id: "pro-inventario", label: "Inventario", voice: "pro-inventario.mp3", music: "music-tension.wav", accent: "#8b9cff", tagline: "Stock bajo control",
    scenes: [
      { text: "Tu Excel de inventario", fx: "slideU", frames: 62 },
      { text: "te está costando ventas.", fx: "scale", frames: 68, accent: true, size: 84 },
      { text: "Vendes en tienda, Instagram y WhatsApp,", fx: "slideL", frames: 90 },
      { text: "pero el stock vive en una planilla.", fx: "slideR", frames: 82 },
      { text: "Vendes lo que no tienes. O acumulas de más.", fx: "slideU", frames: 95, accent: true },
      { text: "Un sistema lo sincroniza todo en tiempo real.", fx: "scale", frames: 95, accent: true },
    ],
  },
  {
    id: "pro-abogados", label: "Profesionales", voice: "pro-abogados.mp3", music: "music-night.wav", accent: "#38b6ff", tagline: "Que te encuentren primero",
    scenes: [
      { text: "Nadie contrata a un abogado", fx: "slideU", frames: 72 },
      { text: "sin googlearlo primero.", fx: "scale", frames: 65, accent: true, size: 84 },
      { text: "Abogados, contadores, arquitectos:", fx: "slideL", frames: 85 },
      { text: "tu cliente te busca antes de llamar.", fx: "slideR", frames: 85 },
      { text: "Si no encuentra nada, elige a otro.", fx: "slideU", frames: 85, accent: true },
      { text: "Tu web es tu tarjeta, 24/7.", fx: "scale", frames: 75, accent: true, size: 82 },
    ],
  },
  {
    id: "pro-pasarela", label: "Pasarela de pago", voice: "pro-pasarela.mp3", music: "music-viral2.wav", accent: "#2ee6a6", tagline: "Cobra mientras duermes",
    scenes: [
      { text: "\"Hablemos por interno\"", fx: "slideU", frames: 65 },
      { text: "está matando tus ventas.", fx: "scale", frames: 68, accent: true, size: 84 },
      { text: "Cada paso extra antes de pagar, pierdes compradores.", fx: "slideL", frames: 100 },
      { text: "Con pasarela de pago en tu web,", fx: "slideR", frames: 78 },
      { text: "el cliente paga en un minuto, a cualquier hora.", fx: "slideU", frames: 95 },
      { text: "Vender mientras duermes es tener pasarela.", fx: "scale", frames: 92, accent: true },
    ],
  },
  {
    id: "pro-automatizar", label: "Automatización", voice: "pro-automatizar.mp3", music: "music-uplift.wav", accent: "#19d4d4", tagline: "Recupera tus horas",
    scenes: [
      { text: "Dos horas al día en tareas repetidas", fx: "slideU", frames: 88 },
      { text: "son 500 horas al año.", fx: "scale", frames: 70, accent: true, size: 82 },
      { text: "Copiar datos entre planillas,", fx: "slideL", frames: 72 },
      { text: "mandar los mismos correos, armar informes.", fx: "slideR", frames: 90 },
      { text: "Todo eso se puede automatizar.", fx: "slideU", frames: 78, accent: true },
      { text: "500 horas: doce semanas recuperadas.", fx: "scale", frames: 88, accent: true },
    ],
  },
  {
    id: "pro-senales-ig", label: "Más que Instagram", voice: "pro-senales-ig.mp3", music: "music-viral4.wav", accent: "#8b9cff", tagline: "Cuando la red queda chica",
    scenes: [
      { text: "Señales de que tu negocio", fx: "slideU", frames: 70 },
      { text: "ya necesita más que Instagram.", fx: "scale", frames: 78, accent: true, size: 80 },
      { text: "Respondes lo mismo 20 veces al día.", fx: "slideL", frames: 85 },
      { text: "Pierdes ventas cuando no alcanzas a responder.", fx: "slideR", frames: 95 },
      { text: "Y en Google no apareces.", fx: "slideU", frames: 68, accent: true },
      { text: "¿Dos o más? Te falta una web que trabaje por ti.", fx: "scale", frames: 100, accent: true },
    ],
  },
];
