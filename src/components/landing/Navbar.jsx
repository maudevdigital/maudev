import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/landing/Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Servicios", to: "/servicios" },
    { label: "Portafolio", to: "/portafolio" },
    { label: "Sobre nosotros", to: "/sobre-nosotros" },
    { label: "Blog", to: "/blog" },
    { label: "Contacto", to: "/contacto" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 text-primary">
            <Logo size={32} />
            <span className="text-lg font-bold tracking-tight text-foreground">
              mau<span className="text-primary">dev</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/contacto">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Agendar diagnóstico
              </Button>
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/contacto" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Agendar diagnóstico
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
