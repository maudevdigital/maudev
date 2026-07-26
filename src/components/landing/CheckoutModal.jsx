import { useState } from "react";
import { X, CheckCircle, CreditCard, ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadSubmit } from "@/lib/useLeadSubmit";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { defaultPaymentMethod, priceFor, getRegion } from "@/lib/region";

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
      toast.error(t("Por favor completa nombre y correo", "Please enter your name and email"));
      return;
    }

    // Guarda la intención de compra como lead (→ webhook n8n). El toast/redirección
    // los maneja este componente (successMessage: null suprime el toast por defecto).
    const ok = await submit({
      lead: {
        nombre: name,
        email: email,
        telefono: phone,
        servicio: `Compra n8n: ${product.name}`,
        mensaje: `Intención de compra: ${product.name} - Método: ${paymentMethod}`,
        creado_en: new Date().toISOString(),
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
      toast.success(t("Redirigiendo a la pasarela de pago...", "Redirecting to payment gateway..."));
      setTimeout(() => {
        window.location.href = checkoutLink;
      }, 1200);
    } else {
      toast.success(t("¡Solicitud recibida! Te enviaremos el link de pago por email/WhatsApp.", "Request received! We'll send your payment link via email/WhatsApp."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                {product.badge || t("Checkout Seguro", "Secure Checkout")}
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight mb-1">{product.name}</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold font-mono text-primary">{priceFor(product, getRegion()).main}</span>
              {priceFor(product, getRegion()).secondary && (
                <span className="text-xs text-muted-foreground">({priceFor(product, getRegion()).secondary})</span>
              )}
              <span className="text-xs font-mono text-muted-foreground">· {product.period}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              {t(
                "Completa tus datos de facturación para recibir tu paquete de automatización n8n y tu boleta/factura electrónica SII.",
                "Enter your billing details to receive your n8n automation package and your SII electronic tax receipt."
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  {t("Nombre completo o Razón Social *", "Full name or Business Name *")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("Ej: María González", "E.g. Maria Gonzalez")}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  {t("Correo electrónico (para envío de entrega y boleta) *", "Email address (for delivery and receipt) *")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@empresa.cl"
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  {t("WhatsApp / Teléfono (opcional para soporte)", "WhatsApp / Phone (optional for support)")}
                </label>
                <input
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
                  {t("Medio de pago preferido", "Preferred payment method")}
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
                    {t("Procesando...", "Processing...")}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    {t("Continuar al Pago Seguro", "Proceed to Secure Payment")}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" />
                {t("Pago encriptado SSL", "SSL encrypted payment")}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {t("Boleta/Factura SII incluida", "SII Tax Receipt included")}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black">{t("¡Solicitud de Compra Recibida!", "Purchase Request Received!")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {t(
                `Gracias ${name}. Hemos generado la orden para "${product.name}". Te enviamos los detalles de pago y entrega a ${email} y por WhatsApp.`,
                `Thank you ${name}. We generated your order for "${product.name}". Payment & delivery details were sent to ${email} and via WhatsApp.`
              )}
            </p>
            <Button onClick={onClose} className="w-full h-11 bg-secondary text-foreground hover:bg-secondary/80 font-bold rounded-xl mt-4">
              {t("Cerrar ventana", "Close window")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
