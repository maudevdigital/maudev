import { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent, setConsent, initConsent, GRANTED, DENIED } from "@/lib/preferencias";

export default function AvisoPrivacidad() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState(false);
  const [preferences, setPreferences] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    initConsent();
    setVisible(getConsent() === null);
    const open = () => {
      setPreferences(getConsent() || { analytics: false, marketing: false });
      setOptions(true);
      setVisible(true);
    };
    const sync = () => {
      setPreferences(getConsent() || { analytics: false, marketing: false });
      setVisible(getConsent() === null);
    };
    window.addEventListener("maudev:open-cookies", open);
    window.addEventListener(CONSENT_EVENT, sync);
    return () => {
      window.removeEventListener("maudev:open-cookies", open);
      window.removeEventListener(CONSENT_EVENT, sync);
    };
  }, []);

  const decide = value => {
    setConsent(value);
    setOptions(false);
    setVisible(false);
  };
  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Preferencias de cookies" className="cookie-banner print-hidden fixed inset-x-0 bottom-0 z-100 p-3 sm:p-4">
      <div className="panel panel-solid mx-auto max-h-[calc(100dvh-2rem)] max-w-300 overflow-y-auto! p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold">Tú eliges qué compartes</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Con tu permiso, usamos Google Analytics para mejorar el sitio y Meta para medir anuncios.
              Puedes aceptar, rechazar o elegir por separado. <a href="/privacidad" className="text-primary underline underline-offset-2">Privacidad</a> · <a href="/terminos" className="text-primary underline underline-offset-2">Términos</a>.
            </p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={() => decide(GRANTED)} className="btn btn-primary min-h-11 px-4 text-sm">Aceptar todas</button>
            <button type="button" onClick={() => decide(DENIED)} className="btn btn-ghost min-h-11 px-4 text-sm">Rechazar</button>
            <button type="button" onClick={() => {
              setPreferences(getConsent() || { analytics: false, marketing: false });
              setOptions(value => !value);
            }} aria-expanded={options} aria-controls="cookie-opciones" className="btn btn-ghost col-span-2 min-h-11 px-4 text-sm">Configurar</button>
          </div>
        </div>
        {options && (
          <div id="cookie-opciones" className="mt-5 border-t border-border pt-5">
            <p className="text-sm text-muted-foreground">Las preferencias del sitio y las funciones de seguridad permanecen activas. Enviar una consulta no autoriza la medición publicitaria.</p>
            <div className="my-4 grid gap-3 sm:grid-cols-2">
              {[
                { key: "analytics", title: "Analítica", text: "Google Analytics: visitas y uso del sitio." },
                { key: "marketing", title: "Publicidad", text: "Meta Pixel: atribución de anuncios y contactos." },
              ].map(({ key, title, text }) => (
                <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
                  <input type="checkbox" checked={preferences[key]} onChange={event => setPreferences(current => ({ ...current, [key]: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-primary" />
                  <span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-sm text-muted-foreground">{text}</span></span>
                </label>
              ))}
            </div>
            <button type="button" onClick={() => decide(preferences)} className="btn btn-primary min-h-11 w-full px-5 text-sm sm:w-auto">Guardar preferencias</button>
            <p className="mt-3 text-xs text-muted-foreground">Puedes cambiar tu elección desde «Cookies» en el pie de página.</p>
          </div>
        )}
      </div>
    </div>
  );
}
