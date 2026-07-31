import { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { priceFor } from "@/lib/region";
import { N8N_PRODUCTS } from "@/data/n8nProducts";
import CheckoutModal from "./CheckoutModal";

export default function N8nProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-card/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider mb-3">
            <Zap className="h-3.5 w-3.5" />
            Productized Workflows · Compra Directa
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2 mb-4">
            {"Workflows de n8n listos para"}{" "}
            <span className="text-primary">{"desplegar y vender"}</span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Sin contratar meses de desarrollo. Automatizaciones paquetizadas diseñadas para convertir leads de Meta Ads, conectar WhatsApp API y facturar automáticamente.
          </p>
        </div>

        {/* Grid de Productos */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {N8N_PRODUCTS.map((prod) => {
            const Icon = prod.icon;
            return (
              <div
                key={prod.id}
                className={`flex flex-col bg-card border rounded-2xl p-7 relative transition-all duration-300 ${
                  prod.featured
                    ? "border-primary/50 shadow-lg shadow-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-border/80"
                }`}
              >
                {prod.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[11px] font-bold font-mono px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Recomendado Meta Ads
                  </div>
                )}

                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  {prod.badge}
                </span>

                <h3 className="text-xl font-bold mb-2 text-foreground">{prod.name}</h3>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black tracking-tight text-primary font-mono">{priceFor(prod).main}</span>
                  {priceFor(prod).secondary && (
                    <span className="text-xs font-mono text-muted-foreground">({priceFor(prod).secondary})</span>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-4">⏱ {prod.period}</p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {prod.description}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">
                      ¿Qué incluye este paquete?
                    </p>
                    <ul className="space-y-2 mb-6">
                      {prod.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleBuyClick(prod)}
                    className={`w-full h-11 font-bold text-sm rounded-xl flex items-center justify-center gap-2 ${
                      prod.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                        : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    Adquirir Workflow Ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Garantía y Transparencia Legal */}
        <div className="mt-12 bg-background border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold">{"Garantía de Despliegue & Boleta SII"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pagos seguros procesados por Mercado Pago o Stripe. Emitimos boleta/factura electrónica autorizada por el SII conforme a la ley chilena.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-muted-foreground">
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border">Webpay / MercadoPago</span>
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border">Stripe USD</span>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
      <CheckoutModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
