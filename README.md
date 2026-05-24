# Maudev

Landing y panel admin para Maudev, construido con React, Vite, Tailwind CSS v4 y Firebase.

## Desarrollo

```bash
npm install
npm run dev
```

## Admin

El único correo autorizado para el panel `/admin` es:

```txt
maudevchile@gmail.com
```

La protección está aplicada en dos capas:

- Frontend: `AdminGuard` bloquea cualquier cuenta distinta.
- Firestore Rules: solo ese email puede leer o modificar colecciones privadas y contenido admin.

Después de cambiar reglas:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Email automático

Las Cloud Functions escuchan nuevos documentos en `leads` y `orders`, y escriben correos en la colección `mail`.

Para enviar esos correos instala/configura la extensión de Firebase **Trigger Email from Firestore** usando:

- Colección: `mail`
- Destinatario admin: `maudevchile@gmail.com`
- SMTP: el proveedor que uses para enviar correos

Deploy de funciones:

```bash
cd functions
npm install
firebase deploy --only functions
```

Por seguridad, la respuesta automática al lead está desactivada por defecto. Para activarla:

```bash
echo SEND_AUTOREPLY=true > functions/.env
firebase deploy --only functions
```

## Producción

```bash
npm run build
firebase deploy --only hosting
```
