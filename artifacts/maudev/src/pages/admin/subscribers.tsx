import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useListSubscribers } from "@workspace/api-client-react";
import { Users } from "lucide-react";

function AdminSubscribersContent() {
  const { data: subscribers = [], isLoading } = useListSubscribers();

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs text-primary mb-1">EMAIL MARKETING</p>
        <h1 className="text-2xl font-bold tracking-tight">Suscriptores</h1>
        <p className="text-sm text-muted-foreground mt-1">{subscribers.length} suscriptores activos</p>
      </div>

      <div className="border border-border/40 bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/30">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">LISTA DE SUSCRIPTORES</span>
        </div>
        <div className="divide-y divide-border/40">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : subscribers.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-muted-foreground" data-testid="text-no-subscribers">
              SIN SUSCRIPTORES AÚN
            </div>
          ) : (
            subscribers.map((sub) => (
              <div key={sub.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors" data-testid={`row-subscriber-${sub.id}`}>
                <div>
                  <p className="text-sm font-medium" data-testid={`text-email-${sub.id}`}>{sub.email}</p>
                  {sub.name && <p className="text-xs text-muted-foreground">{sub.name}</p>}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {new Date(sub.subscribedAt).toLocaleDateString("es-CL")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSubscribers() {
  return (
    <>
      <Show when="signed-in">
        <AdminSubscribersContent />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
