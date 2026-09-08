// Rutas relativas y no el alias "@/": scripts/prerender-meta.mjs importa este
// archivo desde Node para escribir los metadatos de /en y /pt en el HTML
// estático, y Node no resuelve alias. Antes esas descripciones estaban copiadas
// a mano en el prerender y ya se habían desincronizado de las de acá.
import { subservicios } from "./subservices.js";
import { getRate } from "./currencies.js";

// Contenido de las versiones en inglés y portugués.
//
// Está escrito, no traducido. El argumento del sitio en español se apoya en
// cosas que fuera de Chile no significan nada o directamente confunden: IVA de
// 19%, boleta electrónica del SII, registro en INAPI, Transbank. Un lead de São
// Paulo que lee sobre el SII entiende, correctamente, que la página no es para
// él.
//
// Por eso acá los precios van en dólares y las referencias locales se
// reemplazan por lo que sí viaja: precio cerrado por escrito, código y accesos
// a nombre del cliente, y trato directo con quien programa.

// Las rutas de cada idioma, para el selector y para hreflang. Un solo lugar:
// si se desincronizan, hreflang apunta a páginas que no se corresponden y
// Google descarta el grupo entero.
export const RUTAS = {
  es: { es: "/", en: "/en", pt: "/pt", contacto: "/contacto" },
  en: { es: "/", en: "/en", pt: "/pt", contacto: "/en/contact" },
  pt: { es: "/", en: "/en", pt: "/pt", contacto: "/pt/contato" },
};

export const RUTAS_CONTACTO = {
  en: { es: "/contacto", en: "/en/contact", pt: "/pt/contato", contacto: "/en/contact" },
  pt: { es: "/contacto", en: "/en/contact", pt: "/pt/contato", contacto: "/pt/contato" },
};

// Precio de referencia en dólares, derivado del mismo catálogo que el sitio en
// español. Se redondea a la centena para que no quede un número de conversión
// —"$317"— que se lee a improvisado y además cambia solo con el tipo de cambio.
export function desdeUSD(id) {
  const servicio = subservicios.find((s) => s.id === id);
  const piso = servicio?.precios.find((p) => p !== null);
  if (!piso) return null;
  const tasa = getRate("USD");
  if (!tasa) return null;
  return Math.round((piso * tasa) / 100) * 100;
}

export const SERVICIOS_DESTACADOS = ["landing", "sitio", "ecommerce", "plataforma", "app-multi", "erp"];

// El "desde" de los metadatos sale del catálogo, no de la memoria de nadie.
// Estaba escrito a mano —"From USD 120"— contra un catálogo que da USD 100: un
// 20% de diferencia, en el texto que Google muestra como resultado. Es el mismo
// error que la portada en español tenía con $390.000.
//
// El redondeo a la centena de desdeUSD lo deja estable: para que esta cifra se
// moviera, el peso tendría que pasar de 667 o de 2.000 por dólar.
const DESDE_USD = desdeUSD("landing");
const DESDE_EN = DESDE_USD ? ` From USD ${DESDE_USD}.` : "";
const DESDE_PT = DESDE_USD ? ` A partir de USD ${DESDE_USD}.` : "";

export const EN = {
  lang: "en",
  idioma: "Language",
  ctaHeader: "Get a quote",
  agendar: "Book 30 minutes",
  whatsappMensaje: "Hi, I found maudev.cl and I'd like to talk about a web project.",
  pieDescripcion:
    "Web design and development for companies in Latin America. Fixed price in writing, and the code is yours.",
  pieLegal: "Built in Chile, working across Latin America and beyond.",

  meta: {
    title: "Web development for companies in Latin America · Maudev",
    description: `Websites, online stores and custom software, built in Chile for companies across the Americas. Fixed price agreed in writing before we start.${DESDE_EN}`,
  },

  // Los metadatos de la página de contacto viven acá, junto a los de la
  // portada, y no dentro del componente: el prerender los necesita para el HTML
  // estático y no puede importar un .jsx.
  metaContacto: {
    title: "Contact · Get a quote for your web project · Maudev",
    description: "Tell us what you sell and to whom. We reply the same business day with what you need, what it would cost and how long it would take.",
  },

  hero: {
    eyebrow: "Web design & development",
    titulo: "A development team you can actually talk to.",
    intro:
      "We build websites, online stores and custom software for companies that are tired of chasing agencies for a status update. You talk to the person writing the code, and the price is agreed in writing before anything starts.",
    nota: "Based in Chile · Working in English, Spanish and Portuguese",
  },

  secciones: [
    {
      titulo: "The price is closed before we start",
      parrafos: [
        "You get a written figure after we review what you need, and it does not move. If the project takes longer than expected, that risk is ours.",
        "Half when we start, half when you approve the delivery. No retainers, no monthly fee for using what we already handed over.",
      ],
    },
    {
      titulo: "The code and the accounts are yours",
      parrafos: [
        "Domain, hosting, repository and third-party accounts are created in your name, with your email and your card. It sounds like paperwork and it is what decides whether you can change providers next year without asking anyone for permission.",
        "Everything is delivered documented, so another developer can pick it up. We do not build sites that only keep working while you keep paying us.",
      ],
    },
    {
      titulo: "We will tell you when you do not need us",
      parrafos: [
        "Some projects are better solved with an off-the-shelf tool that costs a fraction of custom work. We say so even when it means not selling.",
        "We also do not promise conversion percentages or timelines we cannot support. If it cannot be verified, it is not written anywhere on this site.",
      ],
    },
    {
      titulo: "Working across time zones",
      parrafos: [
        "We are in Chile, which overlaps with most of the working day in the Americas and part of the European morning. Replies come the same business day.",
        "Payment by international transfer or USDT. Invoicing is handled from Chile and we confirm what your accounting needs before starting.",
      ],
    },
  ],

  serviciosEpigrafe: "Services and pricing",
  serviciosTitulo: "What we build, and what it costs",
  serviciosIntro:
    "Reference floors in US dollars for a typical scope. The exact figure is agreed in writing after we review your case.",
  servicios: {
    landing: { nombre: "Landing page", texto: "One page, one promise, one conversion. For campaigns and validation." },
    sitio: { nombre: "Company website", texto: "Home, services, work and contact, with a small admin panel if you need one." },
    ecommerce: { nombre: "Online store", texto: "Catalogue, payments, stock and order management as a single process." },
    plataforma: { nombre: "Web platform", texto: "Your own tool online, with accounts, roles and recurring billing." },
    "app-multi": { nombre: "Mobile app", texto: "One codebase running on both Android and iPhone." },
    erp: { nombre: "Management system", texto: "Inventory, purchases, sales and documents in one place, built module by module." },
  },

  faqEpigrafe: "Questions",
  faqTitulo: "Before you write",
  faqs: [
    {
      q: "Do you work with clients outside Chile?",
      a: "Yes. Everything is done remotely, which is how most of our projects run anyway. We work in English, Spanish and Portuguese.",
    },
    {
      q: "How do payments work from abroad?",
      a: "International bank transfer or USDT. Half to start and half on approved delivery, same as any other project.",
    },
    {
      q: "How long does a project take?",
      a: "A landing page is measured in days, a company website in weeks, and a platform or management system grows in stages with something usable at each one. You get a date in writing along with the price.",
    },
    {
      q: "Who will I actually be talking to?",
      a: "The person building it. No account manager and no handover to a third party halfway through.",
    },
  ],

  cierre: {
    titulo: "Tell us what you sell and to whom.",
    texto: "We will tell you what you need, what it would cost and how long it would take. Same business day.",
    boton: "Start the conversation",
  },
};

export const PT = {
  lang: "pt",
  idioma: "Idioma",
  ctaHeader: "Pedir orçamento",
  agendar: "Agendar 30 minutos",
  whatsappMensaje: "Olá, encontrei o maudev.cl e gostaria de conversar sobre um projeto web.",
  pieDescripcion:
    "Design e desenvolvimento web para empresas na América Latina. Preço fechado por escrito, e o código é seu.",
  pieLegal: "Feito no Chile, atendendo toda a América Latina.",

  meta: {
    title: "Desenvolvimento web para empresas na América Latina · Maudev",
    description: `Sites, lojas online e software sob medida, feitos no Chile para empresas de toda a América. Preço fechado por escrito antes de começar.${DESDE_PT}`,
  },

  metaContacto: {
    title: "Contato · Orçamento para o seu projeto web · Maudev",
    description: "Conte o que você vende e para quem. Respondemos no mesmo dia útil com o que precisa, quanto custaria e em quanto tempo estaria no ar.",
  },

  hero: {
    eyebrow: "Design e desenvolvimento web",
    titulo: "Uma equipe de desenvolvimento com quem dá para conversar.",
    intro:
      "Criamos sites, lojas online e software sob medida para empresas cansadas de cobrar status de agência. Você fala direto com quem escreve o código, e o preço é fechado por escrito antes de qualquer coisa começar.",
    nota: "Sediados no Chile · Atendimento em português, espanhol e inglês",
  },

  secciones: [
    {
      titulo: "O preço é fechado antes de começar",
      parrafos: [
        "Você recebe um valor por escrito depois que revisamos o que precisa, e ele não muda. Se o projeto levar mais tempo que o previsto, esse risco é nosso.",
        "Metade no início e metade na entrega aprovada. Sem mensalidade e sem cobrança por continuar usando o que já entregamos.",
      ],
    },
    {
      titulo: "O código e as contas são seus",
      parrafos: [
        "Domínio, hospedagem, repositório e contas de terceiros são criados no seu nome, com o seu e-mail e o seu cartão. Parece burocracia e é o que decide se no ano que vem você pode trocar de fornecedor sem pedir permissão a ninguém.",
        "Tudo é entregue documentado, para que outro desenvolvedor consiga continuar. Não construímos sites que só funcionam enquanto você continua pagando.",
      ],
    },
    {
      titulo: "Vamos dizer quando você não precisa de nós",
      parrafos: [
        "Alguns projetos se resolvem melhor com uma ferramenta de mercado que custa uma fração do desenvolvimento sob medida. Dizemos isso mesmo quando significa não vender.",
        "Também não prometemos percentuais de conversão nem prazos que não possamos sustentar. Se não dá para comprovar, não está escrito em lugar nenhum deste site.",
      ],
    },
    {
      titulo: "Trabalhando entre fusos",
      parrafos: [
        "Estamos no Chile, com apenas uma hora de diferença do horário de Brasília. Na prática, o dia de trabalho é o mesmo e as respostas saem no mesmo dia útil.",
        "Pagamento por transferência internacional ou USDT. A emissão fiscal é feita a partir do Chile e confirmamos o que a sua contabilidade precisa antes de começar.",
      ],
    },
  ],

  serviciosEpigrafe: "Serviços e preços",
  serviciosTitulo: "O que fazemos, e quanto custa",
  serviciosIntro:
    "Valores de referência em dólares para um escopo típico. O número exato é fechado por escrito depois de revisar o seu caso.",
  servicios: {
    landing: { nombre: "Landing page", texto: "Uma página, uma promessa, uma conversão. Para campanhas e validação." },
    sitio: { nombre: "Site institucional", texto: "Início, serviços, trabalhos e contato, com um painel simples se precisar." },
    ecommerce: { nombre: "Loja online", texto: "Catálogo, pagamentos, estoque e pedidos como um processo só." },
    plataforma: { nombre: "Plataforma web", texto: "A sua própria ferramenta online, com contas, perfis e cobrança recorrente." },
    "app-multi": { nombre: "Aplicativo móvel", texto: "Uma base de código rodando em Android e iPhone." },
    erp: { nombre: "Sistema de gestão", texto: "Estoque, compras, vendas e documentos em um só lugar, por módulos." },
  },

  faqEpigrafe: "Perguntas",
  faqTitulo: "Antes de escrever",
  faqs: [
    {
      q: "Vocês atendem clientes fora do Chile?",
      a: "Sim. Tudo é feito remotamente, que é como a maioria dos nossos projetos funciona de qualquer forma. Atendemos em português, espanhol e inglês.",
    },
    {
      q: "Como funciona o pagamento do Brasil?",
      a: "Transferência internacional ou USDT. Metade para começar e metade na entrega aprovada, igual a qualquer outro projeto.",
    },
    {
      q: "Quanto tempo leva um projeto?",
      a: "Uma landing page se mede em dias, um site institucional em semanas, e uma plataforma ou sistema de gestão cresce por etapas com algo utilizável em cada uma. O prazo vai por escrito junto com o preço.",
    },
    {
      q: "Com quem eu vou falar?",
      a: "Com quem constrói. Sem executivo de contas e sem repassar o projeto para terceiros no meio do caminho.",
    },
  ],

  cierre: {
    titulo: "Conte o que você vende e para quem.",
    texto: "Dizemos o que você precisa, quanto custaria e em quanto tempo estaria no ar. No mesmo dia útil.",
    boton: "Começar a conversa",
  },
};
