// Subservicios por nivel.
//
// Cada nivel muestra el mismo catálogo, pero con precios distintos y con los
// servicios que no alcanza marcados como no disponibles en vez de ocultos.
// Ocultarlos haría que el nivel de entrada pareciera completo y que nadie
// entendiera para qué existen los de arriba; mostrarlos bloqueados convierte la
// carta en el argumento para subir.
//
// Los montos son NETOS: el IVA de 19% se suma aparte y así va rotulado en la
// interfaz. Es la convención del rubro en Chile para venta a empresas, que
// descuentan el impuesto.

export const familias = [
  { id: "web", label: "Web", pagina: "/desarrollo-web" },
  { id: "software", label: "Software", pagina: "/software-a-medida" },
  { id: "apps", label: "Apps", pagina: "/software-a-medida" },
  { id: "branding", label: "Branding", pagina: "/contacto" },
];

// Los tres niveles, para mostrar la escalera de precio en cada página.
export const nivelesLabel = ["Presencia", "Operación", "Comercio"];

// precios: [inicia, escala, domina]. null = no disponible en ese nivel.
//
// `prompt` es la indicación para generar la imagen de la página. Se guarda acá
// y no en un documento aparte porque la imagen pertenece al servicio: si mañana
// se renombra o se reencuadra el servicio, el prompt tiene que cambiar con él.
// Mientras no exista el archivo, la página muestra el prompt dentro del marco
// de la imagen, así queda a la vista qué falta por producir.
//
// DIRECCIÓN: diagramas, no fotografías. Cada imagen representa la ESTRUCTURA de
// lo que se entrega —los bloques de una landing, las pantallas de una app, los
// módulos de un sistema— como un despiece vectorial plano. Dos razones: una
// foto de escritorio con notebook es intercambiable entre los diecinueve
// servicios y no explica nada, y un diagrama sí muestra qué compra el cliente.
// Además el vector plano no cae en el "aire de imagen generada" que delata a
// las fotos con IA, que es lo peor que puede pasarle a un sitio que vende
// diseño.
//
// `tecnologias` lista cada herramienta CON su para qué. Una lista de nombres
// sueltos es un adorno que cualquiera copia en su sitio; decir qué resuelve
// cada una demuestra criterio y educa al cliente que va a comparar
// cotizaciones, que es exactamente a quien conviene tener mejor informado.
//
// `caso` apunta a un proyecto REAL del portafolio que corresponde a ese
// servicio. Solo se define donde de verdad calza: repetir el mismo caso en
// servicios que no lo son sería inventar un ejemplo, justo lo que se evita al
// no usar maquetas ficticias.
//
// Reglas comunes: fondo crema, bloques en gris claro, UN solo acento cobalto
// reservado a los elementos accionables, sin texto legible (solo barras que lo
// sugieran), sin sombras realistas ni degradados, 3:2. Los prompts de los otros
// dieciocho servicios siguen en el formato fotográfico anterior y hay que
// reescribirlos con esta dirección, uno por uno.
export const subserviciosBase = [
  {
    id: "landing",
    tecnologias: [
      { nombre: "React", para: "Interfaz construida por piezas, para que un cambio no rompa el resto" },
      { nombre: "Vite", para: "Compila el sitio a archivos estáticos: nada que ejecutar en el servidor" },
      { nombre: "Tailwind", para: "Sistema de estilos acotado, que evita que el diseño se desordene con el tiempo" },
      { nombre: "Cloudflare Pages", para: "Servido desde la red más cercana al visitante, con certificado incluido" },
    ],
    caso: "scissorhands",
    imagen: "/servicios/landing-page.webp",
    familia: "web",
    nombre: "Landing page",
    resumen: "Una página, una promesa, una conversión.",
    incluye: ["Diseño de una sola página", "Formulario y WhatsApp conectados", "Hosting y dominio el primer año", "Entrega en 5 días hábiles"],
    precios: [100000, 190000, 290000],
    // ── Contenido extendido ──────────────────────────────────────────────
    // Se escribe servicio por servicio y no en tanda: diecinueve textos hechos
    // de una sentada terminan diciendo lo mismo con distintas palabras, y eso
    // es exactamente lo que Google clasifica como contenido delgado.
    //
    // Cada bloque responde una búsqueda real: qué es, cuánto cuesta, cuánto
    // demora, qué necesito tener listo, en qué se diferencia de la alternativa
    // barata.
    metaTitle: "Landing page en Chile desde $100.000 · Diseño y desarrollo · Maudev",
    metaDescription:
      "Landing page profesional para campañas y anuncios: una página, una acción y formulario conectado a WhatsApp. Desde $100.000 + IVA, publicada en 5 días hábiles.",
    intro:
      "Una landing page es una sola página con un objetivo único: que quien llega haga una cosa concreta. Pedir una cotización, reservar una hora, dejar sus datos. A diferencia de un sitio completo, no tiene menú que distraiga ni secciones que inviten a irse a mirar otra cosa.",
    secciones: [
      {
        titulo: "Cuándo conviene una landing y cuándo no",
        parrafos: [
          "Conviene cuando vas a invertir en publicidad. Si mandas tráfico pagado a tu inicio, el visitante llega y tiene que averiguar solo qué le ofreces: parte de ese presupuesto se pierde en gente que se va sin entender. Una landing recibe ese tráfico con la misma promesa del anuncio y una sola acción posible.",
          "También conviene para validar una idea antes de construir algo más grande, o para un servicio puntual que no calza dentro de tu sitio actual.",
          "No conviene si necesitas explicar varios servicios distintos, mostrar un catálogo o publicar contenido con frecuencia. Ahí se te va a quedar chica en el primer mes y vas a terminar pagando dos veces: ahí es un sitio corporativo lo que corresponde.",
        ],
      },
      {
        titulo: "Qué recibes exactamente",
        parrafos: [
          "Una página programada a la medida de tu negocio, no una plantilla con tu logo encima. Se diseña sobre tu propuesta: qué vendes, a quién y qué debe hacer el visitante.",
          "Va con formulario conectado a tu correo y botón directo a WhatsApp, porque en Chile la mayoría prefiere escribir por ahí antes que llenar un formulario. Incluye la base técnica de SEO —títulos, descripción, datos estructurados y sitemap— para que Google pueda leerla desde el primer día.",
          "El hosting y el dominio del primer año van incluidos, y quedan a tu nombre. Si mañana decides trabajar con otra persona, te llevas todo sin pedir permiso.",
        ],
      },
      {
        titulo: "Cuánto demora y qué necesitas tener listo",
        parrafos: [
          "Cinco días hábiles desde que están los contenidos aprobados. Lo que suele alargar un proyecto no es la programación: son los textos y las fotos.",
          "Para partir necesitas tu logo en buena calidad, las fotos que quieras usar y una idea clara de qué ofreces. Si no tienes textos, los escribimos nosotros a partir de una conversación de treinta minutos.",
        ],
      },
      {
        titulo: "Por qué no usar un constructor por tu cuenta",
        parrafos: [
          "Puedes hacerlo, y para algunos casos es suficiente. La diferencia aparece en tres puntos: la velocidad de carga, que en los constructores arrastra código que tu página no usa; el pago mensual, que no termina nunca y sube cada año; y que el resultado se parece al de todos los demás que usaron la misma plantilla.",
          "Acá pagas una vez, la página es tuya y está programada solo con lo que tu negocio necesita.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Puedo editar los textos después?",
        a: "Sí. Para cambios puntuales de texto, precios u horarios está el plan de mantención. Si necesitas editar todos los días conviene incorporar un administrador desde el principio, y eso se cotiza aparte porque cambia la forma de construirla.",
      },
      {
        q: "¿Qué pasa después del primer año con el hosting y el dominio?",
        a: "Se renuevan a tu nombre y el costo lo pagas tú directamente al proveedor, sin intermediarios ni recargo. Te decimos cuánto es antes de empezar para que no sea una sorpresa.",
      },
      {
        q: "¿Aparece en Google?",
        a: "Queda técnicamente preparada para que Google la lea e indexe. Aparecer primero en una búsqueda competida depende además del contenido y del tiempo, y eso no se puede prometer por escrito. Lo que sí garantizamos es que nada del lado técnico te esté frenando.",
      },
      {
        q: "¿Sirve para pauta en Instagram o Google Ads?",
        a: "Está pensada justamente para eso: una promesa, una acción y medición configurada para saber cuántos de los que llegan terminan escribiendo.",
      },
    ],
    prompt:
      "Plano técnico isométrico del despiece de una landing page, estilo lámina de arquitectura. Cuatro planos rectangulares flotando separados en el aire, en isometría real de 30 grados, vistos desde arriba a la izquierda: el plano superior con un titular y un botón sólido, debajo una fila de tres módulos de beneficio con íconos de línea fina, luego un plano de formulario con tres campos y su botón, y al fondo una franja angosta de pie. Cada plano tiene grosor visible en el canto, como una placa, y proyecta una sombra suave sobre el de abajo. Una LÍNEA DE RECORRIDO punteada en azul cobalto entra por el titular, baja atravesando los cuatro planos y termina en el botón del formulario, con pequeños nodos circulares en cada cruce. Alrededor, anotaciones de plano: líneas de cota finas con topes en los extremos midiendo el alto de cada plano, y un par de líneas de llamada apuntando a los botones. Fondo crema con una retícula técnica muy tenue. Todo en escala de grises salvo el azul cobalto, reservado exclusivamente a la línea de recorrido y a los dos botones. Sin ningún texto legible: las cotas y etiquetas son solo trazos. Trazo vectorial nítido y parejo, sin degradados ni brillos, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "sitio",
    tecnologias: [
      { nombre: "React", para: "Interfaz por componentes reutilizables entre las páginas de servicio" },
      { nombre: "Vite", para: "Genera cada página como archivo estático, que es lo que la hace rápida" },
      { nombre: "Tailwind", para: "Un solo sistema de estilos para todo el sitio" },
      { nombre: "Cloudflare Pages", para: "Alojamiento distribuido con despliegue automático al publicar" },
      { nombre: "Administrador propio", para: "Panel acotado a lo que vas a editar, sin licencia mensual" },
    ],
    caso: "paraguayaccess",
    imagen: "/servicios/sitio-corporativo.webp",
    familia: "web",
    nombre: "Sitio corporativo",
    resumen: "Tu marca completa: inicio, servicios, casos y contacto.",
    incluye: ["Cinco secciones esenciales", "Administrador para editar textos", "Base técnica de SEO", "Hosting y dominio el primer año"],
    precios: [290000, 490000, 790000],
    metaTitle: "Sitio web corporativo en Chile desde $290.000 · Maudev",
    metaDescription:
      "Sitio corporativo multipágina para empresas: una página por servicio, casos, contacto y administrador para editar textos. Desde $290.000 + IVA, publicado en 3 a 5 semanas.",
    intro:
      "Un sitio corporativo es el que necesitas cuando tienes más de una cosa que explicar. Cada servicio con su propia página, tu trabajo mostrado y un lugar claro donde te contacten. A diferencia de una landing, aquí la arquitectura importa tanto como el diseño: cómo se ordenan las páginas define si el visitante encuentra lo que vino a buscar.",
    secciones: [
      {
        titulo: "Cuándo dejas de necesitar una landing",
        parrafos: [
          "La señal es simple: si al describir tu negocio usas la palabra \"y\" más de dos veces, una sola página se te queda corta. Un taller que hace mantención, frenos y aire acondicionado no puede meter los tres en la misma página sin que ninguno quede bien explicado.",
          "La otra señal es Google. Una landing compite por una búsqueda; un sitio con una página por servicio compite por tantas búsquedas como servicios tengas. Si alguien busca exactamente lo que ofreces y tú lo tienes escondido en un párrafo dentro de una página general, esa búsqueda se la lleva otro.",
          "Si tu negocio hace una sola cosa muy clara, no subas de nivel: la landing te sirve y cuesta un tercio.",
        ],
      },
      {
        titulo: "Cómo se ordena el sitio",
        parrafos: [
          "Partimos por la arquitectura, antes de diseñar nada. Se define qué páginas existen, qué responde cada una y cómo se enlazan entre sí. Esa decisión es la que después hace que el sitio se entienda o no, y es la más barata de corregir en esta etapa.",
          "El estándar son cinco secciones: inicio, una página por servicio, tu trabajo, quiénes son y contacto. Si tienes seis servicios, son seis páginas de servicio, no una lista con seis párrafos.",
          "Cada página de servicio se escribe pensando en la búsqueda que la trae, con su propio título, su propia descripción y sus propias preguntas frecuentes.",
        ],
      },
      {
        titulo: "Qué recibes y qué puedes editar tú",
        parrafos: [
          "El sitio programado a medida, con administrador para que cambies textos, precios y fotos sin depender de nadie. No es un constructor: es un panel acotado a lo que de verdad vas a editar, para que no puedas romper el diseño por accidente.",
          "Va con la base técnica de SEO en cada página —títulos, descripciones, datos estructurados, sitemap— más el formulario y WhatsApp conectados. Hosting y dominio del primer año incluidos, a tu nombre.",
          "Si más adelante quieres agregar una página de servicio, se agrega sin rehacer el sitio: por eso importa la arquitectura del principio.",
        ],
      },
      {
        titulo: "Cuánto demora y por qué más que una landing",
        parrafos: [
          "Entre tres y cinco semanas. La diferencia con una landing no es programar más páginas: es que hay que decidir y escribir el contenido de cada una, y eso es lo que toma tiempo.",
          "El proyecto avanza por etapas con un enlace que puedes revisar y comentar. No hay una entrega sorpresa al final.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Puedo empezar con una landing y crecer a sitio después?",
        a: "Sí, y a veces conviene: partes vendiendo con una página y creces cuando el negocio lo pida. Pero no se reutiliza el trabajo, así que si ya sabes que necesitas varias páginas, partir directo por el sitio sale más barato que hacer las dos cosas.",
      },
      {
        q: "¿Cuántas páginas de servicio incluye?",
        a: "El precio base cubre cinco secciones. Si tienes más servicios se agregan páginas y eso se cotiza aparte, con el valor por página dicho antes de empezar.",
      },
      {
        q: "¿El administrador tiene costo mensual?",
        a: "No. Va incluido y no tiene licencia. Lo único con costo recurrente son el hosting y el dominio a partir del segundo año, que pagas directo al proveedor.",
      },
      {
        q: "¿Puedo tener blog?",
        a: "Se puede incorporar, pero conviene decidirlo antes: un blog sin alguien que escriba con constancia termina con tres artículos de hace dos años, y eso resta más de lo que suma.",
      },
    ],
    prompt:
      "Plano técnico isométrico de la ARQUITECTURA de un sitio web multipágina, estilo lámina de arquitectura. Un plano rectangular grande arriba representa el inicio; debajo, en un nivel inferior, cuatro planos más pequeños del mismo grosor dispuestos en fila representan las páginas de servicio, y bajo ellos un plano angosto de contacto. Todos en isometría real de 30 grados vistos desde arriba a la izquierda, con canto visible y sombra suave proyectada. Líneas de conexión finas y continuas bajan desde el plano de inicio abriéndose hacia cada una de las cuatro páginas, como un organigrama, con un nodo circular pequeño en cada bifurcación. Una LÍNEA DE RECORRIDO punteada en azul cobalto entra por el inicio, recorre una de las páginas de servicio y termina en el plano de contacto, donde hay un botón sólido cobalto. Alrededor, anotaciones de plano: líneas de cota finas con topes midiendo los niveles, un par de líneas de llamada apuntando a la ramificación, y un cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Todo en escala de grises salvo el azul cobalto, reservado a la línea de recorrido y al botón. Sin ningún texto legible: las etiquetas son solo trazos. Trazo vectorial nítido, sin degradados ni brillos, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "rediseno",
    tecnologias: [
      { nombre: "React", para: "Reconstruye la interfaz sin depender del sistema anterior" },
      { nombre: "Vite", para: "Reemplaza el peso muerto que arrastraba el sitio viejo" },
      { nombre: "Cloudflare Pages", para: "Migración de alojamiento con certificado y caché al día" },
      { nombre: "Redirecciones 301", para: "Cada dirección antigua apunta a su equivalente y no se pierde posicionamiento" },
    ],
    familia: "web",
    nombre: "Rediseño web",
    imagen: "/servicios/rediseno-web.webp",
    resumen: "Tu sitio actual, más rápido y más claro, sin partir de cero.",
    incluye: ["Renovación visual conservando el contenido", "Migración a hosting moderno", "Optimización para celular"],
    precios: [190000, 350000, 590000],
    metaTitle: "Rediseño de página web en Chile desde $190.000 · Maudev",
    metaDescription:
      "Rediseño web conservando tu contenido: más rápido, claro en el celular y ordenado para convertir. Desde $190.000 + IVA, sin partir de cero.",
    intro:
      "Un rediseño no es hacer el sitio otra vez. Es tomar lo que ya tienes —tus textos, tus fotos, tu posicionamiento ganado en Google— y arreglar lo que está frenando las consultas: la velocidad, la lectura en el celular y el orden de la información.",
    secciones: [
      {
        titulo: "Cuándo conviene rediseñar y cuándo rehacer",
        parrafos: [
          "Conviene rediseñar si el contenido sigue siendo válido y el problema es cómo se ve y cómo carga. Ahí se conserva lo que funciona, se corrige lo que estorba y el proyecto cuesta la mitad que empezar de nuevo.",
          "Conviene rehacer si el sitio está montado sobre algo que ya no se puede mantener, si nadie tiene los accesos, o si lo que ofreces cambió tanto que el contenido ya no describe tu negocio. En esos casos el rediseño sale más caro que partir limpio, porque se va el tiempo peleando con lo viejo.",
          "Antes de cotizar revisamos tu sitio y te decimos cuál de los dos es. Si corresponde rehacer, lo decimos aunque sea el servicio más caro.",
        ],
      },
      {
        titulo: "Lo que no se toca: tu posicionamiento",
        parrafos: [
          "Si tu sitio ya aparece en algunas búsquedas, eso tiene valor y es lo primero que se destruye en un rediseño mal hecho: se cambian las direcciones de las páginas, Google pierde el rastro y las visitas caen de un mes a otro.",
          "Por eso el trabajo parte inventariando las URLs que ya existen. Las que se mantienen conservan su dirección; las que cambian quedan redirigidas a su equivalente. Nada se queda sin destino.",
        ],
      },
      {
        titulo: "Qué se corrige",
        parrafos: [
          "La velocidad, que en la mayoría de los sitios heredados se va en imágenes sin optimizar y en complementos que quedaron instalados y nadie usa.",
          "La lectura en el celular, que es de donde llega la mayoría y donde más se pierde: botones demasiado chicos, texto que obliga a hacer zoom, formularios incómodos de llenar con el pulgar.",
          "Y el orden: qué se ve primero, cuántas decisiones se le piden al visitante y dónde está el botón que quieres que toque.",
        ],
      },
      {
        titulo: "Qué necesitas entregar para partir",
        parrafos: [
          "Los accesos al sitio actual y a su hosting. Es el punto donde más proyectos se atrasan: mucha gente no tiene las claves porque las administró alguien que ya no está.",
          "Si no aparecen, se puede reconstruir sobre un hosting nuevo y mover el dominio, pero hay que saberlo antes de empezar porque cambia el plazo.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Pierdo mi posición en Google?",
        a: "No si el rediseño se hace bien. Las URLs que se mantienen conservan su dirección y las que cambian se redirigen. Lo que sí ocurre las primeras semanas es un movimiento normal mientras Google vuelve a rastrear el sitio.",
      },
      {
        q: "¿Se puede conservar el diseño y solo mejorar la velocidad?",
        a: "Sí, y a veces es lo que corresponde. Si tu sitio se ve bien y el problema es que carga lento, se optimiza sin tocar el diseño y sale bastante menos.",
      },
      {
        q: "¿Y si no tengo los accesos?",
        a: "Pasa seguido. Se puede levantar el sitio nuevo en paralelo y apuntar el dominio cuando esté listo, siempre que controles el dominio. Si tampoco lo controlas, ese es el primer trámite y te acompañamos a recuperarlo.",
      },
      {
        q: "¿Incluye textos nuevos?",
        a: "El alcance base conserva tu contenido. Si quieres reescribirlo, se cotiza aparte según cuántas páginas y se dice antes de empezar.",
      },
    ],
    prompt:
      "Plano técnico isométrico de un REDISEÑO web, estilo lámina de arquitectura, con dos estados enfrentados. A la izquierda, un plano rectangular en isometría de 30 grados con su contenido apretado y desordenado: bloques de distinto tamaño amontonados, sin margen, con líneas irregulares. A la derecha, el mismo plano reconstruido: los mismos bloques pero alineados a una retícula, con aire entre ellos y jerarquía clara, y un botón sólido cobalto destacado. Entre ambos, una flecha gruesa de transformación en trazo fino con tres nodos circulares que indican el proceso. Bajo los dos planos, una banda horizontal con pequeños rectángulos que representan las direcciones de las páginas: los del lado izquierdo se conectan uno a uno con los del derecho mediante líneas punteadas cobalto, mostrando que ninguna se pierde. Ambos planos con canto visible y sombra suave. Anotaciones de plano alrededor: líneas de cota con topes, llamadas apuntando a la flecha de transformación y a la banda de direcciones, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a las líneas de correspondencia y al botón. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "ecommerce",
    tecnologias: [
      { nombre: "React", para: "Catálogo y carrito construidos a medida de tu operación" },
      { nombre: "Node.js", para: "Procesa pedidos, stock y estados del lado del servidor" },
      { nombre: "PostgreSQL", para: "Base de datos con transacciones: el stock no se descuenta dos veces" },
      { nombre: "Pasarela de pago", para: "Transbank, Flow o Mercado Pago según lo que convenga a tu volumen" },
      { nombre: "Cloudflare", para: "Alojamiento y protección ante tráfico anómalo" },
    ],
    caso: "partsmr",
    imagen: "/servicios/tienda-online.webp",
    familia: "web",
    nombre: "Tienda online",
    resumen: "Vender 24/7 con carrito, pagos y panel de pedidos.",
    incluye: ["Hasta 50 productos", "Pasarela de pago y transferencia", "Panel de pedidos", "Hosting y dominio el primer año"],
    precios: [390000, 690000, 1290000],
    metaTitle: "Tienda online en Chile desde $390.000 · Ecommerce a medida · Maudev",
    metaDescription:
      "Tienda online con catálogo, pasarela de pago, despacho y panel de pedidos. Desde $390.000 + IVA, con la operación conectada de punta a punta.",
    intro:
      "Una tienda online no termina cuando el cliente paga. Ahí recién empieza: hay que preparar el pedido, descontar el stock, emitir el documento, coordinar el despacho y avisar en qué va. Si esos pasos viven separados, terminas conciliando pedidos a mano y respondiendo \"¿dónde va mi compra?\" todo el día.",
    secciones: [
      {
        titulo: "Lo que decide si una tienda funciona",
        parrafos: [
          "No es el diseño del catálogo: es qué pasa después del pago. Una tienda bonita con el stock desincronizado vende productos que no tiene, y esa es la forma más rápida de perder un cliente para siempre.",
          "Por eso el proyecto parte por tu operación, no por las pantallas. Cuántos productos, si tienen variantes de talla o color, quién prepara los pedidos, cómo despachas y qué documento emites. De esas respuestas sale la tienda.",
        ],
      },
      {
        titulo: "Qué queda conectado",
        parrafos: [
          "Catálogo con hasta 50 productos y sus variantes, pasarela de pago y transferencia como alternativa —en Chile todavía pesa—, y panel de pedidos donde ves cada compra con su estado.",
          "El stock se descuenta solo al confirmarse el pago, así que la tienda nunca ofrece lo que ya no tienes. El cliente recibe su confirmación sin que tengas que escribirla.",
          "Si ya usas un sistema de inventario o de facturación, se puede conectar cuando el proveedor entrega accesos técnicos. Eso se confirma antes de cotizar, no después.",
        ],
      },
      {
        titulo: "Plataforma existente o tienda propia",
        parrafos: [
          "Si vendes productos simples y sin reglas particulares, una plataforma de las que ya existen te sirve y es más barata. Te lo vamos a decir si es tu caso.",
          "La tienda propia se justifica cuando la plataforma te obliga a operar distinto de como opera tu negocio: combinaciones de productos, precios por volumen, despacho con reglas propias, o una comisión por venta que a tu volumen ya duele más que el desarrollo.",
        ],
      },
      {
        titulo: "Cuánto demora y qué necesitas tener listo",
        parrafos: [
          "Entre cinco y ocho semanas. Antes de publicar se prueban pedidos completos de punta a punta: compra, pago, documento y aviso.",
          "Lo que más alarga el proyecto es la información de los productos. Necesitas fotos, descripciones, precios y stock inicial. Si el catálogo es grande, conviene preparar esa planilla mientras se construye la tienda.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Qué comisiones voy a pagar?",
        a: "La pasarela cobra un porcentaje por transacción que va directo a ella, no a nosotros. Te decimos cuánto es antes de empezar y qué alternativas hay, porque a distintos volúmenes conviene una distinta.",
      },
      {
        q: "¿Puedo cargar los productos yo?",
        a: "Sí, el panel permite cargar y editar. Para un catálogo inicial grande podemos hacer una carga masiva desde planilla, y eso se cotiza según cuántos productos y en qué estado esté la información.",
      },
      {
        q: "¿Emite boleta o factura?",
        a: "Se puede integrar con tu emisor de documentos electrónicos si entrega accesos. Si no, el panel deja el pedido listo para emitir desde donde ya lo haces hoy.",
      },
      {
        q: "¿Qué pasa si vendo más de 50 productos?",
        a: "El límite es del alcance base, no de la tienda. Se amplía y se cotiza aparte; el valor por tramo se dice antes de empezar.",
      },
    ],
    prompt:
      "Plano técnico isométrico del FLUJO de una tienda online, estilo lámina de arquitectura. Cuatro planos rectangulares en isometría real de 30 grados vistos desde arriba a la izquierda, dispuestos en escalera descendente de izquierda a derecha: el primero muestra una cuadrícula de tarjetas de producto, el segundo un carrito con una lista de líneas, el tercero un módulo de pago con un botón sólido, y el cuarto un panel de pedidos con filas y un ícono de caja de despacho. Cada plano con canto visible y sombra suave. Una LÍNEA DE RECORRIDO punteada en azul cobalto recorre los cuatro planos de izquierda a derecha con un nodo circular en cada traspaso, y desde el tercero se desprende un ramal corto que vuelve hacia atrás al primero, indicando el descuento de stock. Alrededor, anotaciones de plano: líneas de cota con topes, un par de llamadas apuntando al botón de pago y al ramal de stock, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Todo en escala de grises salvo el azul cobalto, reservado a la línea de recorrido y al botón de pago. Sin ningún texto legible: solo trazos que lo sugieran. Trazo vectorial nítido, sin degradados ni brillos, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "plataforma",
    tecnologias: [
      { nombre: "React", para: "Interfaz de usuario y panel de administración" },
      { nombre: "Node.js", para: "Lógica de negocio, permisos y reglas de cada plan" },
      { nombre: "PostgreSQL", para: "Datos de usuarios y suscripciones, con respaldo automático" },
      { nombre: "Autenticación con sesión", para: "Inicio de sesión, recuperación de clave y roles separados" },
      { nombre: "Cobro recurrente", para: "Integración con la pasarela para suscripciones y vencimientos" },
    ],
    caso: "systempro",
    familia: "web",
    nombre: "Plataforma web",
    imagen: "/servicios/plataforma-web.webp",
    resumen: "Tu propia herramienta en línea, con cuentas y suscripciones.",
    incluye: ["Registro y sesiones", "Panel de administración", "Cobro recurrente"],
    precios: [null, 990000, 1990000],
    metaTitle: "Desarrollo de plataforma web en Chile desde $990.000 · Maudev",
    metaDescription:
      "Plataforma web propia con cuentas de usuario, panel de administración y cobro recurrente. Desde $990.000 + IVA, construida sobre tus reglas de negocio.",
    intro:
      "Una plataforma web es tu propia herramienta en línea: la gente entra con su cuenta, hace algo que solo tú ofreces y tú lo administras desde un panel. No es un sitio que informa, es un producto que se usa — y esa diferencia cambia todo el proyecto, desde cómo se cobra hasta qué pasa cuando algo falla un domingo.",
    secciones: [
      {
        titulo: "Cuándo necesitas una plataforma y no un sitio",
        parrafos: [
          "La señal es que tus usuarios necesitan entrar. Si cada persona ve información distinta —su historial, sus documentos, su avance—, eso ya no es un sitio web: es una plataforma, porque hay cuentas, permisos y datos que proteger.",
          "La segunda señal es que cobras por usarla. Suscripciones, planes o accesos con vencimiento significan cobro recurrente, y eso trae su propia complejidad: qué pasa cuando falla un pago, cómo se suspende una cuenta, cómo se reactiva.",
          "Si tu negocio solo necesita mostrar servicios y recibir consultas, no subas hasta acá: un sitio corporativo cuesta la mitad y hace ese trabajo mejor.",
        ],
      },
      {
        titulo: "Lo que se define antes de programar",
        parrafos: [
          "Quién es cada tipo de usuario y qué puede hacer. Casi todas las plataformas tienen al menos dos roles —quien usa y quien administra— y muchas tienen tres o cuatro. Esa decisión define la estructura completa, y cambiarla después es caro.",
          "Después, el flujo que justifica la plataforma: la acción principal que la persona viene a hacer. Todo lo demás se ordena alrededor de esa.",
          "Y las reglas del cobro, si lo hay: qué incluye cada plan, qué pasa al vencer y si hay periodo de prueba.",
        ],
      },
      {
        titulo: "Qué recibes",
        parrafos: [
          "Registro e inicio de sesión con recuperación de clave, panel para administrar usuarios y contenido, y la integración de cobro recurrente con la pasarela que corresponda.",
          "La infraestructura queda a tu nombre desde el primer día: el código, la base de datos y las cuentas de los servicios que la sostienen. Una plataforma es un activo del negocio, no algo que se arrienda.",
          "Se entrega documentado, con las decisiones técnicas explicadas en castellano, para que otro desarrollador pueda continuarla sin tener que adivinar.",
        ],
      },
      {
        titulo: "Lo que hay que conversar antes: el después",
        parrafos: [
          "Una plataforma no se entrega y se olvida. Tiene usuarios que dependen de ella, así que necesita respaldos, monitoreo y alguien que responda si deja de funcionar.",
          "Eso se acuerda antes de empezar, no después. Puede ser un plan de mantención con nosotros, tu propio equipo, o un tercero — pero tiene que existir, y conviene decidirlo mientras se construye para dejar todo preparado.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Por qué no está disponible en el nivel de entrada?",
        a: "Porque no se puede hacer bien con ese alcance. Una plataforma con cuentas y cobros necesita decisiones de seguridad y pruebas que no caben en un proyecto de entrada, y entregarla a medias es peor que no entregarla.",
      },
      {
        q: "¿Cuántos usuarios soporta?",
        a: "La arquitectura se dimensiona según lo que esperas el primer año, y crece después sin rehacerla. Lo que sí cambia con el volumen es el costo mensual de infraestructura, y te decimos el orden de magnitud antes de empezar.",
      },
      {
        q: "¿Puedo empezar con lo mínimo y crecer?",
        a: "Es lo recomendable. Se define el flujo principal, se publica funcionando y se agrega el resto con usuarios reales usándola. Construir todo antes de que alguien la use es la forma más común de gastar en funciones que nadie pide.",
      },
      {
        q: "¿Quién responde si se cae?",
        a: "Depende de lo que acordemos. Sin un plan de mantención vigente no hay respuesta garantizada fuera del periodo de garantía, y eso conviene tenerlo claro antes de que pase.",
      },
    ],
    prompt:
      "Plano técnico isométrico de la ARQUITECTURA de una plataforma web con cuentas, estilo lámina de arquitectura. Tres planos rectangulares apilados en isometría real de 30 grados vistos desde arriba a la izquierda, separados en el aire y con canto visible: el superior es la puerta de acceso, con un formulario de dos campos y un botón sólido cobalto; el intermedio se divide visiblemente en dos zonas por una línea, una zona de usuario con tarjetas y otra de administración con filas de tabla, indicando roles distintos; el inferior representa los datos, dibujado como una placa con tres franjas horizontales apiladas. A un costado, separado, un módulo pequeño de cobro recurrente conectado al plano intermedio por una línea con un símbolo de ciclo. Una LÍNEA DE RECORRIDO punteada en azul cobalto entra por el acceso, se bifurca en el plano intermedio hacia las dos zonas y baja a los datos, con nodos circulares en cada punto. Anotaciones de plano alrededor: líneas de cota con topes, llamadas apuntando a la división de roles y al módulo de cobro, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a la línea de recorrido y al botón. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "crm",
    tecnologias: [
      { nombre: "React", para: "Interfaz del embudo y de las fichas de contacto" },
      { nombre: "Node.js", para: "Reglas de asignación, etapas y avisos automáticos" },
      { nombre: "PostgreSQL", para: "Historial completo de cada contacto, sin límite de registros" },
      { nombre: "Integración con WhatsApp", para: "Registra la conversación donde de verdad ocurre la venta" },
      { nombre: "Cloudflare", para: "Alojamiento y respaldo automático diario" },
    ],
    familia: "software",
    nombre: "Gestión de clientes",
    imagen: "/servicios/gestion-de-clientes.webp",
    resumen: "Contactos, oportunidades y seguimiento en un solo lugar.",
    incluye: ["Hasta 500 contactos", "Embudo visual", "Avisos por correo", "Hosting incluido"],
    precios: [390000, 690000, 1190000],
    metaTitle: "Sistema de gestión de clientes (CRM) a medida en Chile desde $390.000 · Maudev",
    metaDescription:
      "CRM a medida: contactos, embudo de ventas y seguimiento en un solo lugar, conectado a WhatsApp. Desde $390.000 + IVA, sin licencia por usuario.",
    intro:
      "Un sistema de gestión de clientes guarda con quién hablaste, qué le ofreciste y qué quedó pendiente. Suena obvio, pero en la mayoría de las PYMEs esa información vive repartida entre el teléfono de una persona, una planilla y la memoria de alguien — y se pierde completa el día que esa persona no está.",
    secciones: [
      {
        titulo: "El costo de no tenerlo",
        parrafos: [
          "No es no saber quiénes son tus clientes: es no saber a quién le quedaste debiendo una respuesta. Las ventas que se caen sin ruido son las que nadie volvió a llamar, y por definición no aparecen en ningún reporte.",
          "El segundo costo aparece cuando alguien del equipo se va. Si el seguimiento vivía en su WhatsApp, se fue con él. No es deslealtad, es que nunca hubo otro lugar donde ponerlo.",
          "Si vendes a pocos clientes y cierras rápido, probablemente una planilla ordenada te alcanza y no necesitas esto. Se justifica cuando hay varias conversaciones abiertas a la vez y cada una tiene un siguiente paso distinto.",
        ],
      },
      {
        titulo: "Por qué a medida y no una herramienta de mercado",
        parrafos: [
          "Las herramientas conocidas funcionan bien y son baratas al principio. El problema aparece después: se cobra por usuario y por mes, así que crecer sale caro justo cuando estás creciendo, y traen un embudo pensado para un negocio que no es el tuyo.",
          "Un sistema propio se arma sobre tus etapas reales, no sobre las siete que trae una plantilla, y no cobra por persona agregada.",
          "Ahora bien: si recién estás partiendo, una herramienta de mercado te sirve y cuesta menos que este desarrollo. Conviene hacerlo propio cuando ya sabes cómo vendes y la licencia mensual empieza a pesar.",
        ],
      },
      {
        titulo: "Qué incluye el alcance base",
        parrafos: [
          "Hasta 500 contactos con su ficha e historial, embudo visual con tus etapas, y avisos automáticos por correo cuando algo lleva demasiado tiempo sin moverse — que es la función que de verdad recupera ventas.",
          "Se puede conectar con WhatsApp para que la conversación quede registrada donde ocurre, sin copiar y pegar. Esa integración se confirma antes de cotizar, porque depende de qué tipo de cuenta tengas.",
          "El panel es para tu equipo completo, sin costo por usuario: agregar a alguien no cambia lo que pagas.",
        ],
      },
      {
        titulo: "Lo que decide si se usa o se abandona",
        parrafos: [
          "Que registrar sea más rápido que no registrar. Si anotar un contacto toma seis campos obligatorios, el equipo va a dejar de hacerlo en dos semanas y vas a tener un sistema vacío.",
          "Por eso el diseño parte por definir el mínimo indispensable para que una ficha sirva, y todo lo demás queda opcional. Un sistema con datos incompletos pero vivo vale infinitamente más que uno perfecto que nadie llena.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Puedo migrar lo que tengo en planillas?",
        a: "Sí. Se hace una carga inicial desde tu archivo y se cotiza según cuántos contactos y en qué estado esté la información. Ordenar los datos antes de migrar suele ser la parte más lenta, y conviene saberlo.",
      },
      {
        q: "¿Cobra por usuario como las herramientas conocidas?",
        a: "No. Es tuyo, así que agregar personas no cambia lo que pagas. Lo único con costo recurrente es el alojamiento, que es bajo y va directo al proveedor.",
      },
      {
        q: "¿Qué pasa si supero los 500 contactos?",
        a: "El límite es del alcance base, no del sistema. Se amplía sin rehacerlo y el valor por tramo se dice antes de empezar.",
      },
      {
        q: "¿Se puede ver desde el teléfono?",
        a: "Sí, el panel funciona en el navegador del celular. Si tu equipo necesita registrar en terreno y sin señal, ahí ya corresponde una app interna y se cotiza como tal.",
      },
    ],
    prompt:
      "Plano técnico isométrico de un SISTEMA DE GESTIÓN DE CLIENTES, estilo lámina de arquitectura. Al centro, un plano horizontal grande en isometría real de 30 grados con canto visible, dividido verticalmente en cinco columnas iguales por líneas finas: es un embudo por etapas. Sobre las columnas, pequeñas tarjetas rectangulares apiladas en distinta cantidad por columna, disminuyendo de izquierda a derecha. Encima y a la izquierda, flotando y conectado por una línea, un plano más pequeño que representa la ficha de un contacto, con una franja de encabezado y varias líneas de historial. A la derecha, otro plano pequeño con un símbolo de campana en línea fina, conectado a la tercera columna del embudo por una línea de llamada: es el aviso automático cuando algo se detiene. Una LÍNEA DE RECORRIDO punteada en azul cobalto avanza de columna en columna sobre el embudo, con un nodo circular en cada traspaso, y se detiene con un nodo más grueso en la columna donde está el aviso. Anotaciones de plano alrededor: líneas de cota con topes, una llamada sobre la campana, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a la línea de recorrido y al nodo detenido. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "pos",
    tecnologias: [
      { nombre: "React", para: "Pantalla de caja pensada para usarse rápido y sin errores" },
      { nombre: "Node.js", para: "Registro de ventas, turnos y arqueo del lado del servidor" },
      { nombre: "PostgreSQL", para: "Cada venta queda con transacción: no se pierde ni se duplica" },
      { nombre: "Funcionamiento sin conexión", para: "Sigue vendiendo si se cae internet y sincroniza al volver" },
      { nombre: "Boleta electrónica", para: "Integración con tu emisor autorizado ante el SII" },
    ],
    familia: "software",
    nombre: "Punto de venta",
    imagen: "/servicios/punto-de-venta.webp",
    resumen: "Caja moderna para tu local, conectada al inventario.",
    incluye: ["Una caja y hasta 200 productos", "Boleta electrónica", "Inventario simple"],
    precios: [290000, 490000, 890000],
    metaTitle: "Sistema punto de venta (POS) a medida en Chile desde $290.000 · Maudev",
    metaDescription:
      "Punto de venta para tu local: caja rápida, inventario conectado y boleta electrónica. Funciona sin internet. Desde $290.000 + IVA, sin licencia mensual por caja.",
    intro:
      "Un punto de venta es la pantalla donde tu local cobra. Suena simple, y por eso mismo se subestima: es el único software del negocio que, si falla dos minutos, tienes una fila de gente esperando y mirándote.",
    secciones: [
      {
        titulo: "Lo que se le exige a una caja y no a otro sistema",
        parrafos: [
          "Velocidad por sobre todo. Cobrar tiene que tomar segundos y poder hacerse sin mirar mucho la pantalla; si el flujo exige tres confirmaciones, en hora punta el local se atasca.",
          "Y que no dependa de internet. Un sistema en la nube que se cae cuando falla la conexión deja al local sin poder vender, y eso no es aceptable en un negocio presencial. Por eso el punto de venta guarda en el equipo y sincroniza cuando vuelve la señal.",
          "Esas dos exigencias son las que separan un POS de un panel de administración cualquiera, y las que definen cómo se construye.",
        ],
      },
      {
        titulo: "Qué queda conectado",
        parrafos: [
          "El inventario, que se descuenta en el momento de la venta. Sin eso, el stock del sistema y el de la bodega se separan en una semana y el sistema deja de servir para decidir compras.",
          "La boleta electrónica, integrada con tu emisor autorizado ante el SII. Se confirma antes de cotizar cuál usas, porque no todos entregan accesos técnicos.",
          "Y el cierre de caja: turnos, arqueo y diferencias. Es la función que menos se pide al principio y la que más se agradece al mes de uso.",
        ],
      },
      {
        titulo: "A medida o una solución de mercado",
        parrafos: [
          "Si vendes productos simples, con una caja y sin reglas particulares, hay soluciones de mercado que te sirven y salen más baratas. Te lo vamos a decir si es tu caso.",
          "El desarrollo propio se justifica cuando tu forma de vender no calza: combinaciones de productos, precios por cliente, promociones con reglas tuyas, o cuando la mensualidad por caja, multiplicada por sucursales y por años, ya supera lo que cuesta construirlo una vez.",
        ],
      },
      {
        titulo: "Qué necesitas tener resuelto",
        parrafos: [
          "El hardware: qué equipo va a estar en el mostrador, si hay lector de códigos, impresora de boletas y cajón de dinero. El sistema se adapta a lo que tienes, pero hay que saberlo antes.",
          "Y el catálogo con precios y stock inicial. Es lo que más demora, sobre todo si hoy los precios viven en la cabeza de alguien.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Funciona si se cae internet?",
        a: "Sí. Sigue vendiendo con los datos guardados en el equipo y sincroniza cuando vuelve la conexión. Lo que sí requiere internet es la emisión de boleta electrónica, porque depende del SII; esas quedan en cola y se emiten al reconectar.",
      },
      {
        q: "¿Cuántas cajas incluye?",
        a: "El alcance base cubre una caja y hasta 200 productos. Sumar cajas o sucursales se cotiza aparte, y el valor por tramo se dice antes de empezar.",
      },
      {
        q: "¿Sirve con el hardware que ya tengo?",
        a: "En la mayoría de los casos sí: lectores e impresoras estándar funcionan. Se revisa tu equipamiento antes de cotizar, porque algunos modelos antiguos tienen limitaciones y es mejor saberlo al principio.",
      },
      {
        q: "¿Hay mensualidad?",
        a: "No por el sistema, que es tuyo. Lo que sí tiene costo recurrente es el alojamiento —bajo, directo al proveedor— y tu emisor de boleta electrónica, si cobra por documento.",
      },
    ],
    prompt:
      "Plano técnico isométrico de un SISTEMA PUNTO DE VENTA, estilo lámina de arquitectura. Al centro, un plano rectangular en isometría real de 30 grados con canto visible que representa la pantalla de caja, dividido en dos zonas por una línea fina: a la izquierda una cuadrícula de botones de producto, a la derecha una columna con líneas de detalle y un total destacado, más un botón sólido cobalto de cobro abajo. A la izquierda del plano y conectados por líneas de llamada cortas, tres módulos pequeños dibujados en línea fina: un lector de códigos, una impresora con una tira de papel saliendo y un cajón de dinero. A la derecha y arriba, separado, un plano pequeño de inventario con filas apiladas, unido a la pantalla de caja por una línea punteada cobalto con una flecha que apunta hacia el inventario, indicando el descuento de stock en el momento de la venta. Bajo la pantalla de caja, un símbolo de nube tachado con equis fina y una pequeña placa de almacenamiento local conectada, indicando que sigue vendiendo sin internet. Anotaciones de plano alrededor: líneas de cota con topes, una llamada sobre el símbolo sin conexión, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado al botón de cobro y a la línea de descuento de stock. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "integracion",
    familia: "software",
    nombre: "Integración entre sistemas",
    imagen: "/servicios/integracion-entre-sistemas.webp",
    resumen: "Conectamos tus herramientas para que dejen de copiarse a mano.",
    incluye: ["Una integración punto a punto", "Documentación de lo conectado"],
    precios: [190000, 390000, 690000],
    tecnologias: [
      { nombre: "n8n", para: "Orquesta el flujo y deja el historial de cada ejecución" },
      { nombre: "API REST y webhooks", para: "La forma en que un sistema le avisa al otro que algo cambió" },
      { nombre: "Node.js", para: "Las transformaciones que ninguna herramienta resuelve sola" },
      { nombre: "Cola con reintentos", para: "Si el otro sistema está caído, el dato espera en vez de perderse" },
      { nombre: "Registro de sincronización", para: "Qué se envió, cuándo y con qué resultado, para poder auditarlo" },
    ],
    metaTitle: "Integración entre sistemas en Chile desde $190.000 · Maudev",
    metaDescription:
      "Conectamos tus sistemas para que dejen de copiarse a mano: ventas, clientes y stock sincronizados, con reintentos y registro. Desde $190.000 + IVA.",
    intro:
      "Casi siempre el problema no es que falte un sistema, sino que hay dos y alguien los mantiene iguales a mano. Ese alguien copia, se equivoca poco pero se equivoca, y cuando los números no calzan nadie sabe cuál de los dos tiene la razón.",
    secciones: [
      {
        titulo: "Lo difícil no es el código",
        parrafos: [
          "Conectar dos sistemas técnicamente es rutinario. Lo que toma tiempo es decidir dos cosas que nadie tiene escritas: cuál de los dos manda cuando se contradicen, y qué pasa con lo que ya está mal en ambos.",
          "Si esa decisión no se toma antes, la integración la toma sola y en silencio: empieza a pisar datos buenos con datos viejos, y eso se descubre semanas después.",
          "Por eso la conversación parte definiendo la fuente de verdad de cada campo. Es la parte aburrida y es la que decide si esto funciona.",
        ],
      },
      {
        titulo: "Qué necesitan tener tus sistemas",
        parrafos: [
          "Una puerta de entrada y salida. Puede ser una API, un webhook o incluso un archivo que se deja en un lugar acordado. Lo revisamos antes de cotizar, porque hay software administrativo que en Chile todavía solo exporta planillas.",
          "Cuando no hay API, la integración igual se puede hacer, pero cambia: pasa a ser por archivo y programada, no instantánea. Eso se dice antes, no después de firmar.",
        ],
      },
      {
        titulo: "Qué pasa cuando falla",
        parrafos: [
          "Va a fallar alguna vez: el otro sistema se cae, cambia un campo o rechaza un dato. La diferencia entre una integración útil y una peligrosa es qué ocurre en ese momento.",
          "Acá lo que falla queda en cola y se reintenta; si igual no pasa, llega un aviso. Nunca se descarta en silencio, porque una integración que pierde datos sin avisar es peor que copiar a mano: uno confía en ella y deja de revisar.",
        ],
      },
      {
        titulo: "Cuándo no necesitas esto",
        parrafos: [
          "Si mueves pocos registros al día y tus dos herramientas son populares, es probable que ya exista una conexión hecha, o que armarla en una herramienta de automatización te salga bastante más barato. Te lo vamos a decir.",
          "El trabajo a medida se justifica cuando el dato tiene que transformarse en el camino, cuando hay reglas tuyas de por medio, o cuando el volumen hace que un error manual salga caro.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Y si uno de mis sistemas no tiene API?",
        a: "Se puede igual, por archivo: uno exporta, la integración lo lee y lo carga en el otro. Deja de ser instantánea y pasa a correr cada cierto tiempo. Revisamos tus sistemas antes de cotizar para decirte cuál de los dos escenarios es el tuyo.",
      },
      {
        q: "¿Sincroniza en los dos sentidos?",
        a: "El valor de entrada cubre una integración en un sentido, que es lo que resuelve la mayoría de los casos. La sincronización en ambos sentidos cuesta más porque hay que definir qué gana cuando los dos cambian el mismo dato.",
      },
      {
        q: "¿Cómo sé que está funcionando?",
        a: "Queda un registro de cada sincronización: qué se envió, cuándo y con qué resultado. Los errores avisan en vez de acumularse callados.",
      },
      {
        q: "¿Qué pasa si el otro sistema cambia?",
        a: "Si cambian su API o sus campos, hay que ajustar. No es frecuente, pero pasa; por eso se entrega documentado, para que el arreglo sea corto y no una reconstrucción.",
      },
    ],
    prompt:
      "Plano técnico isométrico de una INTEGRACIÓN ENTRE SISTEMAS, estilo lámina de arquitectura. A la izquierda y a la derecha, dos planos rectangulares en isometría real de 30 grados con canto visible, cada uno con filas de datos apiladas en línea fina, representando dos sistemas distintos. Al centro y algo más abajo, un módulo hexagonal pequeño de orquestación con tres puertos visibles. Del sistema izquierdo sale una línea cobalto continua con flecha hacia el módulo central, y del módulo otra línea cobalto con flecha hacia el sistema derecho, marcando un solo sentido. Bajo el módulo central, una pequeña bandeja de cola con tres fichas apiladas y una flecha curva de reintento que vuelve al módulo. A un costado, un plano diminuto de bitácora con filas y marcas de verificación. Anotaciones de plano alrededor: líneas de cota con topes, una llamada sobre la bandeja de cola y otra sobre el sistema de la izquierda señalándolo como origen. Cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a las líneas de flujo y a la flecha de reintento. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "automatizacion",
    familia: "software",
    nombre: "Automatización de procesos",
    imagen: "/servicios/automatizacion-de-procesos.webp",
    resumen: "Las tareas repetitivas, hechas solas y a toda hora.",
    incluye: ["Un flujo automatizado", "Reglas verificables", "Hasta 1.000 ejecuciones al mes"],
    precios: [290000, 490000, 890000],
    tecnologias: [
      { nombre: "n8n", para: "Motor del flujo, con historial visible de cada ejecución" },
      { nombre: "Node.js", para: "Los pasos que ninguna herramienta resuelve tal cual" },
      { nombre: "Webhooks y tareas programadas", para: "Dispara al ocurrir algo o a una hora fija, según convenga" },
      { nombre: "PostgreSQL", para: "Deja registro de lo procesado para no repetir ni saltarse nada" },
      { nombre: "Avisos por correo o WhatsApp", para: "Si algo se cae, te enteras el mismo día" },
    ],
    metaTitle: "Automatización de procesos en Chile desde $290.000 · Maudev",
    metaDescription:
      "Automatizamos la tarea repetitiva que hoy hace una persona a mano: reglas claras, registro de cada ejecución y aviso si algo falla. Desde $290.000 + IVA.",
    intro:
      "Hay trabajos que alguien de tu equipo hace todos los días, siempre igual, y que no requieren criterio: bajar datos de un lado, ordenarlos, enviarlos, avisar. Esa parte se puede dejar corriendo sola. La que sí requiere criterio, no.",
    secciones: [
      {
        titulo: "Qué se puede automatizar de verdad",
        parrafos: [
          "Una tarea es automatizable cuando puedes escribir sus reglas sin usar la palabra depende. Si al explicarla aparecen excepciones que se resuelven mirando el caso, esa parte se queda con la persona y se automatiza el resto.",
          "Y suele valer la pena igual: en la mayoría de los procesos, lo repetitivo es el ochenta por ciento del tiempo y las excepciones son un puñado al mes.",
          "El diagnóstico parte por ahí, mirando cómo lo haces hoy. No por elegir una herramienta.",
        ],
      },
      {
        titulo: "Automatizar un proceso malo lo empeora",
        parrafos: [
          "Si el proceso actual tiene pasos que ya no sirven, o corrige a mano errores de más atrás, automatizarlo tal cual multiplica el problema: ahora se hace mal más rápido y sin que nadie lo mire.",
          "Por eso primero se ordena y recién después se automatiza. A veces ese solo ejercicio elimina la mitad de los pasos y el trabajo que queda es mucho más chico de lo que parecía.",
        ],
      },
      {
        titulo: "Tiene que poder mirarse",
        parrafos: [
          "Un proceso automático que corre sin dejar rastro es un problema esperando: nadie sabe si funcionó hasta que alguien nota que falta algo.",
          "Acá cada ejecución queda registrada con lo que entró, lo que salió y el resultado. Si falla, avisa el mismo día en vez de acumular silencio.",
          "También se define qué hacer con lo que falló: reintentar, dejarlo en espera para revisión manual, o detener el flujo. No todos los procesos toleran lo mismo.",
        ],
      },
      {
        titulo: "Qué pedimos de tu lado",
        parrafos: [
          "Que la persona que hoy hace la tarea nos la muestre haciéndola. Media hora mirando vale más que un documento, porque en la práctica siempre hay pasos que nadie escribió.",
          "Y los accesos a los sistemas involucrados. Es lo que más demora en estos proyectos, sobre todo cuando dependen de un proveedor externo.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Con qué se construye?",
        a: "Con n8n cuando alcanza, que es la mayoría de las veces y sale más barato, y con código propio en los pasos donde ninguna herramienta calza. Se elige después de ver el proceso, no antes.",
      },
      {
        q: "¿Qué pasa si el flujo se cae?",
        a: "Se reintenta y, si no resulta, llega un aviso con el detalle. Lo que quedó a medias se puede retomar desde donde iba, porque queda registro de lo ya procesado.",
      },
      {
        q: "¿Cuántas ejecuciones incluye?",
        a: "El alcance base cubre un flujo y hasta 1.000 ejecuciones al mes. Si tu volumen es mayor, se dimensiona antes y el costo de alojamiento se dice por separado.",
      },
      {
        q: "¿Reemplaza a una persona?",
        a: "Reemplaza una tarea, no a alguien. En general la persona sigue, pero deja de copiar datos y pasa a revisar excepciones, que es donde su criterio sí sirve.",
      },
      {
        q: "¿Puedo cambiar las reglas después?",
        a: "Sí. Se entrega documentado y con acceso, para que ajustar una regla sea un cambio corto y no una reconstrucción.",
      },
    ],
    prompt:
      "Plano técnico isométrico de una AUTOMATIZACIÓN DE PROCESOS, estilo lámina de arquitectura. Al centro, una secuencia de cuatro módulos hexagonales pequeños en isometría real de 30 grados con canto visible, alineados en diagonal y unidos por líneas cobalto continuas con flechas, representando los pasos de un flujo. El primer módulo recibe una flecha de entrada desde una bandeja de documentos apilados dibujada en línea fina a la izquierda. El último entrega hacia un plano de resultado a la derecha, con filas ordenadas y marcas de verificación. Desde el tercer módulo sale una bifurcación punteada hacia abajo que termina en una bandeja pequeña de excepciones con una sola ficha, indicando lo que queda para revisión humana. Bajo la secuencia, un plano alargado y bajo de bitácora con filas de registro. En un costado, un símbolo pequeño de reloj de tarea programada conectado por línea corta al primer módulo. Anotaciones de plano alrededor: líneas de cota con topes, una llamada sobre la bandeja de excepciones y otra sobre la bitácora. Cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a la línea principal del flujo y a la bifurcación de excepciones. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "erp",
    familia: "software",
    nombre: "Sistema de gestión",
    imagen: "/servicios/sistema-de-gestion.webp",
    resumen: "Inventario, compras, ventas y documentos en una sola herramienta.",
    incluye: ["Módulos según tu operación", "Usuarios y permisos", "Reportes"],
    precios: [null, 1290000, 2490000],
    tecnologias: [
      { nombre: "React", para: "Interfaz de los módulos y del panel de administración" },
      { nombre: "Node.js", para: "Reglas de negocio y validaciones del lado del servidor" },
      { nombre: "PostgreSQL", para: "Transacciones: el stock y los saldos no quedan a medias" },
      { nombre: "Roles y permisos", para: "Quién ve costos, quién aprueba y quién solo registra" },
      { nombre: "Reportes exportables", para: "Salida a planilla para lo que tu contador o tu banco pidan" },
      { nombre: "Respaldo automático", para: "Copias diarias, porque acá vive la operación completa" },
    ],
    metaTitle: "Sistema de gestión a medida en Chile desde $1.290.000 · Maudev",
    metaDescription:
      "Inventario, compras, ventas y documentos en una sola herramienta, hecha a la medida de tu operación. Por módulos y en producción desde el primero. Desde $1.290.000 + IVA.",
    intro:
      "Este es el proyecto más grande del catálogo y el que más seguido sale mal en manos de cualquiera. No por lo técnico: porque se aborda entero, de una vez, y termina siendo un sistema que lleva un año en desarrollo y todavía nadie usa.",
    secciones: [
      {
        titulo: "Por módulos, y en producción desde el primero",
        parrafos: [
          "Se parte por el módulo que más duele hoy, se pone a funcionar de verdad con tu gente usándolo, y recién entonces se suma el siguiente. Cada etapa entrega algo que ya sirve.",
          "Esto tiene una ventaja que no es solo de plazos: el segundo módulo se diseña sabiendo cómo usaron el primero, y casi siempre resulta distinto de lo que se había planificado en el papel.",
          "El riesgo del camino contrario es concreto. Un sistema que se especifica completo al principio se construye contra suposiciones, y las suposiciones sobre la operación propia son las que peor envejecen.",
        ],
      },
      {
        titulo: "Por qué no tiene valor de entrada",
        parrafos: [
          "Bajo cierto tamaño, esto no conviene y no vamos a fingir que sí. Si tu operación cabe en un par de planillas ordenadas y una herramienta de mercado, esa es la respuesta correcta y sale una fracción.",
          "En Chile hay opciones conocidas —Defontana, Bsale, Nubox, un Odoo bien configurado— que resuelven la operación estándar. Vale la pena mirarlas antes.",
          "El desarrollo propio empieza a tener sentido cuando tu forma de operar no calza con ninguna, cuando pagas licencias por usuario que ya pesan en el presupuesto, o cuando estás sosteniendo el sistema de mercado con planillas paralelas para lo que no cubre.",
        ],
      },
      {
        titulo: "Los datos que ya tienes",
        parrafos: [
          "Migrar lo existente es la parte menos vistosa y la que más determina si el sistema se usa. Un sistema nuevo que arranca con datos incompletos pierde la confianza de la gente en la primera semana, y de ahí vuelven todos al Excel.",
          "Se revisa qué hay, qué se limpia y qué se deja fuera a propósito. A veces la decisión correcta es no arrastrar años de historia y empezar con lo vigente, dejando lo antiguo en consulta.",
        ],
      },
      {
        titulo: "Se usa o no sirve",
        parrafos: [
          "Un sistema de gestión compite todos los días contra la planilla que tu equipo ya domina. Si registrar algo toma más pasos que antes, pierde, por bueno que sea por dentro.",
          "Por eso los módulos se diseñan mirando a quien va a cargar los datos, no solo a quien va a ver los reportes. Y la puesta en marcha incluye acompañar esas primeras semanas, que es cuando se decide si quedó instalado o quedó abandonado.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Por qué no hay un plan de entrada?",
        a: "Porque bajo cierto tamaño no se justifica construirlo. Si tu caso es ese, te lo decimos y te orientamos hacia una herramienta de mercado, aunque no nos compres nada.",
      },
      {
        q: "¿Cuánto demora?",
        a: "El primer módulo en producción se mide en semanas, no en meses. El sistema completo depende de cuántos módulos sean, y por eso se avanza de a uno con algo utilizable en cada etapa.",
      },
      {
        q: "¿Emite documentos tributarios?",
        a: "Se integra con tu emisor autorizado ante el SII, no lo reemplaza. Se confirma cuál usas antes de cotizar, porque no todos entregan accesos técnicos.",
      },
      {
        q: "¿Qué pasa con lo que tengo hoy en planillas?",
        a: "Se migra lo que valga la pena. Parte del trabajo es decidir qué se limpia y qué se deja fuera: arrastrar datos malos a un sistema nuevo es la forma más rápida de que nadie lo use.",
      },
      {
        q: "¿El sistema es mío?",
        a: "Sí, incluido el código. No hay licencia por usuario ni mensualidad por usarlo; lo recurrente es el alojamiento, que se paga directo al proveedor.",
      },
    ],
    prompt:
      "Plano técnico isométrico de un SISTEMA DE GESTIÓN, estilo lámina de arquitectura. Al centro y abajo, un plano rectangular amplio en isometría real de 30 grados con canto grueso visible, que actúa de base común y muestra filas de datos en línea fina. Sobre esa base, cuatro planos más pequeños del mismo grosor, dispuestos en cuadrícula isométrica y separados entre sí, cada uno con un contenido distinto dibujado en línea fina: cajas apiladas para inventario, un documento con líneas para compras, una curva ascendente simple para ventas y una hoja con sello para documentos. Cada módulo baja a la base por una línea corta cobalto con punto de conexión, mostrando que comparten los mismos datos. Uno de los cuatro módulos está dibujado con línea continua y relleno tenue cobalto, y los otros tres en línea punteada, indicando que se construyen por etapas. A un costado, una columna vertical delgada de control de acceso con tres niveles marcados por candados diminutos. Anotaciones de plano alrededor: líneas de cota con topes, una llamada sobre el módulo activo y otra sobre la base compartida. Cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado al módulo activo y a las conexiones con la base. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "pwa",
    tecnologias: [
      { nombre: "React", para: "Interfaz que se comporta como app, no como sitio" },
      { nombre: "Service Worker", para: "Guarda la app en el dispositivo y la hace funcionar sin señal" },
      { nombre: "IndexedDB", para: "Almacena los datos locales mientras no hay conexión" },
      { nombre: "Web Push", para: "Notificaciones donde el sistema operativo las permite" },
      { nombre: "Cloudflare", para: "Alojamiento en tu dominio, sin tiendas de aplicaciones de por medio" },
    ],
    familia: "apps",
    nombre: "App web instalable",
    imagen: "/servicios/app-web-instalable.webp",
    resumen: "Se instala desde el navegador y funciona sin señal.",
    incluye: ["Instalable en celular y escritorio", "Funciona sin conexión", "Notificaciones"],
    precios: [290000, 490000, 790000],
    metaTitle: "App web instalable (PWA) en Chile desde $290.000 · Maudev",
    metaDescription:
      "App que se instala desde el navegador, funciona sin señal y envía notificaciones. Sin tiendas de aplicaciones ni comisiones. Desde $290.000 + IVA.",
    intro:
      "Una app web instalable es una aplicación que vive en el navegador pero se comporta como una app: el usuario la agrega a su pantalla de inicio, se abre sin barra de direcciones y sigue funcionando aunque se caiga la señal. No pasa por App Store ni por Google Play.",
    secciones: [
      {
        titulo: "Por qué evitar las tiendas cambia el proyecto",
        parrafos: [
          "Publicar en las tiendas tiene tres costos que casi nadie calcula al empezar: la cuenta de desarrollador se paga todos los años, cada actualización pasa por revisión y puede rechazarse, y si cobras suscripciones dentro de la app, Apple y Google se quedan con una comisión.",
          "Una app instalable se salta los tres. Se actualiza sola cuando publicas —el usuario abre y ya tiene la versión nueva, sin descargar nada— y lo que cobres es tuyo.",
          "El costo de esa libertad es visibilidad: nadie te va a encontrar buscando en la tienda. Tienes que llevar tú a la gente, con un enlace. Si tu app depende de que la descubran ahí, esta no es la opción.",
        ],
      },
      {
        titulo: "Qué puede y qué no puede hacer",
        parrafos: [
          "Puede funcionar sin conexión, guardar datos en el dispositivo, enviar notificaciones, usar la cámara y la ubicación. Para la mayoría de los usos de negocio, eso alcanza y sobra.",
          "No llega al mismo nivel que una app nativa en acceso profundo al sistema, integración con el hardware o rendimiento gráfico exigente. Si tu app necesita algo de eso, corresponde una nativa y te lo vamos a decir.",
          "En iPhone hay algunas limitaciones adicionales respecto de Android, sobre todo en notificaciones. Se revisa caso a caso antes de cotizar, porque puede cambiar la decisión.",
        ],
      },
      {
        titulo: "Para qué se usa normalmente",
        parrafos: [
          "Herramientas internas de equipos que trabajan en terreno y no siempre tienen señal: registro de visitas, checklists, levantamiento de datos.",
          "Portales de cliente donde la persona entra seguido y agradece tenerlo a un toque en vez de buscar el enlace cada vez.",
          "Y como primer paso antes de una app nativa: se valida que la gente la use antes de invertir en publicarla en las tiendas.",
        ],
      },
      {
        titulo: "Qué recibes",
        parrafos: [
          "La app funcionando y publicada en tu dominio, instalable desde el navegador en Android, iPhone y escritorio. Con funcionamiento sin conexión para lo esencial y notificaciones configuradas donde el sistema lo permita.",
          "Queda alojada a tu nombre. Como no depende de ninguna tienda, no hay cuentas de desarrollador que renovar ni revisiones que esperar.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Se instala igual en iPhone que en Android?",
        a: "El resultado es parecido pero el camino es distinto: en Android el navegador ofrece instalarla solo; en iPhone hay que usar la opción de compartir y agregar a la pantalla de inicio. Se puede incluir una guía dentro de la app para que el usuario no se pierda.",
      },
      {
        q: "¿Puedo llevarla después a las tiendas?",
        a: "Sí, se puede empaquetar para publicarla, y ahí sí aplican las cuentas de desarrollador y las revisiones. Partir por la instalable y decidir después es más barato que al revés.",
      },
      {
        q: "¿Funciona completamente sin internet?",
        a: "Funciona sin conexión lo que se defina que debe funcionar: normalmente ver lo ya cargado y registrar datos que se sincronizan al volver la señal. Lo que necesite consultar información en vivo va a requerir conexión igual.",
      },
      {
        q: "¿Ocupa espacio en el teléfono?",
        a: "Muy poco comparado con una app de tienda, porque no se descarga un paquete completo: guarda solo lo necesario para abrir y funcionar sin señal.",
      },
    ],
    prompt:
      "Plano técnico isométrico de una APP WEB INSTALABLE, estilo lámina de arquitectura. Al centro, un plano rectangular vertical con proporción de teléfono en isometría real de 30 grados, con canto visible y sombra suave, mostrando una cuadrícula de módulos de interfaz. Desde el borde izquierdo del teléfono sale una flecha curva fina hacia un marco de navegador simplificado situado atrás y arriba, indicando que la app viene del navegador y no de una tienda. A la derecha del teléfono, dos símbolos técnicos pequeños dibujados en línea: un ícono de nube tachado con una equis fina, que representa el funcionamiento sin conexión, y un ícono de campana, que representa las notificaciones; ambos conectados al teléfono por líneas de llamada. Un badge circular sólido en azul cobalto sobre la esquina del teléfono marca la acción de instalar. Anotaciones de plano alrededor: líneas de cota con topes midiendo el teléfono, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado al badge de instalación y a la flecha de origen. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "app-interna",
    tecnologias: [
      { nombre: "React Native", para: "Una base de código para Android y iPhone" },
      { nombre: "Expo", para: "Distribución interna a los equipos, sin publicar en tiendas" },
      { nombre: "SQLite local", para: "Registro en terreno aunque no haya señal" },
      { nombre: "Sincronización diferida", para: "Sube lo registrado cuando vuelve la conexión, sin perder nada" },
      { nombre: "PostgreSQL", para: "Base central donde el panel ve todo consolidado" },
    ],
    familia: "apps",
    nombre: "App para tu equipo",
    imagen: "/servicios/app-para-tu-equipo.webp",
    resumen: "Una app para uso interno, no para el público.",
    incluye: ["Hasta 20 usuarios", "Un flujo principal", "Distribución interna"],
    precios: [590000, 890000, 1490000],
    metaTitle: "App interna para empresas en Chile desde $590.000 · Maudev",
    metaDescription:
      "App para uso interno de tu equipo: un flujo de trabajo resuelto en el teléfono, con distribución privada. Desde $590.000 + IVA, sin publicar en tiendas.",
    intro:
      "Una app interna la usa tu equipo, no tus clientes. Reemplaza el cuaderno, la planilla compartida o el grupo de WhatsApp donde hoy se registran las cosas en terreno — y con eso deja de perderse información entre lo que pasa y lo que alguien alcanza a anotar después.",
    secciones: [
      {
        titulo: "El problema que resuelve",
        parrafos: [
          "En casi todos los equipos que trabajan fuera de la oficina hay un desfase: la persona hace el trabajo, lo anota en un papel o lo manda por mensaje, y alguien más lo pasa a un sistema horas o días después. En ese traspaso se pierde información, se cometen errores de tipeo y nadie sabe el estado real hasta que alguien consolida.",
          "Una app interna elimina el traspaso. Se registra donde ocurre, con la foto o la firma si corresponde, y queda disponible al instante para el resto.",
          "Si tu equipo trabaja siempre frente a un computador, probablemente no necesitas una app: un panel web hace lo mismo y cuesta menos. Esto se justifica cuando el trabajo ocurre de pie y en movimiento.",
        ],
      },
      {
        titulo: "Un flujo, no un sistema completo",
        parrafos: [
          "El alcance base resuelve un flujo principal: la tarea que tu equipo repite todos los días. Registrar una visita, completar una revisión, levantar un pedido, reportar un incidente.",
          "Concentrarse en uno no es una limitación, es la forma de que se use. Las apps internas que intentan cubrir todo desde el primer día terminan siendo tan pesadas que el equipo vuelve al cuaderno.",
          "Una vez que ese flujo está funcionando y la gente lo adoptó, se agregan los siguientes con datos reales de por medio.",
        ],
      },
      {
        titulo: "Cómo llega al teléfono de tu equipo",
        parrafos: [
          "Con distribución interna: se instala directamente en los dispositivos del equipo sin pasar por App Store ni Google Play. No hay revisión que esperar ni cuenta de desarrollador que renovar, y la app no queda visible para nadie fuera de tu empresa.",
          "El alcance base cubre hasta veinte usuarios. Sobre eso se amplía y se cotiza, con el valor por tramo dicho antes de empezar.",
        ],
      },
      {
        titulo: "Lo que hay que resolver antes de programar",
        parrafos: [
          "Quién la va a usar y en qué condiciones. Un equipo que trabaja con guantes, bajo el sol o con una mano ocupada necesita botones grandes y pocos pasos; eso cambia el diseño completo, no es un detalle de estilo.",
          "Y qué pasa sin señal. Si trabajan en lugares sin cobertura, la app tiene que guardar y sincronizar después, y eso hay que decidirlo desde el principio porque cambia cómo se construye.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Los datos quedan en el teléfono o en un servidor?",
        a: "En un servidor a tu nombre, con copia local para que la app funcione sin señal. Si un teléfono se pierde, la información no se va con él y el acceso de esa persona se revoca desde el panel.",
      },
      {
        q: "¿Qué pasa cuando alguien deja la empresa?",
        a: "Se le quita el acceso desde el panel y la app deja de funcionar en su dispositivo. Por eso importa que sea con cuentas y no con un archivo instalado suelto.",
      },
      {
        q: "¿Puede conectarse con lo que ya usamos?",
        a: "Si tu sistema actual entrega accesos técnicos, sí. Se confirma antes de cotizar, porque no todos los proveedores los abren y eso cambia el alcance.",
      },
      {
        q: "¿Sirve en teléfonos antiguos?",
        a: "Se define el mínimo según los equipos que tenga tu gente hoy. Conviene revisarlo al principio: diseñar para dispositivos que nadie del equipo tiene es gastar de más.",
      },
    ],
    prompt:
      "Plano técnico isométrico de una APP INTERNA de equipo, estilo lámina de arquitectura. A la izquierda, tres planos verticales con proporción de teléfono en isometría real de 30 grados, escalonados y ligeramente superpuestos, todos mostrando la misma pantalla de formulario con campos y un botón sólido cobalto: representan varios dispositivos del mismo equipo. A la derecha, separado, un plano horizontal más grande que representa el panel de administración, con filas de tabla y una columna de estados. Entre los teléfonos y el panel, tres líneas de sincronización punteadas en azul cobalto con nodos circulares, todas convergiendo desde los dispositivos hacia el panel en una sola dirección. Sobre una de las líneas, un pequeño símbolo de nube tachado con equis fina indica que el registro sigue funcionando sin señal y se sincroniza después. Todos los planos con canto visible y sombra suave. Anotaciones de plano alrededor: líneas de cota con topes, una llamada apuntando al símbolo de sin señal, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a las líneas de sincronización y al botón. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "app-multi",
    tecnologias: [
      { nombre: "React Native", para: "Una sola base de código que corre en Android y en iPhone" },
      { nombre: "Expo", para: "Compila y publica en ambas tiendas desde el mismo proyecto" },
      { nombre: "Actualizaciones al aire", para: "Correcciones que llegan sin pasar por revisión de la tienda" },
      { nombre: "Node.js", para: "Servidor propio para la lógica y los datos de la app" },
      { nombre: "PostgreSQL", para: "Base central, con respaldo automático" },
    ],
    familia: "apps",
    nombre: "App multiplataforma",
    imagen: "/servicios/app-multiplataforma.webp",
    resumen: "Un solo desarrollo que corre en Android y iPhone.",
    incluye: ["Sesión y tres pantallas", "Publicación en una tienda", "Base para crecer"],
    precios: [890000, 1290000, 2290000],
    metaTitle: "Desarrollo de app multiplataforma en Chile desde $890.000 · Maudev",
    metaDescription:
      "App para Android y iPhone desde un solo desarrollo, publicada a tu nombre en ambas tiendas. Desde $890.000 + IVA, con actualizaciones sin esperar revisión.",
    intro:
      "Una app multiplataforma se programa una vez y corre en Android y en iPhone. Es la diferencia entre pagar un desarrollo o dos, y entre mantener un código o dos cada vez que quieras cambiar algo — que es donde el costo real aparece, no en el primer proyecto sino en el tercer año.",
    secciones: [
      {
        titulo: "Una base o dos: lo que se gana y lo que se cede",
        parrafos: [
          "Con una sola base, cada corrección y cada función nueva llega a los dos sistemas al mismo tiempo. Con desarrollos separados, todo se hace dos veces y las versiones se desincronizan: la de Android tiene algo que la de iPhone todavía no.",
          "Lo que se cede es acceso a lo último de cada sistema. Cuando Apple o Google publican una función nueva, pasa un tiempo antes de que se pueda usar desde acá. Para la enorme mayoría de las apps de negocio eso no importa; si tu app depende de una capacidad recién salida, corresponde nativa.",
          "También se cede algo de rendimiento en casos extremos: animaciones muy exigentes, procesamiento de video o juegos. Fuera de eso, el usuario no nota la diferencia.",
        ],
      },
      {
        titulo: "Publicar en las tiendas: lo que nadie te cuenta antes",
        parrafos: [
          "Ambas tiendas cobran por la cuenta de desarrollador y ambas revisan cada versión antes de publicarla. Apple es más estricta y puede rechazar por motivos de diseño o de política, no solo técnicos; eso agrega tiempo que no depende de nosotros.",
          "Las cuentas se crean a tu nombre, no al nuestro. Es la diferencia entre ser dueño de tu app y depender de que un proveedor te la ceda algún día.",
          "El alcance base cubre la publicación en una tienda a elección. La segunda se agrega y se cotiza, porque implica su propio proceso de revisión.",
        ],
      },
      {
        titulo: "Qué incluye el alcance base",
        parrafos: [
          "Sesión de usuario y tres pantallas: el flujo principal que justifica que exista la app. Con eso se publica una primera versión real y se empieza a aprender de gente usándola.",
          "Construida para crecer: agregar pantallas después no obliga a rehacer lo anterior, siempre que la estructura se haya definido bien al principio.",
        ],
      },
      {
        titulo: "Antes de decidir una app",
        parrafos: [
          "Vale la pena preguntarse si de verdad necesitas una. Instalar una app es una barrera: si tu usuario la va a abrir una vez al mes, probablemente no la instale y una web bien hecha te sirva más.",
          "Una app se justifica cuando la persona vuelve seguido, cuando necesitas notificarla, o cuando el trabajo ocurre sin señal. Si ninguna de las tres aplica, te lo vamos a decir aunque sea el servicio más caro.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta mantener la app publicada?",
        a: "La cuenta de desarrollador de cada tienda se paga todos los años y va a tu nombre. Además, ambos sistemas exigen actualizar la app cada cierto tiempo para que no la retiren; eso se cubre con un plan de mantención o se cotiza cuando toque.",
      },
      {
        q: "¿Puedo actualizar sin esperar la revisión?",
        a: "Buena parte de los cambios sí, porque se pueden enviar al aire sin pasar por la tienda. Lo que toca funcionalidad nativa o permisos sí requiere una versión nueva y su revisión.",
      },
      {
        q: "¿Se ve igual en Android que en iPhone?",
        a: "Se ve consistente pero no idéntica: cada sistema tiene sus convenciones y forzar que sean iguales hace que la app se sienta ajena en ambos. Se respeta lo propio de cada uno donde importa.",
      },
      {
        q: "¿Y si después quiero una nativa?",
        a: "El servidor, la base de datos y la lógica se reutilizan completos; lo que se rehace es la interfaz. Partir multiplataforma para validar y migrar después es una ruta razonable y bastante común.",
      },
    ],
    prompt:
      "Plano técnico isométrico de una APP MULTIPLATAFORMA, estilo lámina de arquitectura. En el centro y abajo, un plano horizontal que representa la base de código única, dibujado como una placa con canto visible y una retícula interna de módulos. Desde esa placa suben dos líneas guía que se abren en V hacia arriba, sosteniendo dos planos verticales con proporción de teléfono en isometría real de 30 grados, uno a cada lado: son el mismo diseño con detalles de interfaz levemente distintos, indicando dos sistemas operativos. Sobre cada teléfono, un pequeño marco de tienda de aplicaciones dibujado en línea fina, conectado por una flecha corta. Una LÍNEA DE RECORRIDO punteada en azul cobalto sale de la placa base y se bifurca simétricamente hacia los dos teléfonos, con nodos circulares en la bifurcación. Un botón sólido cobalto aparece en la pantalla de ambos teléfonos, en la misma posición, reforzando que es el mismo desarrollo. Anotaciones de plano alrededor: líneas de cota con topes, una llamada apuntando a la placa base y otra a la bifurcación, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a la línea de recorrido y a los botones. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "app-nativa",
    tecnologias: [
      { nombre: "Swift", para: "Lenguaje propio de Apple para la versión de iPhone" },
      { nombre: "Kotlin", para: "Lenguaje propio de Android para esa versión" },
      { nombre: "SDK del sistema", para: "Acceso completo a cámara, sensores, biometría y widgets" },
      { nombre: "Node.js", para: "Servidor compartido por ambas versiones" },
      { nombre: "PostgreSQL", para: "Base central, con respaldo automático" },
    ],
    familia: "apps",
    nombre: "App nativa",
    imagen: "/servicios/app-nativa.webp",
    resumen: "Desarrollo propio para Android o iPhone, máximo rendimiento.",
    incluye: ["Publicada a tu nombre", "Acceso completo al dispositivo", "Rendimiento nativo"],
    precios: [null, 1490000, 2790000],
    metaTitle: "Desarrollo de app nativa iOS y Android en Chile desde $1.490.000 · Maudev",
    metaDescription:
      "App nativa en Swift o Kotlin, con acceso completo al dispositivo y máximo rendimiento. Publicada a tu nombre. Desde $1.490.000 + IVA.",
    intro:
      "Una app nativa se programa en el lenguaje propio de cada sistema: Swift para iPhone, Kotlin para Android. Es el camino más caro y el que más rinde cuando la app depende de verdad del dispositivo — la cámara, los sensores, la biometría o la fluidez de la interfaz.",
    secciones: [
      {
        titulo: "Cuándo se justifica pagar el doble",
        parrafos: [
          "Cuando la app usa el dispositivo a fondo: cámara con procesamiento en vivo, sensores, mapas con seguimiento continuo, biometría, widgets o funciones que Apple y Google acaban de publicar.",
          "Cuando el rendimiento es el producto: animaciones exigentes, listas enormes que tienen que ir fluidas, video o gráficos.",
          "Y cuando la app es el negocio, no una herramienta de apoyo. Si tu empresa vive de esa app, tiene sentido invertir en la mejor versión posible de cada plataforma.",
          "Si ninguna de las tres aplica, una multiplataforma hace el mismo trabajo por bastante menos, y te lo vamos a decir aunque sea el servicio más caro del catálogo.",
        ],
      },
      {
        titulo: "Qué significa \"nativa\" en el presupuesto",
        parrafos: [
          "Significa dos desarrollos. La lógica del servidor y la base de datos se comparten, pero la interfaz y el comportamiento se construyen dos veces, en dos lenguajes distintos.",
          "También significa dos mantenciones. Cada versión nueva de iOS o de Android puede exigir ajustes, y esos ajustes se hacen por separado.",
          "Por eso el precio del alcance base cubre una plataforma. La segunda se cotiza aparte y se dice antes de empezar, para que el presupuesto real esté sobre la mesa desde el principio.",
        ],
      },
      {
        titulo: "Qué recibes",
        parrafos: [
          "La app publicada en la tienda que corresponda, con la cuenta de desarrollador a tu nombre, más el código fuente y la documentación técnica.",
          "El servidor y la base de datos quedan bajo tu control, para que la app no dependa de infraestructura nuestra.",
          "Y las decisiones técnicas explicadas en castellano, para que otro desarrollador pueda tomar el proyecto sin partir de cero leyendo código.",
        ],
      },
      {
        titulo: "Antes de empezar: el ciclo de vida",
        parrafos: [
          "Una app nativa no se entrega y se olvida. Apple y Google exigen actualizarla periódicamente o la retiran de la tienda, y cada sistema operativo nuevo puede romper algo.",
          "Eso se acuerda antes de empezar: quién la mantiene, con qué frecuencia y con qué presupuesto anual. Una app publicada y abandonada desaparece de la tienda en un par de años.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Puedo empezar con una plataforma y agregar la otra después?",
        a: "Sí, y suele ser lo sensato: se publica en la que concentra a tus usuarios, se aprende con gente real usándola y después se construye la segunda. El servidor ya está hecho, así que la segunda cuesta menos que la primera.",
      },
      {
        q: "¿Cuál conviene primero, iPhone o Android?",
        a: "Depende de tu público, no de preferencias. En Chile Android tiene mucha más participación, pero si tu segmento es de mayor poder adquisitivo la proporción cambia. Se revisa con tus datos antes de decidir.",
      },
      {
        q: "¿Por qué no está disponible en el nivel de entrada?",
        a: "Porque no cabe. Dos desarrollos con publicación en tienda exigen un alcance que ese nivel no cubre, y entregar una versión recortada de algo así crea más problemas de los que resuelve.",
      },
      {
        q: "¿Cuánto cuesta mantenerla al año?",
        a: "Las cuentas de desarrollador se pagan anualmente y van a tu nombre. Sobre eso, el mantenimiento depende de cuánto cambie la app; se puede dejar un plan mensual o cotizar por ajuste. Lo que no recomendamos es no presupuestar nada.",
      },
    ],
    prompt:
      "Plano técnico isométrico de una APP NATIVA, estilo lámina de arquitectura. Dos planos verticales con proporción de teléfono en isometría real de 30 grados, uno a la izquierda y otro a la derecha, claramente separados por una línea vertical divisoria de trazo fino que atraviesa la lámina: son dos desarrollos distintos, no uno compartido. Cada teléfono tiene su propia placa de código debajo, dibujada como una base con canto visible y retícula interna, y las dos placas son visiblemente distintas entre sí en el patrón de sus módulos. En la parte inferior, un único plano horizontal ancho que representa el servidor compartido, conectado hacia arriba a las DOS placas mediante líneas continuas, mostrando que solo esa capa se comparte. Alrededor de cada teléfono, tres símbolos técnicos pequeños en línea fina —una cámara, una huella dactilar y un sensor— conectados por líneas de llamada cortas, indicando el acceso profundo al dispositivo. Un botón sólido cobalto en cada pantalla, en posiciones distintas, reforzando que cada plataforma respeta sus propias convenciones. Anotaciones de plano: líneas de cota con topes, una llamada sobre la línea divisoria y otra sobre el servidor compartido, y cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a los botones y a las líneas que bajan al servidor. Sin ningún texto legible. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "logo",
    familia: "branding",
    nombre: "Logo e identidad",
    imagen: "/servicios/logo-e-identidad.webp",
    resumen: "Tu marca visual: logo, paleta y tipografías.",
    incluye: ["Logo en tres versiones", "Paleta de color", "Archivos para imprenta y web"],
    precios: [90000, 190000, 390000],
    tecnologias: [
      { nombre: "Diseño vectorial", para: "El logo se dibuja con curvas: escala a una tarjeta o a una fachada sin perder nitidez" },
      { nombre: "SVG, PDF y EPS", para: "Los formatos que te va a pedir cualquier imprenta o desarrollador" },
      { nombre: "Paleta con códigos", para: "HEX para pantalla y CMYK para impresión, para que el color no cambie según quién lo use" },
      { nombre: "Tipografías con licencia", para: "Fuentes que puedes usar comercialmente sin heredar un problema legal" },
      { nombre: "Manual de uso breve", para: "Tamaño mínimo, márgenes y qué no hacer con el logo" },
    ],
    metaTitle: "Diseño de logo e identidad visual en Chile desde $90.000 · Maudev",
    metaDescription:
      "Logo en tres versiones, paleta de color y tipografías, con archivos para imprenta y web. Probado en tamaño chico y en una sola tinta. Desde $90.000 + IVA.",
    intro:
      "Un logo no es la marca: es la parte de la marca que tiene que seguir funcionando cuando mide dieciséis píxeles en la pestaña del navegador, o cuando alguien lo manda a bordar en una sola tinta.",
    secciones: [
      {
        titulo: "El tamaño chico es la prueba",
        parrafos: [
          "Casi todos los logos se ven bien en la pantalla del diseñador, a media pantalla y en color. El problema aparece después, cuando hay que ponerlo de favicon, en la foto de perfil redonda de una red social o en un timbre.",
          "Por eso acá se prueba al revés: primero chico y en una sola tinta, y recién después en grande. Si sobrevive a eso, sobrevive a todo lo demás.",
          "Lo mismo con las versiones. Un solo dibujo no sirve para todos los espacios, así que se entregan tres: la principal, una horizontal para lugares anchos y el símbolo suelto para los cuadrados.",
        ],
      },
      {
        titulo: "La pregunta más útil no es qué te gusta",
        parrafos: [
          "Es qué no quieres parecer. Esa respuesta descarta la mitad de los caminos en cinco minutos y evita tres rondas de propuestas que iban en la dirección equivocada.",
          "Después vienen las de siempre: a qué te dedicas, a quién le hablas, dónde va a aparecer esto. Si va a estar sobre todo en una vitrina, se diseña distinto que si vive en una app.",
        ],
      },
      {
        titulo: "Cuántas rondas, dicho antes",
        parrafos: [
          "Los proyectos de diseño no mueren por falta de talento, mueren por rondas infinitas. Acá el número de propuestas y de ajustes se fija al empezar y queda escrito en la cotización.",
          "No es rigidez: es lo que permite que el trabajo termine. Si después quieres explorar otro camino, se cotiza aparte y se sabe cuánto cuesta.",
        ],
      },
      {
        titulo: "Sobre generar un logo con inteligencia artificial",
        parrafos: [
          "Puedes tener algo en minutos y a veces se ve bien. Lo que no sale de ahí es el archivo vectorial limpio, las versiones para cada espacio, la revisión de que funcione en tamaño chico y alguien que responda cuando la imprenta pida otro formato.",
          "Si tu presupuesto hoy da para eso y no para más, úsalo y sigue adelante; es preferible a no tener nada. Cuando el negocio crezca, esto se puede tomar como punto de partida y ordenar.",
        ],
      },
      {
        titulo: "Antes de enamorarte del nombre",
        parrafos: [
          "Conviene revisar en INAPI si ya está registrado en tu rubro. Es gratis, toma unos minutos y evita el peor escenario posible: descubrirlo después de imprimir señalética.",
          "El registro legal de la marca no lo hacemos nosotros, eso lo ve un abogado o lo tramitas directo. Lo que sí entregamos son los archivos en la forma que ese trámite pide.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuántas propuestas y cuántos ajustes incluye?",
        a: "Depende del alcance, y se dice antes de empezar, no después. Lo importante es que sea un número: los proyectos de diseño se hunden cuando las rondas no tienen límite.",
      },
      {
        q: "¿Qué archivos recibo?",
        a: "El logo en vectorial —SVG, PDF y EPS— más versiones en PNG para uso diario, la paleta con códigos para pantalla e impresión, y las tipografías indicadas con su licencia. Es lo que te va a pedir cualquier imprenta o desarrollador.",
      },
      {
        q: "¿El logo es mío?",
        a: "Sí, con los archivos originales editables. No queda amarrado a que nos sigas contratando para poder modificarlo.",
      },
      {
        q: "¿Registran la marca?",
        a: "No, ese trámite lo ve un abogado o lo haces directo en INAPI. Sí te entregamos los archivos como el registro los pide, y te recomendamos revisar disponibilidad antes de imprimir nada.",
      },
      {
        q: "¿En qué se diferencia de identidad completa?",
        a: "Acá recibes el logo, la paleta y las tipografías. Identidad completa suma las aplicaciones —papelería, señalética, plantillas— y el manual que define cómo se usa todo eso.",
      },
    ],
    prompt:
      "Lámina técnica de CONSTRUCCIÓN DE LOGOTIPO, estilo hoja de normas de marca, en vista frontal plana y no isométrica. Al centro, una marca abstracta y geométrica sencilla —formas puras, sin letras ni caracteres— dibujada sobre una retícula de construcción fina, con líneas guía de circunferencias y ejes que se prolongan más allá del contorno y un recuadro de área de resguardo punteado alrededor. A la izquierda, una columna con la misma marca repetida en tres tamaños decrecientes, del mayor al muy pequeño, cada uno con su línea de cota al costado. A la derecha, una columna con tres variantes de la misma marca en recuadros de igual altura: una compuesta en horizontal, una compacta y el símbolo suelto, todas sin texto. Abajo, una fila de cuatro cuadrados de muestra de color con una etiqueta vacía bajo cada uno, y a su lado la marca resuelta en una sola tinta plana dentro de un círculo, como prueba de una sola tinta. Anotaciones de plano alrededor: líneas de cota con topes y llamadas cortas hacia el área de resguardo y hacia el tamaño más pequeño. Cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a uno de los cuadrados de color y a la versión de una sola tinta. Sin ningún texto legible ni letras reconocibles en ninguna parte. Trazo vectorial nítido, sin degradados, aire de lámina de diseño impresa, 3:2.",
  },
  {
    id: "redes",
    familia: "branding",
    nombre: "Kit para redes",
    imagen: "/servicios/kit-para-redes.webp",
    resumen: "Plantillas editables para publicar sin pedir ayuda.",
    incluye: ["Diez plantillas editables", "Historia, publicación y carrusel", "Con tu paleta de marca"],
    precios: [90000, 190000, 340000],
    tecnologias: [
      { nombre: "Canva", para: "Editable por ti desde el navegador, sin comprar ni aprender un programa de diseño" },
      { nombre: "Medidas nativas por red", para: "Publicación vertical, historia y carrusel en el tamaño que cada una espera" },
      { nombre: "Marca bloqueada", para: "Colores y tipografías fijos: cambias el texto y la marca no se desarma" },
      { nombre: "Texto en capas separadas", para: "Se reemplaza sin tocar el diseño ni mover lo que está detrás" },
      { nombre: "Espacio para foto", para: "Marcos donde tu imagen entra recortada como corresponde, no estirada" },
    ],
    metaTitle: "Kit de plantillas para redes sociales en Chile desde $90.000 · Maudev",
    metaDescription:
      "Plantillas editables en Canva con tu marca aplicada: publicación, historia y carrusel. Cambias texto y foto y publicas el mismo día. Desde $90.000 + IVA.",
    intro:
      "Esto no se trata de tener publicaciones bonitas. Se trata de que puedas publicar un martes a las ocho de la noche sin escribirle a nadie ni esperar a que te respondan.",
    secciones: [
      {
        titulo: "Se entrega donde vas a poder editarlo",
        parrafos: [
          "Las plantillas van en Canva, con tu marca ya aplicada. No es la herramienta más sofisticada y esa es exactamente la razón: es la que vas a poder abrir tú.",
          "Un archivo de diseño profesional se ve mejor en la entrega y te deja dependiendo de alguien cada vez que quieras cambiar una fecha. Eso no es un kit, es una suscripción encubierta.",
          "Los colores y las tipografías quedan fijos, así que puedes cambiar el texto y la foto sin que la marca se desarme por el camino.",
        ],
      },
      {
        titulo: "Diez plantillas distintas, no una repetida diez veces",
        parrafos: [
          "El error típico es entregar diez piezas que son la misma con otro color. Sirven para un día y después no calzan con nada de lo que necesitas publicar.",
          "Antes de diseñar revisamos qué publicas de verdad: promoción, dato útil, antes y después, aviso de horario, producto nuevo, respuesta a una pregunta frecuente. Cada tipo de publicación tiene su plantilla.",
          "También se diseñan para texto real. Una plantilla que solo se ve bien con un título de cuatro palabras se rompe la primera vez que necesitas seis.",
        ],
      },
      {
        titulo: "Lo que esto no resuelve",
        parrafos: [
          "No decide qué publicar ni con qué frecuencia. Si el problema es que no sabes qué decir, el kit no lo arregla: te va a dejar con diez plantillas vacías y la misma duda.",
          "Lo que sí elimina es la fricción del diseño, que en la práctica es la excusa más común para no publicar. Cuando armar una pieza toma tres minutos, se publica; cuando toma una hora, no.",
        ],
      },
      {
        titulo: "Si todavía no tienes marca definida",
        parrafos: [
          "Conviene resolver primero el logo, los colores y las tipografías. Si no, las plantillas se construyen sobre algo que va a cambiar y hay que rehacerlas.",
          "Se puede tomar en el mismo proyecto, y sale más barato que hacerlo en dos etapas separadas.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Necesito pagar Canva Pro?",
        a: "Las plantillas se arman para funcionar con la versión gratuita siempre que se pueda. Si alguna función concreta requiere la versión de pago, se te dice antes y no después de la entrega.",
      },
      {
        q: "¿Puedo cambiar textos y fotos yo mismo?",
        a: "Esa es la idea. El texto va en capas separadas y las fotos tienen su marco, así que reemplazas y publicas sin mover el diseño.",
      },
      {
        q: "¿Incluye qué publicar?",
        a: "No. Esto entrega las piezas editables, no el contenido ni el calendario. Lo decimos claro porque es la confusión más común al contratar un kit.",
      },
      {
        q: "¿Sirve para Instagram y también para el resto?",
        a: "Las medidas cubren publicación vertical, historia y carrusel, que son las que usan Instagram, Facebook y TikTok. Si necesitas otra red con formatos propios, se agrega.",
      },
      {
        q: "¿Y si no tengo logo todavía?",
        a: "Conviene definir marca primero, si no las plantillas se hacen sobre algo que va a cambiar. Se puede tomar todo junto y sale más barato que en dos etapas.",
      },
    ],
    prompt:
      "Lámina técnica de un KIT DE PLANTILLAS PARA REDES, estilo hoja de retículas editoriales, en vista frontal plana y no isométrica. Distribuidos en la lámina, seis marcos rectangulares vacíos de proporciones distintas: dos verticales altos, dos verticales medios y dos cuadrados, cada uno con su retícula interna de columnas y líneas base dibujadas en trazo muy fino, márgenes de seguridad punteados y bloques grises sólidos que ocupan el lugar del texto sin formar letras. Uno de los marcos verticales está en primer plano, algo más grande, con un rectángulo de imagen marcado por una equis diagonal fina y una banda de color plano cobalto en su borde inferior. A la derecha, tres marcos pequeños ligeramente superpuestos en abanico, sugiriendo las piezas de un carrusel, unidos por una línea cobalto continua con puntos de conexión. A la izquierda, una columna vertical delgada con cuatro cuadrados de muestra de color apilados y, bajo ellos, tres barras horizontales de distinto grosor que representan jerarquías tipográficas. Anotaciones de plano alrededor: líneas de cota con topes indicando proporciones de cada marco, y una llamada corta hacia el margen de seguridad. Cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a la banda del marco principal, a la línea del carrusel y a uno de los cuadrados de color. Sin ningún texto legible ni letras reconocibles en ninguna parte. Trazo vectorial nítido, sin degradados, aire de lámina de diseño impresa, 3:2.",
  },
  {
    id: "ux",
    familia: "branding",
    nombre: "Revisión de usabilidad",
    resumen: "Diagnosticamos qué está frenando las conversiones y lo corregimos.",
    incluye: ["Revisión del sitio actual", "Diez mejoras priorizadas", "Informe con ejemplos"],
    precios: [190000, 340000, 590000],
    tecnologias: [
      { nombre: "Lighthouse y Core Web Vitals", para: "Mide la carga real de cada página, que es de lo que depende buena parte del posicionamiento" },
      { nombre: "Google Search Console", para: "Qué busca la gente que llega y en qué páginas entra sin convertir" },
      { nombre: "Google Analytics", para: "En qué paso exacto se cae la visita antes de escribir" },
      { nombre: "Mapas de calor", para: "Hasta dónde baja la gente y dónde hace clic esperando que pase algo" },
      { nombre: "Prueba en equipo real", para: "El sitio abierto en un teléfono con datos móviles, no solo en un emulador" },
      { nombre: "Revisión de accesibilidad", para: "Contraste, tamaño de toque y navegación por teclado según los criterios WCAG" },
    ],
    metaTitle: "Revisión de usabilidad y auditoría UX de sitios web en Chile desde $190.000 · Maudev",
    metaDescription:
      "Revisamos por qué tu sitio recibe visitas y casi nadie escribe. Diez mejoras priorizadas, con captura, ubicación y explicación, listas para aplicar. Desde $190.000 + IVA.",
    intro:
      "Tu sitio recibe visitas y casi nadie escribe. Antes de gastar más en publicidad conviene saber dónde se pierden los que ya están llegando: llevar tráfico pagado a un sitio que no convierte es la forma más cara de descubrir que el problema nunca fue el tráfico.",
    secciones: [
      {
        titulo: "Qué se revisa, en concreto",
        parrafos: [
          "El camino completo, desde que alguien aterriza hasta que decide escribirte. No una opinión sobre el diseño: los puntos donde la gente se detiene y se va.",
          "Qué se entiende en los primeros segundos —a qué te dedicas, dónde operas y para quién es esto—, si aparece el precio o al menos un rango, y si hay una sola acción clara o cinco compitiendo entre sí.",
          "Después el detalle operativo: cuántos campos tiene el formulario y cuáles sobran, si el sitio se puede usar con un pulgar en un teléfono, cuánto demora en cargar con datos móviles y no con fibra, si los textos se leen con contraste suficiente y si se puede navegar con teclado.",
          "Y lo que rodea a la conversión: qué pasa después de enviar el formulario, si el número de WhatsApp funciona de verdad, si la página de contacto responde en el horario que promete.",
        ],
      },
      {
        titulo: "El informe es una lista de tareas, no un ensayo",
        parrafos: [
          "Recibes diez mejoras priorizadas. Cada una con la captura de dónde está, qué hay que cambiar y por qué ese cambio importa, en un idioma que puedas reenviar sin traducir.",
          "Está escrito para que lo pueda aplicar cualquiera: tu equipo, el proveedor que ya tienes o nosotros. No queda amarrado a que nos contrates la implementación, y esa independencia es justamente lo que hace que el informe sirva.",
          "Van ordenadas por impacto contra esfuerzo, así que las primeras suelen ser cambios de una tarde que se notan de inmediato.",
        ],
      },
      {
        titulo: "Diez y no sesenta, a propósito",
        parrafos: [
          "Una auditoría con sesenta hallazgos impresiona en la entrega y no se aplica nunca: es demasiado para empezar y termina archivada.",
          "Diez se pueden hacer. Y cuando estén hechas, si quieres, se revisa de nuevo con la foto ya cambiada, que es más útil que haber recibido todo junto al principio.",
        ],
      },
      {
        titulo: "No te vamos a prometer un porcentaje",
        parrafos: [
          "Nadie puede decirte con seriedad cuánto va a subir tu conversión antes de conocer tu tráfico, tu rubro y tu oferta. Quien te da una cifra en la primera reunión está vendiendo, no diagnosticando.",
          "Lo que sí se puede afirmar con evidencia es qué está mal, en qué punto exacto se pierde la gente y qué principio de usabilidad se está rompiendo ahí. Eso es lo que entregamos, y es lo que después se puede medir de verdad.",
        ],
      },
      {
        titulo: "Con datos si los tienes, con oficio si no",
        parrafos: [
          "Si ya tienes Analytics, Search Console o algún mapa de calor instalado, la revisión parte por ahí: los datos muestran dónde se cae la gente sin necesidad de suponer.",
          "Si no hay nada instalado, la revisión igual se hace, apoyada en criterios de usabilidad conocidos y en probar el sitio en equipos reales. Y se puede dejar la medición andando, para que la próxima conversación ya sea con números tuyos.",
        ],
      },
      {
        titulo: "Conviene antes de rediseñar, no después",
        parrafos: [
          "Si estás pensando en rehacer el sitio, revisarlo primero es lo más barato que puedes hacer. Un rediseño que no sabe qué estaba fallando repite los mismos errores con mejor tipografía.",
          "Muchas veces además cambia la conclusión: aparecen tres arreglos que resuelven el problema real y el rediseño completo puede esperar un año.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Sirve para cualquier tipo de sitio?",
        a: "Sí: sitios institucionales, tiendas online y landings. Da lo mismo si está hecho en WordPress, Shopify, Wix, Squarespace o a medida, porque la revisión se hace sobre el sitio publicado y no sobre el código.",
      },
      {
        q: "¿Tengo que darles acceso a algo?",
        a: "Para revisar, no: basta con la dirección del sitio. Si nos das acceso de lectura a Analytics o Search Console el diagnóstico mejora bastante, porque deja de ser criterio y pasa a ser dato.",
      },
      {
        q: "¿Ustedes aplican los cambios?",
        a: "El alcance de entrada entrega el informe para que lo aplique quien tú quieras. La implementación va en los niveles superiores o se cotiza aparte, con el precio por escrito antes de empezar.",
      },
      {
        q: "¿Cuánto demora?",
        a: "El informe se entrega en días, no en meses. El plazo exacto depende del tamaño del sitio y se dice al cotizar.",
      },
      {
        q: "¿Van a decirme cuánto van a subir mis ventas?",
        a: "No, y desconfía de quien lo haga sin haber visto tus números. Lo que recibes es dónde se está perdiendo la gente y qué corregir; el efecto se mide después, con tus propios datos.",
      },
      {
        q: "¿En qué se diferencia de un rediseño?",
        a: "El rediseño reconstruye el sitio. Esto lo diagnostica y te dice qué corregir, que suele ser mucho menos y más barato. Si igual conviene rehacerlo, te lo decimos con los argumentos a la vista.",
      },
    ],
    prompt:
      "Lámina técnica de una REVISIÓN DE USABILIDAD, estilo hoja de anotación de plano, en vista frontal plana y no isométrica. Ocupando la mitad izquierda, el esquema alámbrico de una página web dibujado en línea fina: barra superior, bloque principal con un rectángulo grande de imagen marcado por una equis diagonal, un botón destacado, y bajo él tres bloques de contenido y un bloque de formulario con cuatro campos apilados. Sobre ese esquema, seis marcadores circulares numerados dibujados en trazo cobalto, unidos por líneas de llamada finas a etiquetas rectangulares vacías situadas en el margen. Tres de los marcadores están sobre el botón, el formulario y la barra superior. A la derecha y arriba, un diagrama de embudo formado por cuatro barras horizontales de ancho decreciente, con una flecha corta de fuga saliendo lateralmente entre la segunda y la tercera. A la derecha y abajo, una matriz de priorización de dos ejes con cuadrícula tenue y cinco puntos distribuidos, uno de ellos relleno en cobalto en el cuadrante superior izquierdo. Anotaciones de plano alrededor: líneas de cota con topes, y una llamada corta hacia el punto destacado de la matriz. Cajetín técnico en la esquina inferior derecha. Fondo crema con retícula técnica muy tenue. Escala de grises salvo el azul cobalto, reservado a los marcadores numerados, a la flecha de fuga del embudo y al punto destacado de la matriz. Sin ningún texto legible ni letras reconocibles en ninguna parte; los números de los marcadores pueden ser dígitos simples. Trazo vectorial nítido, sin degradados, aire de lámina de ingeniería impresa, 3:2.",
  },
  {
    id: "branding",
    familia: "branding",
    nombre: "Identidad completa",
    resumen: "Marca de punta a punta: estrategia, visual y tono.",
    incluye: ["Logo, paleta y tipografías", "Manual de marca", "Aplicaciones de ejemplo"],
    precios: [390000, 690000, 1290000],
    prompt:
      "Composición de manual de marca abierto sobre mesa crema, con paleta de colores, muestras tipográficas y aplicaciones impresas. Luz cenital de estudio, acento azul cobalto, estilo editorial de diseño, sin texto legible, 3:2.",
  },
  {
    id: "design-system",
    familia: "branding",
    nombre: "Sistema de diseño",
    resumen: "Librería de componentes lista para todos tus productos.",
    incluye: ["Componentes documentados", "Tokens exportables", "Guía de uso"],
    precios: [null, 890000, 1690000],
    prompt:
      "Pantalla mostrando una librería de componentes de interfaz en cuadrícula ordenada, botones y tarjetas repetidos en variantes. Fondo crema, acento azul cobalto, estilo producto limpio, sin texto legible, 3:2.",
  },
];

// El slug sale del nombre: una segunda lista escrita a mano se desincroniza en
// cuanto se renombra un servicio, y acá el slug ES la URL pública.
const aSlug = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const subservicios = subserviciosBase.map((s) => ({
  ...s,
  slug: aSlug(s.nombre),
  path: `/servicios/${aSlug(s.nombre)}`,
}));

export const getSubservicio = (slug) => subservicios.find((s) => s.slug === slug);
