// La oferta nueva, en un solo lugar.
//
// Reemplazará a services.js, subservices.js, catalog.js y pricing.js (ver
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
    planes: [
      {
        id: "ia-prototipo",
        nombre: "Prototipo",
        precio: 390000,
        unidad: "único",
        resumen: "Un caso de uso funcionando con tus datos reales en 2 a 3 semanas.",
        fases: ["Diagnóstico", "Prototipo", "Validación"],
      },
      {
        id: "ia-agente",
        nombre: "Agente",
        precio: 890000,
        desde: true,
        mensual: 59000,
        unidad: "único + mensual",
        destacado: true,
        resumen: "Agente en WhatsApp o lectura de documentos, integrado a tu operación.",
        fases: ["Diagnóstico", "Prototipo", "Integración", "Puesta en marcha"],
      },
      {
        id: "ia-premium",
        nombre: "Agente + conocimiento privado",
        precio: null,
        unidad: "a cotizar",
        resumen: "Agente con búsqueda sobre tus documentos e integraciones a tus sistemas.",
        fases: ["Diagnóstico", "Prototipo", "Integración", "Escalamiento"],
      },
    ],
  },
};

export const planes = Object.values(capacidades).flatMap((c) =>
  c.planes.map((plan) => ({ ...plan, capacidad: c.navLabel })),
);

export const getPlan = (id) => planes.find((plan) => plan.id === id) || null;

const clp = (monto) => `$${monto.toLocaleString("es-CL")}`;

/** "$590.000" · "Desde $590.000" · "Desde $590.000 + $49.000/mes" · "A cotizar". */
export function precioPlan(plan) {
  if (plan.precio == null) return "A cotizar";
  const base = `${plan.desde ? "Desde " : ""}${clp(plan.precio)}`;
  return plan.mensual ? `${base} + ${clp(plan.mensual)}/mes` : base;
}
