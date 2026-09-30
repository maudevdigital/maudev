import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './lib/ScrollToTop';
import MetaPixelTracker from './lib/MetaPixelTracker';
import BotonWhatsApp from '@/components/landing/BotonWhatsApp';
// Nombre neutro a propósito: las listas de los bloqueadores (Brave, uBlock)
// bloquean archivos llamados CookieConsent o consent.js, y en desarrollo eso
// deja la app en negro porque Vite sirve cada módulo con su nombre real.
import AvisoPrivacidad from '@/components/landing/AvisoPrivacidad';
import Landing from './pages/Landing'; // eager: es la home (LCP) y la entrada más común

// El resto se carga BAJO DEMANDA (code-splitting) → bundle inicial mucho menor.
const CasoEstudio = lazy(() => import('./pages/CasoEstudio'));
const Cases = lazy(() => import('./pages/Cases'));
const About = lazy(() => import('./pages/About'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Ley21719 = lazy(() => import('./pages/Ley21719'));
const Servicio = lazy(() => import('./pages/Servicio'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const EliminacionDatos = lazy(() => import('./pages/EliminacionDatos'));
// Portal de clientes y panel admin: chunks aparte, nunca en el bundle del sitio.
const PortalEntrar = lazy(() => import('./portal/cliente/Entrar'));
const PortalResumen = lazy(() => import('./portal/cliente/Resumen'));
const PortalIngresar = lazy(() => import('./portal/cliente/Ingresar'));
const AdminResumen = lazy(() => import('./portal/admin/Resumen'));
const AdminClientes = lazy(() => import('./portal/admin/Clientes'));
const AdminProyectos = lazy(() => import('./portal/admin/Proyectos'));
const AdminContactos = lazy(() => import('./portal/admin/Contactos'));
const AdminDerechos = lazy(() => import('./portal/admin/Derechos'));
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
        {/* Primer elemento enfocable de cada página: con teclado o lector de
            pantalla se salta el menú de un Tab. Mueve el foco al <main> en vez de
            cambiar la URL, que el router interpretaría como navegación. */}
        <a
          href="#contenido"
          className="skip-link"
          onClick={(e) => {
            const destino = document.getElementById('contenido');
            if (!destino) return;
            e.preventDefault();
            destino.focus();
            destino.scrollIntoView();
          }}
        >
          Saltar al contenido
        </a>
        <SoloSitio><MetaPixelTracker /></SoloSitio>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Arquitectura comercial: una intención principal por página. */}
            <Route path="/ley-21719" element={<Ley21719 />} />
            <Route path="/inteligencia-artificial" element={<Servicio id="ia" />} />
            <Route path="/desarrollo" element={<Servicio id="desarrollo" />} />
            <Route path="/soporte" element={<Servicio id="soporte" />} />
            <Route path="/casos" element={<Cases />} />
            <Route path="/casos/:projectId" element={<CasoEstudio />} />
            <Route path="/nosotros" element={<About />} />

            {/* Compatibilidad en cliente; Cloudflare realiza el 301 real. */}
            <Route path="/portafolio/:projectId" element={<CasoEstudio />} />
            <Route path="/contacto" element={<Contacto />} />

            <Route path="/portal" element={<PortalResumen />} />
            <Route path="/portal/entrar" element={<PortalEntrar />} />
            <Route path="/portal/ingresar" element={<PortalIngresar />} />
            <Route path="/portal/admin" element={<AdminResumen />} />
            <Route path="/portal/admin/clientes" element={<AdminClientes />} />
            <Route path="/portal/admin/proyectos" element={<AdminProyectos />} />
            <Route path="/portal/admin/contactos" element={<AdminContactos />} />
            <Route path="/portal/admin/derechos" element={<AdminDerechos />} />
            <Route path="/portal/admin/clientes/:id" element={<AdminCliente />} />
            <Route path="/portal/admin/auditoria" element={<AdminAuditoria />} />

            {/* Legales: obligatorias para poder pautar en Meta */}
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/eliminacion-datos" element={<EliminacionDatos />} />

            {/* Rutas fusionadas en la home. Se mantienen como redirect en cliente
                por si alguien llega desde un link viejo; el 301 real lo hace
                Cloudflare vía public/_redirects (eso es lo que lee Google). */}
            <Route path="/servicios" element={<Navigate to="/desarrollo" replace />} />
            <Route path="/automatizaciones" element={<Navigate to="/inteligencia-artificial" replace />} />
            <Route path="/portafolio" element={<Navigate to="/casos" replace />} />
            <Route path="/sobre-nosotros" element={<Navigate to="/nosotros" replace />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <SoloSitio>
          <BotonWhatsApp />
          <AvisoPrivacidad />
        </SoloSitio>
      </Router>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
