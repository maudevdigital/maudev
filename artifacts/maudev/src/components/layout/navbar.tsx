import { Link, useLocation } from "wouter";
import { Show, useUser, useClerk, useAuth } from "@clerk/react";
import { LogOut, User, Menu, X, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken, isSignedIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { setIsAdmin(false); return; }
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/admin/check", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setIsAdmin(res.ok);
      } catch {
        setIsAdmin(false);
      }
    })();
  }, [isSignedIn, getToken]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/50">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold tracking-tighter">
              <span className="text-primary">MAU</span><span className="text-foreground/90">DEV</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/herramientas"
              className={`font-mono text-xs transition-colors hover:text-primary ${
                location.startsWith("/herramientas") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              HERRAMIENTAS
            </Link>
            <Link
              href="/comparativas/mejor-hosting"
              className={`font-mono text-xs transition-colors hover:text-primary ${
                location.startsWith("/comparativas") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              COMPARATIVAS
            </Link>
            <Link
              href="/blog"
              className={`font-mono text-xs transition-colors hover:text-primary ${
                location.startsWith("/blog") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              BLOG
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-foreground">
                  LOG IN
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60 transition-all">
                  SIGN UP
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <Settings className="h-4 w-4" />
                    <span className="hidden lg:inline-block font-mono text-xs">ADMIN</span>
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden lg:inline-block font-mono text-xs">DASHBOARD</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-2 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </Show>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 max-w-7xl mx-auto">
          <nav className="flex flex-col gap-4">
            <Link
              href="/herramientas"
              className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              HERRAMIENTAS
            </Link>
            <Link
              href="/comparativas/mejor-hosting"
              className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              COMPARATIVAS
            </Link>
            <Link
              href="/blog"
              className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              BLOG
            </Link>
            <div className="h-px bg-border/40" />
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start font-mono text-xs text-muted-foreground">
                  LOG IN
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start font-mono text-xs rounded-none border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20">
                  SIGN UP
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </Show>
          </nav>
        </div>
      )}
    </header>
  );
}
