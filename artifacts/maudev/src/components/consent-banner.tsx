/**
 * Banner de consentimiento de cookies — Consent Mode v2 de Google.
 *
 * IMPORTANTE: Sin este banner, GA4 y Google Ads NO reciben datos porque
 * el consent mode está configurado en "denied" por defecto en index.html.
 * Este componente es el que "desbloquea" el tracking al aceptar.
 */

import { useState, useEffect } from "react";
import { X, Cookie, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveConsent, getStoredConsent, type ConsentLevel } from "@/lib/gtag";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar si el usuario aún no decidió
    const stored = getStoredConsent();
    if (!stored) {
      // Pequeño delay para no interrumpir la carga inicial
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      // Restaurar preferencia guardada
      saveConsent(stored);
    }
  }, []);

  function accept(level: ConsentLevel) {
    saveConsent(level);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-primary/20 bg-background/95 backdrop-blur-md shadow-2xl"
      role="dialog"
      aria-label="Configuración de cookies"
    >
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Cookie className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                Usamos cookies para mejorar tu experiencia
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilizamos Google Analytics para entender cómo se usa el sitio y
                mejorar nuestro contenido. Algunos links son de afiliados — si
                compras a través de ellos, recibimos una comisión sin costo
                extra para ti.{" "}
                <a href="/privacy" className="underline hover:text-primary transition-colors">
                  Política de privacidad
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button
              size="sm"
              variant="ghost"
              className="font-mono text-xs text-muted-foreground hover:text-foreground border border-border/40"
              onClick={() => accept("analytics_only")}
            >
              Solo esenciales
            </Button>
            <Button
              size="sm"
              className="font-mono text-xs rounded-none gap-1.5 glow-primary"
              onClick={() => accept("all")}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Aceptar todo
            </Button>
            <button
              className="p-1 text-muted-foreground hover:text-foreground transition-colors ml-1"
              onClick={() => accept("analytics_only")}
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
