/**
 * Mock Clerk provider for local development without real Clerk keys.
 * Provides no-op implementations of Clerk hooks/components so the UI renders.
 */
import { createContext, useContext, type ReactNode } from "react";

const MockClerkContext = createContext({
  user: null as null,
  isSignedIn: false as boolean,
  isLoaded: true as boolean,
  getToken: async () => null as string | null,
  signOut: async () => {},
  addListener: (_cb: any) => (() => {}),
});

export function MockClerkProvider({ children }: { children: ReactNode }) {
  return (
    <MockClerkContext.Provider
      value={{
        user: null,
        isSignedIn: false,
        isLoaded: true,
        getToken: async () => null,
        signOut: async () => {},
        addListener: () => () => {},
      }}
    >
      {children}
    </MockClerkContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(MockClerkContext);
  return { user: ctx.user, isSignedIn: ctx.isSignedIn, isLoaded: ctx.isLoaded };
}

export function useAuth() {
  const ctx = useContext(MockClerkContext);
  return { getToken: ctx.getToken, isSignedIn: ctx.isSignedIn, isLoaded: ctx.isLoaded };
}

export function useClerk() {
  const ctx = useContext(MockClerkContext);
  return { signOut: ctx.signOut, addListener: ctx.addListener };
}

/** Show component mock — renders children for "signed-out", hides for "signed-in" */
export function Show({ when, children }: { when: string; children: ReactNode }) {
  if (when === "signed-out") return <>{children}</>;
  return null;
}

export function SignIn() {
  return <div className="p-8 text-center text-muted-foreground font-mono">Auth deshabilitado en modo local</div>;
}

export function SignUp() {
  return <div className="p-8 text-center text-muted-foreground font-mono">Auth deshabilitado en modo local</div>;
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <MockClerkProvider>{children}</MockClerkProvider>;
}
