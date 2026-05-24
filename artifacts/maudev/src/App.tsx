import { useEffect, useRef, Component, type ReactNode } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useAuth } from '@clerk/react';
import { Switch, Route, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@workspace/api-client-react";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "./pages/home";
import Products from "./pages/products";
import ProductDetail from "./pages/products/[id]";
import Checkout from "./pages/checkout";
import Dashboard from "./pages/dashboard";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import AdminDashboard from "./pages/admin";
import AdminProducts from "./pages/admin/products";
import AdminOrders from "./pages/admin/orders";
import AdminSubscribers from "./pages/admin/subscribers";
import AdminBlog from "./pages/admin/blog";
import AdminCampaigns from "./pages/admin/campaigns";
import Blog from "./pages/blog";
import BlogPost from "./pages/blog-post";
import HerramientasSEO from "./pages/herramientas-seo";
import NotFound from "./pages/not-found";
import RootLayout from "./components/layout/root-layout";
import AdminLayout from "./components/layout/admin-layout";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkAuthTokenSetup() {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);
  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

const queryClient = new QueryClient();

// Error Boundary to prevent white-screen crashes
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-background text-foreground p-8">
          <div className="text-center space-y-4 max-w-md">
            <p className="font-mono text-xs text-primary">ERROR</p>
            <h1 className="text-2xl font-bold">Algo salió mal</h1>
            <p className="text-muted-foreground text-sm">Ha ocurrido un error inesperado. Intenta recargar la página.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground font-mono text-xs"
            >
              RECARGAR
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkAuthTokenSetup />
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/admin" nest>
              <AdminLayout>
                <Switch>
                  <Route path="/" component={AdminDashboard} />
                  <Route path="/products" component={AdminProducts} />
                  <Route path="/orders" component={AdminOrders} />
                  <Route path="/subscribers" component={AdminSubscribers} />
                  <Route path="/blog" component={AdminBlog} />
                  <Route path="/campaigns" component={AdminCampaigns} />
                  <Route component={NotFound} />
                </Switch>
              </AdminLayout>
            </Route>
            
            <Route path="/*">
              <RootLayout>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/products" component={Products} />
                  <Route path="/products/:id" component={ProductDetail} />
                  <Route path="/checkout" component={Checkout} />
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/blog/:slug" component={BlogPost} />
                  <Route path="/blog" component={Blog} />
                  <Route path="/herramientas-seo" component={HerramientasSEO} />
                  <Route path="/terms" component={Terms} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/sign-in/*?" component={SignInPage} />
                  <Route path="/sign-up/*?" component={SignUpPage} />
                  <Route component={NotFound} />
                </Switch>
              </RootLayout>
            </Route>
          </Switch>
        </TooltipProvider>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
    </ErrorBoundary>
  );
}

export default App;
