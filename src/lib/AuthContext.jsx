import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL, isAdminEmail } from '@/lib/auth';

const AuthContext = createContext();

const toAppUser = (u) => ({
  id: u.id,
  email: u.email,
  full_name: u.user_metadata?.full_name || u.user_metadata?.name,
  avatar_url: u.user_metadata?.avatar_url,
  role: isAdminEmail(u.email) ? 'admin' : 'user',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState({ id: 'maudev', public_settings: {} });

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        setUser(toAppUser(session.user));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toAppUser(session.user));
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async (shouldRedirect = true) => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) window.location.href = '/';
  };

  const navigateToLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/admin` },
      });
      if (error) throw error;
      setAuthError(null);
    } catch (err) {
      setAuthError({ type: 'auth_required', message: err.message });
    }
  };

  const checkUserAuth = async () => {};
  const checkAppState = async () => {};

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
      adminEmail: ADMIN_EMAIL,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
