// La oferta nueva, en un solo lugar.
//
// Reemplaza a services.js, subservices.js, catalog.js y pricing.js (ver
// docs/plan-servicios-portal.md). Menú, páginas, sitemap y, más adelante, el
// portal de clientes —que crea cada proyecto con las fases del plan contratado—
// leen de acá. Vive en shared/ porque el backend lo usa para crear proyectos y
// cobrar desde la misma tabla que muestra la página.
//
// Montos NETOS en CLP: el IVA se suma aparte y así se rotula donde aparezcan.

export const capacidades = {
  "ley-21719": {
    path: "/ley-21719",
    navLabel: "Ley 21.719",
    nombre: "Adecuación a la Ley 21.719",
    resumen: "Tu sitio, formularios y herramientas ajustados a la nueva ley de datos personales.",
    seo: {
      title: "Adecuación a la Ley 21.719 para empresas y PYMEs · Maudev",
      description: "Adecuación técnica de tu sitio y formularios a la Ley 21.719 de datos personales: cookies, derechos ARCOP, seguridad y documentación. Precios publicados.",
    },
    planes: [
      {
        id: "ley-diagnostico",
        nombre: "Diagnóstico",
        precio: 190000,
        unidad: "único",
        resumen: "Sabes qué te falta y cuánto cuesta resolverlo, antes de gastar en adecuarte.",
        incluye: [
          "Inventario de los datos personales que recibe tu sitio, formularios y herramientas",
          "Revisión de cookies, píxeles y servicios de terceros",
          "Revisión técnica de seguridad: acceso, cifrado y respaldos",
          "Informe de brechas priorizado por riesgo",
          "Presupuesto cerrado de la adecuación",
        ],
        fases: ["Levantamiento", "Revisión técnica", "Informe de brechas"],
      },
      {
        id: "ley-adecuacion",
        nombre: "Adecuación",
        precio: 590000,
        desde: true,
        unidad: "único",
        destacado: true,
        resumen: "Tu sitio y tus formularios quedan ajustados a lo que exige la ley.",
        incluye: [
          "Todo el diagnóstico",
          "Consentimiento de cookies con registro de cada aceptación",
          "Formularios con finalidad informada y solo los datos necesarios",
          "Canal para ejercer derechos ARCOP, con registro y plazos",
          "Cifrado en tránsito y en reposo donde corresponda",
          "Registro de actividades de tratamiento",
          "Política de privacidad técnica para que la revise tu abogado",
        ],
        fases: ["Diagnóstico", "Consentimiento y formularios", "Canal ARCOP", "Seguridad", "Documentación y entrega"],
      },
      {
        id: "ley-mantencion",
        nombre: "Adecuación + mantención",
        precio: 590000,
        desde: true,
        mensual: 49000,
        unidad: "único + mensual",
        resumen: "La adecuación, y que siga vigente cuando cambian tu sitio o tus proveedores.",
        incluye: [
          "Todo el plan Adecuación",
          "Revisión mensual de cookies, formularios y terceros nuevos",
          "Gestión técnica de las solicitudes ARCOP que lleguen",
          "Protocolo de respuesta ante incidentes de seguridad",
          "Respaldos y actualizaciones de seguridad",
        ],
        fases: ["Adecuación", "Operación mensual"],
      },
    ],
  },
  ia: {
    path: "/inteligencia-artificial",
    navLabel: "IA aplicada",
    nombre: "Inteligencia artificial aplicada",
    resumen: "Agentes en WhatsApp y lectura de documentos, empezando por un prototipo con tus datos.",
    seo: {
      title: "Inteligencia artificial aplicada para empresas y PYMEs en Chile · Maudev",
      description: "Agentes de IA en WhatsApp y lectura automática de documentos. Empieza con un prototipo de precio fijo en 2 a 3 semanas, con tus datos reales.",
    },
    // Una puerta de entrada y no una grilla de planes: hasta probar con datos
    // reales no se sabe qué diferencia habría entre un nivel y otro.
    planes: [
      {
        id: "ia-prototipo",
        nombre: "Prototipo",
        precio: 390000,
        unidad: "único",
        destacado: true,
        resumen: "Un caso de uso funcionando con tus datos reales en 2 a 3 semanas. Si no sirve, lo sabes antes de invertir más.",
        incluye: [
          "Elección del caso con más retorno",
          "Prototipo funcionando con tus datos",
          "Medición de precisión con casos reales",
          "Informe con costo de operación estimado",
        ],
        fases: ["Diagnóstico", "Prototipo", "Validación"],
      },
      {
        id: "ia-agente",
        nombre: "Agente a medida",
        precio: 890000,
        desde: true,
        mensual: 59000,
        unidad: "único + mensual",
        resumen: "Lo que funcionó en el prototipo, integrado a tu operación. El consumo del modelo se cobra a costo.",
        incluye: [
          "Integración con WhatsApp, correo o tus sistemas",
          "Derivación a una persona cuando el caso lo pide",
          "Datos tratados según la Ley 21.719",
          "Monitoreo y ajustes mensuales",
        ],
        fases: ["Diagnóstico", "Prototipo", "Integración", "Puesta en marcha"],
      },
    ],
  },
  desarrollo: {
    path: "/desarrollo",
    navLabel: "Desarrollo",
    nombre: "Desarrollo web y software a medida",
    resumen: "Sitios, tiendas y sistemas con precio cerrado después del diagnóstico.",
    seo: {
      title: "Desarrollo web y software a medida en Chile · Maudev",
      description: "Landing, sitio corporativo, tienda online o sistema a medida. Desde $290.000 + IVA, con precio cerrado por escrito y el código a tu nombre.",
    },
    // Sin planes: cada proyecto es distinto. Se publica el piso y ejemplos de
    // referencia; el precio final se cierra por escrito tras el diagnóstico.
    ejemplos: [
      { nombre: "Landing page", desde: 290000, texto: "Una página enfocada en una sola acción: campañas, lanzamientos o validar una idea." },
      { nombre: "Sitio o tienda online", desde: 890000, texto: "Varias páginas de servicio o un catálogo con pagos, despacho e inventario." },
      { nombre: "Portal o sistema a medida", desde: 2890000, texto: "Cuando una planilla ya no alcanza: usuarios, permisos, historial y reglas propias." },
    ],
    planes: [
      {
        id: "desarrollo-proyecto",
        nombre: "Proyecto a medida",
        precio: 290000,
        desde: true,
        unidad: "único",
        fases: ["Diagnóstico", "Diseño", "Desarrollo", "Pruebas", "Publicación"],
      },
    ],
  },
  soporte: {
    path: "/soporte",
    navLabel: "Soporte",
    nombre: "Soporte y mantención",
    resumen: "Tu sitio o sistema funcionando, respaldado y al día, todos los meses.",
    seo: {
      title: "Soporte y mantención de sitios web en Chile desde $35.000 al mes · Maudev",
      description: "Planes mensuales de soporte y mantención: respaldos, actualizaciones de seguridad, monitoreo y horas de cambios. Desde $35.000 + IVA al mes.",
    },
    planes: [
      {
        id: "soporte-basico",
        nombre: "Básico",
        mensual: 35000,
        horas: 0,
        unidad: "mensual",
        resumen: "Para que el sitio siga en pie, seguro y respaldado.",
        incluye: [
          "Actualizaciones de seguridad",
          "Respaldo mensual",
          "Monitoreo de disponibilidad",
          "Soporte por correo, respuesta en 48 h",
        ],
        fases: ["Operación mensual"],
      },
      {
        id: "soporte-estandar",
        nombre: "Estándar",
        mensual: 89000,
        horas: 2,
        unidad: "mensual",
        destacado: true,
        resumen: "Además, pequeños cambios todos los meses sin cotizar cada uno.",
        incluye: [
          "Todo el plan Básico",
          "2 horas de cambios al mes",
          "Respaldo semanal",
          "Soporte por WhatsApp, respuesta en 24 h",
          "Informe mensual de rendimiento",
        ],
        fases: ["Operación mensual"],
      },
      {
        id: "soporte-premium",
        nombre: "Premium",
        mensual: 189000,
        horas: 6,
        unidad: "mensual",
        resumen: "Para sitios y sistemas de los que depende la operación.",
        incluye: [
          "Todo el plan Estándar",
          "6 horas de cambios al mes",
          "Respaldo diario",
          "Respuesta prioritaria en 4 h",
          "Reunión mensual de revisión",
        ],
        fases: ["Operación mensual"],
      },
    ],
  },
};

export const listaCapacidades = Object.values(capacidades);

export const planes = listaCapacidades.flatMap((c) =>
  c.planes.map((plan) => ({ ...plan, capacidad: c.navLabel })),
);

export const getPlan = (id) => planes.find((plan) => plan.id === id) || null;

export const clp = (monto) => `$${monto.toLocaleString("es-CL")}`;

/** "$590.000" · "Desde $590.000" · "Desde $590.000 + $49.000/mes" · "$35.000/mes" · "A cotizar". */
export function precioPlan(plan) {
  if (plan.precio == null) return plan.mensual ? `${clp(plan.mensual)}/mes` : "A cotizar";
  const base = `${plan.desde ? "Desde " : ""}${clp(plan.precio)}`;
  return plan.mensual ? `${base} + ${clp(plan.mensual)}/mes` : base;
}
