# notify-lead — aviso por correo de nuevos leads (vía Resend)

Esta función envía un correo (vía [Resend](https://resend.com)) **cada vez que
entra un lead o suscripción**. Se dispara desde un *Database Webhook* sobre
`INSERT` en la tabla `public.leads`, así que captura **todos los orígenes** del
sitio (contacto, cotizador, diagnóstico, lead capture, etc.) sin tocar el
frontend. El lead se sigue guardando en la base de datos como siempre; esto solo
agrega el aviso.

```
Formulario → insert en public.leads → Webhook → notify-lead → correo (Resend)
```

## 1. Cuenta y dominio en Resend

1. Crea cuenta en https://resend.com y genera una **API Key** (empieza con `re_`).
2. Para enviar desde `@maudev.cl`: **Domains → Add Domain → `maudev.cl`** y agrega
   los registros DNS que indica Resend (SPF/DKIM). Cuando quede **Verified**,
   podrás usar `RESEND_FROM="Maudev Leads <leads@maudev.cl>"`.
   - Mientras no verifiques el dominio, Resend solo permite enviar **desde**
     `onboarding@resend.dev` y **hacia** el correo con el que te registraste.

## 2. Configurar e instalar la función

Config ya lista en el repo (`supabase/config.toml`, `verify_jwt=false`) y la
migración del webhook en `supabase/migrations/…_notify_lead_webhook.sql`.

```bash
export SUPABASE_ACCESS_TOKEN="sbp_xxx..."   # token personal, o: supabase login
REF=hsaoeuuyxrzxlvcvkiab

supabase secrets set --project-ref $REF \
  RESEND_API_KEY="re_xxxxxxxx" \
  RESEND_FROM="Maudev Leads <leads@maudev.cl>" \
  NOTIFY_TO="contacto@maudev.cl" \
  WEBHOOK_SECRET="d17e218a271824ae8cc41b362f37dfca6bd80ee49145b4a2"

supabase functions deploy notify-lead --project-ref $REF
```

> Tras cambiar secretos, **vuelve a desplegar** para que la instancia los tome.

## 3. Webhook (trigger)

La migración `supabase/migrations/…_notify_lead_webhook.sql` ya tiene el trigger
con la URL y el secreto correctos. Aplícala una vez (SQL Editor o `supabase db push`).
Ya quedó instalada en este proyecto.

## 4. Probar

```sql
insert into public.leads (name, email, message, source)
values ('Prueba', 'cliente@ejemplo.com', 'Hola, prueba', 'test');
```

Debería llegarte el correo a `NOTIFY_TO` en segundos. Logs en
**Supabase → Edge Functions → notify-lead → Logs**, y entregas en
**Resend → Emails**.
