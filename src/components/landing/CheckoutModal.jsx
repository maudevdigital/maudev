import { useState } from "react";
import { X, CheckCircle, CreditCard, ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { toast } from "sonner";
import { defaultPaymentMethod, priceFor, getRegion } from "@/lib/region";
import RiskReversal from "@/components/landing/RiskReversal";
import TurnstileGate from "@/components/landing/TurnstileGate";

export default function CheckoutModal({ product, isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // El default sale de la región detectada (zona horaria), no está fijo:
  // en Chile arranca en transferencia, fuera de Chile en Lemon Squeezy.
  const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod); // mercadopago, flow, stripe, transferencia
  const { submit, loading, sent: submitted } = useLeadSubmit();

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Por favor completa nombre y correo");
      return;
    }

    // Guarda la intención de compra como lead (→ webhook n8n). El toast/redirección
    // los maneja este componente (successMessage: null suprime el toast por defecto).
    const ok = await submit({
      lead: {
        name,
        email: email,
        whatsapp: phone || undefined,
        interest: `Implementación: ${product.name}`,
        message: `Solicitud de implementación: ${product.name}. Medio preferido: ${paymentMethod}.`,
        source: "automation_detail",
      },
      successMessage: null,
    });
    if (!ok) return;

    // Si el producto tiene link de checkout directo para esa pasarela, redirigir.
    let checkoutLink = null;
    if (paymentMethod === "stripe" && product.checkoutUrlUSD) {
      checkoutLink = product.checkoutUrlUSD;
    } else if ((paymentMethod === "mercadopago" || paymentMethod === "flow") && product.checkoutUrlCLP) {
      checkoutLink = product.checkoutUrlCLP;
    }

    if (checkoutLink) {
      toast.success("Redirigiendo a la pasarela de pago...");
      setTimeout(() => {
        window.location.href = checkoutLink;
      }, 1200);
    } else {
      toast.success("¡Solicitud recibida! Te enviaremos el link de pago por email/WhatsApp.");
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar solicitud"
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                {product.badge || "Checkout Seguro"}
              </span>
            </div>

            <h3 id="checkout-title" className="text-2xl font-black tracking-tight mb-1">{product.name}</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold font-mono text-primary">{priceFor(product, getRegion()).main}</span>
              {priceFor(product, getRegion()).secondary && (
                <span className="text-xs text-muted-foreground">({priceFor(product, getRegion()).secondary})</span>
              )}
              <span className="text-xs font-mono text-muted-foreground">· {product.period}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Completa tus datos para confirmar compatibilidad y recibir los pasos de implementación.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="checkout-name" className="block text-xs font-mono text-muted-foreground mb-1">
                  Nombre completo o Razón Social *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={"Ej: María González"}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            {/* Último punto de duda antes de pagar: repetir la garantía acá
                cuesta cuatro líneas y quita la objeción más cara. */}
            <RiskReversal className="mt-4" />

              <div>
                <label htmlFor="checkout-email" className="block text-xs font-mono text-muted-foreground mb-1">
                  Correo electrónico (para envío de entrega y boleta) *
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@empresa.cl"
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-xs font-mono text-muted-foreground mb-1">
                  WhatsApp / Teléfono (opcional para soporte)
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Selección de Método de Pago */}
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2">
                  Medio de pago preferido
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "mercadopago", label: "Mercado Pago / Webpay (CLP)" },
                    { id: "stripe", label: "Stripe / Tarjeta Int. (USD)" },
                    { id: "transferencia", label: "Transferencia Banco (Chile)" },
                    { id: "usdt", label: "USDT / Crypto" },
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-background text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Solicitar implementación
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" />
                Datos protegidos con SSL
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                Boleta/Factura SII incluida
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black">{"¡Solicitud de Compra Recibida!"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {`Gracias ${name}. Hemos generado la orden para "${product.name}". Te enviamos los detalles de pago y entrega a ${email} y por WhatsApp.`}
            </p>
            <Button onClick={onClose} className="w-full h-11 bg-secondary text-foreground hover:bg-secondary/80 font-bold rounded-xl mt-4">
              Cerrar ventana
            </Button>
          </div>
        )}
      </div>
      <TurnstileGate />
    </div>
  );
}
