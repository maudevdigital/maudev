import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo-head";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <SEOHead title="Página no encontrada" noindex={true} />
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-12 w-12 text-primary/60" />
        </div>
        <p className="font-mono text-xs text-primary mb-2">ERROR 404</p>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Página no encontrada</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          La página que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
        </p>
        <Link href="/">
          <Button className="rounded-none font-mono text-sm gap-2">
            <ArrowLeft className="h-4 w-4" />
            VOLVER AL INICIO
          </Button>
        </Link>
      </div>
    </div>
  );
}
