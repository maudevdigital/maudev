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
import Landing from './pages/Landing';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Servicios from './pages/Servicios';
import Portafolio from './pages/Portafolio';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import Dashboard from './pages/admin/Dashboard';
import AdminBlog from './pages/admin/AdminBlog';
import AdminLeads from './pages/admin/AdminLeads';
import AdminPortfolio from './pages/admin/AdminPortfolio';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/portafolio" element={<Portafolio />} />
      <Route path="/sobre-nosotros" element={<SobreNosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:postId" element={<BlogPostDetail />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/portafolio" element={<AdminPortfolio />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
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
        </Router>
        <WhatsAppFloat />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
