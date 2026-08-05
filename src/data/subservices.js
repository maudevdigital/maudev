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
    familia: "software",
    nombre: "Gestión de clientes",
    resumen: "Contactos, oportunidades y seguimiento en un solo lugar.",
    incluye: ["Hasta 500 contactos", "Embudo visual", "Avisos por correo", "Hosting incluido"],
    precios: [390000, 690000, 1190000],
    prompt:
      "Escritorio con un monitor mostrando un embudo de ventas en columnas y fichas de contactos, junto a una libreta con anotaciones. Luz suave de oficina, paleta azul cobalto y crema, estilo editorial, sin texto legible, 3:2.",
  },
  {
    id: "pos",
    familia: "software",
    nombre: "Punto de venta",
    resumen: "Caja moderna para tu local, conectada al inventario.",
    incluye: ["Una caja y hasta 200 productos", "Boleta electrónica", "Inventario simple"],
    precios: [290000, 490000, 890000],
    prompt:
      "Mostrador de un local pequeño con una tablet montada como caja registradora, un lector de tarjetas y una impresora de boletas. Luz cálida de comercio, paleta azul cobalto y crema, estilo editorial, sin texto legible, 3:2.",
  },
  {
    id: "integracion",
    familia: "software",
    nombre: "Integración entre sistemas",
    resumen: "Conectamos tus herramientas para que dejen de copiarse a mano.",
    incluye: ["Una integración punto a punto", "Documentación de lo conectado"],
    precios: [190000, 390000, 690000],
    prompt:
      "Bodegón conceptual de dos módulos físicos conectados por un cable limpio sobre superficie crema, sugiriendo dos sistemas hablándose. Iluminación de estudio, acento azul cobalto, estilo producto minimalista, sin texto, 3:2.",
  },
  {
    id: "automatizacion",
    familia: "software",
    nombre: "Automatización de procesos",
    resumen: "Las tareas repetitivas, hechas solas y a toda hora.",
    incluye: ["Un flujo automatizado", "Reglas verificables", "Hasta 1.000 ejecuciones al mes"],
    precios: [290000, 490000, 890000],
    prompt:
      "Escritorio con un monitor mostrando un diagrama de flujo de nodos conectados y, al lado, una bandeja de papeles vacía que sugiere trabajo ya resuelto. Luz de estudio, paleta azul cobalto y crema, estilo editorial, sin texto legible, 3:2.",
  },
  {
    id: "erp",
    familia: "software",
    nombre: "Sistema de gestión",
    resumen: "Inventario, compras, ventas y documentos en una sola herramienta.",
    incluye: ["Módulos según tu operación", "Usuarios y permisos", "Reportes"],
    precios: [null, 1290000, 2490000],
    prompt:
      "Oficina pequeña con un monitor mostrando módulos de inventario y pedidos, y al fondo estanterías con cajas ordenadas. Luz natural, paleta azul cobalto y crema, estilo editorial documental, sin texto legible, 3:2.",
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
    familia: "apps",
    nombre: "App multiplataforma",
    resumen: "Un solo desarrollo que corre en Android y iPhone.",
    incluye: ["Sesión y tres pantallas", "Publicación en una tienda", "Base para crecer"],
    precios: [890000, 1290000, 2290000],
    prompt:
      "Un teléfono Android y un iPhone lado a lado sobre superficie crema, mostrando la misma app. Iluminación de estudio pareja, acento azul cobalto, estilo producto minimalista, sin texto legible, 3:2.",
  },
  {
    id: "app-nativa",
    familia: "apps",
    nombre: "App nativa",
    resumen: "Desarrollo propio para Android o iPhone, máximo rendimiento.",
    incluye: ["Publicada a tu nombre", "Acceso completo al dispositivo", "Rendimiento nativo"],
    precios: [null, 1490000, 2790000],
    prompt:
      "Primer plano de un teléfono en soporte mostrando una app fluida, con reflejo suave sobre superficie oscura. Iluminación de estudio dramática pero limpia, acento azul cobalto, estilo producto premium, sin texto legible, 3:2.",
  },
  {
    id: "logo",
    familia: "branding",
    nombre: "Logo e identidad",
    resumen: "Tu marca visual: logo, paleta y tipografías.",
    incluye: ["Logo en tres versiones", "Paleta de color", "Archivos para imprenta y web"],
    precios: [90000, 190000, 390000],
    prompt:
      "Bodegón de identidad de marca sobre mesa crema: tarjetas impresas, muestras de color y una hoja con variantes de un logotipo abstracto. Luz cenital suave, acento azul cobalto, estilo editorial de diseño, sin texto legible, 3:2.",
  },
  {
    id: "redes",
    familia: "branding",
    nombre: "Kit para redes",
    resumen: "Plantillas editables para publicar sin pedir ayuda.",
    incluye: ["Diez plantillas editables", "Historia, publicación y carrusel", "Con tu paleta de marca"],
    precios: [90000, 190000, 340000],
    prompt:
      "Vista cenital de un teléfono rodeado de plantillas impresas de publicaciones y carruseles, sobre fondo crema. Luz difusa, acento azul cobalto, estilo editorial de diseño, sin texto legible, 3:2.",
  },
  {
    id: "ux",
    familia: "branding",
    nombre: "Revisión de usabilidad",
    resumen: "Diagnosticamos qué está frenando las conversiones y lo corregimos.",
    incluye: ["Revisión del sitio actual", "Diez mejoras priorizadas", "Informe con ejemplos"],
    precios: [190000, 340000, 590000],
    prompt:
      "Escritorio con una pantalla mostrando un mapa de calor de clics sobre una web y notas adhesivas al costado con anotaciones. Luz de oficina suave, paleta azul cobalto y crema, estilo editorial, sin texto legible, 3:2.",
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
