import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './lib/ScrollToTop';
import MetaPixelTracker from './lib/MetaPixelTracker';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AdminGuard from './components/admin/AdminGuard';
import WhatsAppFloat from '@/components/landing/WhatsAppFloat';
import AdminLayout from './components/admin/AdminLayout';
import Landing from './pages/Landing'; // eager: es la home (LCP) y la entrada más común

// El resto se carga BAJO DEMANDA (code-splitting) → bundle inicial mucho menor,
// menos JS bloqueando el hilo principal (mejor TBT/rendimiento). Cada página y
// el blog pesado (blogPosts.js) quedan en su propio chunk.
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const Servicios = lazy(() => import('./pages/Servicios'));
const Portafolio = lazy(() => import('./pages/Portafolio'));
const CasoEstudio = lazy(() => import('./pages/CasoEstudio'));
const SobreNosotros = lazy(() => import('./pages/SobreNosotros'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Precios = lazy(() => import('./pages/Precios'));
const Cotizador = lazy(() => import('./pages/Cotizador'));
const DiagnosticoWeb = lazy(() => import('./pages/DiagnosticoWeb'));
const Ahora = lazy(() => import('./pages/Ahora'));
const Contrato = lazy(() => import('./pages/Contrato'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const EliminacionDatos = lazy(() => import('./pages/EliminacionDatos'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
const AdminTikTok = lazy(() => import('./pages/admin/AdminTikTok'));
const AdminMetricas = lazy(() => import('./pages/admin/AdminMetricas'));
const LpDiagnostico = lazy(() => import('./pages/lp/Diagnostico'));
const LinkInBio = lazy(() => import('./pages/LinkInBio'));
const Guia = lazy(() => import('./pages/Guia'));

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <Spinner />;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/precios" element={<Precios />} />
        <Route path="/cotizador" element={<Cotizador />} />
        <Route path="/diagnostico-web" element={<DiagnosticoWeb />} />
        <Route path="/ahora" element={<Ahora />} />
        <Route path="/contrato" element={<Contrato />} />
        <Route path="/portafolio" element={<Portafolio />} />
        <Route path="/portafolio/:projectId" element={<CasoEstudio />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPostDetail />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/eliminacion-datos" element={<EliminacionDatos />} />
        <Route path="/lp/diagnostico" element={<LpDiagnostico />} />
        <Route path="/ig" element={<LinkInBio />} />
        <Route path="/links" element={<LinkInBio />} />
        <Route path="/guia" element={<Guia />} />
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/portafolio" element={<AdminPortfolio />} />
            <Route path="/admin/tiktok" element={<AdminTikTok />} />
            <Route path="/admin/metricas" element={<AdminMetricas />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <MetaPixelTracker />
          <AuthenticatedApp />
          <WhatsAppFloat />
        </Router>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
