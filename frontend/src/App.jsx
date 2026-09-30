import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './lib/ScrollToTop';
import MetaPixelTracker from './lib/MetaPixelTracker';
import ChatWidget from '@/components/landing/ChatWidget';
// Nombre neutro a propósito: las listas de los bloqueadores (Brave, uBlock)
// bloquean archivos llamados CookieConsent o consent.js, y en desarrollo eso
// deja la app en negro porque Vite sirve cada módulo con su nombre real.
import AvisoPrivacidad from '@/components/landing/AvisoPrivacidad';
import Landing from './pages/Landing'; // eager: es la home (LCP) y la entrada más común

// El resto se carga BAJO DEMANDA (code-splitting) → bundle inicial mucho menor.
const AutomatizacionDetail = lazy(() => import('./pages/AutomatizacionDetail'));
const CasoEstudio = lazy(() => import('./pages/CasoEstudio'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const SubservicePage = lazy(() => import('./pages/SubservicePage'));
const Cases = lazy(() => import('./pages/Cases'));
const About = lazy(() => import('./pages/About'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Precios = lazy(() => import('./pages/Precios'));
const Ley21719 = lazy(() => import('./pages/Ley21719'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const EliminacionDatos = lazy(() => import('./pages/EliminacionDatos'));
const LinkInBio = lazy(() => import('./pages/LinkInBio'));
// Portal de clientes y panel admin: chunks aparte, nunca en el bundle del sitio.
const PortalEntrar = lazy(() => import('./portal/cliente/Entrar'));
const PortalResumen = lazy(() => import('./portal/cliente/Resumen'));
const AdminClientes = lazy(() => import('./portal/admin/Clientes'));
const AdminCliente = lazy(() => import('./portal/admin/Cliente'));
const AdminAuditoria = lazy(() => import('./portal/admin/Auditoria'));

// El portal no mide ni ofrece chat: ahí se ven datos de clientes, y ni el píxel
// ni la analítica tienen nada que hacer con esas pantallas.
function SoloSitio({ children }) {
  return useLocation().pathname.startsWith('/portal') ? null : children;
}

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <SoloSitio><MetaPixelTracker /></SoloSitio>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Arquitectura comercial: una intención principal por página. */}
            <Route path="/ley-21719" element={<Ley21719 />} />
            <Route path="/automatizacion" element={<ServicePage serviceKey="automatizacion" />} />
            <Route path="/software-a-medida" element={<ServicePage serviceKey="software-a-medida" />} />
            <Route path="/desarrollo-web" element={<ServicePage serviceKey="desarrollo-web" />} />
            <Route path="/ecommerce" element={<ServicePage serviceKey="ecommerce" />} />
            <Route path="/mantencion" element={<ServicePage serviceKey="mantencion" />} />
            <Route path="/apps-moviles" element={<ServicePage serviceKey="apps-moviles" />} />
            <Route path="/diseno" element={<ServicePage serviceKey="diseno" />} />

            {/* Una página por servicio del catálogo. Generadas desde datos:
                ver src/data/subservices.js */}
            <Route path="/servicios/:slug" element={<SubservicePage />} />
            <Route path="/casos" element={<Cases />} />
            <Route path="/casos/:projectId" element={<CasoEstudio />} />
            <Route path="/nosotros" element={<About />} />

            {/* Páginas de conversión: es donde aterrizan los anuncios */}
            <Route path="/automatizaciones/:slug" element={<AutomatizacionDetail />} />
            {/* Compatibilidad en cliente; Cloudflare realiza el 301 real. */}
            <Route path="/portafolio/:projectId" element={<CasoEstudio />} />
            <Route path="/contacto" element={<Contacto />} />

            <Route path="/portal" element={<PortalResumen />} />
            <Route path="/portal/entrar" element={<PortalEntrar />} />
            <Route path="/portal/admin" element={<AdminClientes />} />
            <Route path="/portal/admin/clientes/:id" element={<AdminCliente />} />
            <Route path="/portal/admin/auditoria" element={<AdminAuditoria />} />

            {/* Productos n8n autoservicio (audiencia distinta: técnica e internacional).
                Fuera del navbar a propósito, para no competir con el CTA de la home. */}
            <Route path="/precios" element={<Precios />} />

            {/* Legales: obligatorias para poder pautar en Meta */}
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/eliminacion-datos" element={<EliminacionDatos />} />

            <Route path="/ig" element={<LinkInBio />} />
            <Route path="/links" element={<LinkInBio />} />

            {/* Rutas fusionadas en la home. Se mantienen como redirect en cliente
                por si alguien llega desde un link viejo; el 301 real lo hace
                Cloudflare vía public/_redirects (eso es lo que lee Google). */}
            <Route path="/servicios" element={<Navigate to="/desarrollo-web" replace />} />
            <Route path="/automatizaciones" element={<Navigate to="/automatizacion" replace />} />
            <Route path="/portafolio" element={<Navigate to="/casos" replace />} />
            <Route path="/sobre-nosotros" element={<Navigate to="/nosotros" replace />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <SoloSitio>
          <ChatWidget />
          <AvisoPrivacidad />
        </SoloSitio>
      </Router>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
