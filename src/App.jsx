import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './lib/ScrollToTop';
import MetaPixelTracker from './lib/MetaPixelTracker';
import ChatWidget from '@/components/landing/ChatWidget';
import CookieConsent from '@/components/landing/CookieConsent';
import Landing from './pages/Landing'; // eager: es la home (LCP) y la entrada más común

// El resto se carga BAJO DEMANDA (code-splitting) → bundle inicial mucho menor.
const AutomatizacionDetail = lazy(() => import('./pages/AutomatizacionDetail'));
const CasoEstudio = lazy(() => import('./pages/CasoEstudio'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Precios = lazy(() => import('./pages/Precios'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const EliminacionDatos = lazy(() => import('./pages/EliminacionDatos'));
const LinkInBio = lazy(() => import('./pages/LinkInBio'));

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <MetaPixelTracker />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Páginas de conversión: es donde aterrizan los anuncios */}
            <Route path="/automatizaciones/:slug" element={<AutomatizacionDetail />} />
            <Route path="/portafolio/:projectId" element={<CasoEstudio />} />
            <Route path="/contacto" element={<Contacto />} />

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
            <Route path="/servicios" element={<Navigate to="/#automatizaciones" replace />} />
            <Route path="/automatizaciones" element={<Navigate to="/#automatizaciones" replace />} />
            <Route path="/portafolio" element={<Navigate to="/#portafolio" replace />} />
            <Route path="/sobre-nosotros" element={<Navigate to="/" replace />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <ChatWidget />
        <CookieConsent />
      </Router>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}

export default App
