import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "@/components/landing/PageShell";
import { useSeo } from "@/lib/useSeo";

export default function PageNotFound() {
  useSeo({ title: "Página no encontrada · Maudev", description: "La página que buscas no existe o cambió de dirección.", noindex: true });

  return (
    <PageShell>
      <main className="grid min-h-[75vh] place-items-center px-4 pb-20 pt-32 text-center">
        <div>
          <p className="font-mono text-sm font-semibold text-primary">ERROR 404</p>
          <h1 className="mt-5 text-5xl font-extrabold tracking-[-0.06em] sm:text-7xl">Esta ruta no lleva a ningún proceso.</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">Puede que la página haya cambiado o que el enlace esté incompleto.</p>
          <Link to="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
