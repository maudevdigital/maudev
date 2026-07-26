# Pagos — Flow (Chile) + Lemon Squeezy (internacional)

Cómo el sitio decide qué precio y qué medio de pago mostrarle a cada visitante.

---

## Lo que ya está funcionando

`src/lib/region.js` detecta la región y `RegionToggle` permite cambiarla a mano.
El precio y el medio de pago por defecto se ajustan solos en:

- La grilla de automatizaciones del home
- Cada landing `/automatizaciones/:slug`
- Los productos n8n de `/precios`
- El `CheckoutModal`

| Región detectada | Precio que se muestra | Medio de pago por defecto |
|---|---|---|
| Chile | CLP | Transferencia (→ Flow cuando exista) |
| Resto del mundo | USD | Lemon Squeezy |

---

## Cómo se detecta, y por qué así

**Zona horaria del navegador**, no geolocalización por IP.

```js
Intl.DateTimeFormat().resolvedOptions().timeZone === "America/Santiago"
```

Razones, en orden de importancia:

1. **Privacidad.** Un servicio de geo-IP obliga a mandar la IP del visitante a un
   tercero *antes* de que acepte cookies. Bajo la Ley 21.719 eso es tratamiento
   de dato personal sin base de licitud, habría que declararlo en la política y
   firmar un acuerdo de tratamiento. Todo para adivinar un país.
2. **Es más confiable.** Una VPN cambia la IP; no cambia la zona horaria del
   sistema operativo.
3. **Cero latencia.** No hay llamada de red: el precio correcto se pinta en el
   primer render, sin parpadeo.

Respaldo: si la zona horaria no dice nada, se mira `navigator.language` buscando
`es-CL`. Si todo falla, asume Chile — equivocarse hacia el mercado local cuesta
menos que mandar a un chileno a pagar en dólares.

### La regla que importa

**La detección elige el default, nunca encierra al usuario.** Siempre hay un
toggle visible. Un chileno de viaje, alguien con tarjeta extranjera o una empresa
que factura afuera tienen que poder elegir. Adivinar mal *y además* bloquear es
una venta perdida.

---

## Por qué Chile no arranca en Lemon Squeezy

Lemon Squeezy soporta Chile y muestra precios en CLP, pero
[procesa todo en USD](https://docs.lemonsqueezy.com/help/payments/currencies):

> *Although we display your products in one of the many currencies we offer,
> ultimately we charge your customers the equivalent cost in USD.*

Para una PyME chilena eso significa:

- Cargo internacional en dólares, con comisión del banco (1–3%)
- Aparece como `LEMSQZY*` en la cartola, no como Maudev
- Sin Webpay, sin transferencia, sin cuotas
- Muchas tarjetas de débito chilenas bloquean compras internacionales por defecto

Para un dev en Alemania comprando un workflow de USD 49, nada de eso importa.
Para el dueño de una barbería en Quilpué, es un muro.

---

## Pendiente: activar los dos checkouts

### 1 · Lemon Squeezy (rápido — es solo pegar URLs)

1. Crear cuenta y tienda en Lemon Squeezy
2. Subir los 3 productos de `src/data/n8nProducts.js`
3. Copiar cada link de checkout a su `checkoutUrlUSD`
4. Verificar la identidad y configurar el payout (banco chileno o PayPal)

Los payouts llegan **siempre en USD**; se puede pedir la conversión a CLP a tasa
mid-market en el depósito.

### 2 · Flow (más trabajo — necesita servidor)

Acá está la asimetría que conviene saber antes de empezar: **Lemon Squeezy es una
URL, Flow es una integración.** Flow exige firmar cada petición con una API key y
un secret, lo que significa código de servidor — el secret no puede ir en el
frontend. Concretamente:

- Cuenta Flow con RUT y datos bancarios
- Un **Cloudflare Worker** que reciba el producto, firme la orden contra la API
  de Flow y devuelva la URL de pago
- Un webhook de confirmación que marque la orden como pagada

Es una tarde de trabajo, no cinco minutos. Mientras tanto, transferencia +
WhatsApp funciona: es como ya vendes hoy.

Cuando Flow esté listo, cambiar **una línea** en `src/lib/region.js`:

```js
export function defaultPaymentMethod(region = getRegion()) {
  return region === CL ? "flow" : "stripe";  // ← "transferencia" pasa a "flow"
}
```

`CheckoutModal` ya sabe redirigir a `checkoutUrlCLP` cuando el método es `flow`.

---

## ⚠️ Consecuencia tributaria que hay que revisar

Al ser **Merchant of Record**, Lemon Squeezy es quien le vende al cliente final,
no tú. Tú le vendes a Lemon Squeezy, una empresa estadounidense. Eso convierte
esas operaciones en **exportación de servicios** ante el SII, no en boletas a
consumidor final.

Con Flow es al revés: la venta es tuya y emites boleta o factura normal.

**Esto contradice lo que dice hoy `/terminos` §03**, que promete boleta o factura
del SII por cada pago. Hay que ajustar ese texto según lo que confirme un
contador. No es urgente mientras no haya un checkout activo, pero sí antes de
cobrarle a alguien.
