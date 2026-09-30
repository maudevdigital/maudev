import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackAction } from "@/lib/MetaPixelTracker";

// Botón flotante que abre el chat de WhatsApp directo, en escritorio y celular.
// A los pocos segundos de la primera página muestra una burbuja breve que invita
// a escribir; se muestra una vez por sesión y se cierra con la X o al usarla.
// El mensaje del chat dice desde qué página escribe la persona.
const paginas = {
  "/ley-21719": { origen: "la página de la Ley 21.719", invitacion: "¿Dudas con la Ley 21.719? Te respondemos por WhatsApp." },
  "/inteligencia-artificial": { origen: "la página de IA aplicada", invitacion: "¿Tienes un caso para IA? Cuéntanoslo por WhatsApp." },
  "/desarrollo": { origen: "la página de desarrollo", invitacion: "¿Tienes un proyecto en mente? Escríbenos por WhatsApp." },
  "/soporte": { origen: "la página de soporte", invitacion: "¿Tu sitio necesita soporte? Escríbenos por WhatsApp." },
};
const INVITACION = "¿Conversamos tu proyecto? Escríbenos por WhatsApp.";
const CLAVE = "maudev_wa_burbuja";
const ESPERA_MS = 4000;

export default function BotonWhatsApp() {
  const { pathname } = useLocation();
  const [burbuja, setBurbuja] = useState(false);
  const pagina = paginas[pathname];
  const mensaje = `Hola, vengo de maudev.cl y quiero conversar sobre un proyecto.${pagina ? ` Vengo de ${pagina.origen}.` : ""}`;
  const url = getWhatsAppUrl(mensaje);

  useEffect(() => {
    let vista = false;
    try { vista = sessionStorage.getItem(CLAVE) === "1"; } catch { /* sin almacenamiento, se muestra igual */ }
    if (vista) return undefined;
    const t = setTimeout(() => setBurbuja(true), ESPERA_MS);
    return () => clearTimeout(t);
  }, []);

  const cerrar = () => {
    setBurbuja(false);
    try { sessionStorage.setItem(CLAVE, "1"); } catch { /* la burbuja solo vuelve en otra sesión */ }
  };
  const abrir = (desde) => {
    cerrar();
    trackAction("whatsapp_click", { ubicacion: desde, pagina: pathname });
  };

  return (
    <div className="whatsapp-flotante">
      {burbuja && (
        <div className="whatsapp-burbuja" role="status">
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => abrir("burbuja-flotante")} className="font-semibold text-foreground">
            {pagina?.invitacion ?? INVITACION}
          </a>
          <button type="button" onClick={cerrar} aria-label="Cerrar mensaje" className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        title="Escribir por WhatsApp"
        onClick={() => abrir("boton-flotante")}
        className="boton-whatsapp"
      >
        {/* Glifo oficial de WhatsApp: se reconoce sin leer. */}
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M16.004 3C8.826 3 3 8.826 3 16c0 2.296.6 4.535 1.74 6.51L3 29l6.66-1.715A12.96 12.96 0 0 0 16.004 29C23.18 29 29 23.174 29 16S23.18 3 16.004 3Zm0 23.64a10.6 10.6 0 0 1-5.41-1.48l-.388-.23-3.953 1.017 1.056-3.853-.253-.397A10.6 10.6 0 0 1 5.36 16c0-5.87 4.775-10.644 10.644-10.644S26.64 10.13 26.64 16s-4.768 10.64-10.636 10.64Zm5.834-7.97c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.186.213-.373.24-.693.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.593-1.895-1.78-2.215-.186-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.186.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.735-.986-2.375-.26-.624-.524-.54-.72-.55l-.613-.01a1.18 1.18 0 0 0-.853.4c-.293.32-1.12 1.094-1.12 2.668 0 1.574 1.146 3.095 1.306 3.308.16.213 2.256 3.444 5.466 4.83.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.89-.772 2.157-1.518.266-.746.266-1.386.186-1.518-.08-.133-.293-.213-.613-.373Z" />
        </svg>
      </a>
    </div>
  );
}
