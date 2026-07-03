import { useState, useEffect } from "react";
import { api } from "@/api/maudev";
import { Radar, Search, Loader2, Globe, MessageCircle, UserPlus, Check, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

// Prospección de clientes: busca negocios reales por rubro y comuna usando
// OpenStreetMap (Nominatim + Overpass, gratis y sin API key). Los negocios SIN
// sitio web son los prospectos ideales para vender web/automatización.
// Flujo: buscar → filtrar "sin web" → WhatsApp con plantilla → guardar como lead.

const RUBROS = [
  { value: "restaurant", label: "Restaurantes y cafés", filter: '["amenity"~"restaurant|cafe|fast_food"]' },
  { value: "beauty", label: "Peluquerías y estética", filter: '["shop"~"hairdresser|beauty"]' },
  { value: "dental", label: "Dentistas y clínicas", filter: '["amenity"~"dentist|clinic|doctors"]' },
  { value: "gym", label: "Gimnasios", filter: '["leisure"="fitness_centre"]' },
  { value: "estate", label: "Corredores de propiedades", filter: '["office"="estate_agent"]' },
  { value: "lawyer", label: "Abogados y contadores", filter: '["office"~"lawyer|accountant"]' },
  { value: "car", label: "Talleres mecánicos", filter: '["shop"~"car_repair|tyres"]' },
  { value: "vet", label: "Veterinarias", filter: '["amenity"="veterinary"]' },
  { value: "clothes", label: "Tiendas de ropa", filter: '["shop"~"clothes|shoes"]' },
  { value: "hardware", label: "Ferreterías", filter: '["shop"~"hardware|doityourself"]' },
];

const waMsg = (biz, rubroLabel) =>
  `Hola! Les escribo de maudev.cl 👋 Vi que ${biz} aún no tiene sitio web propio y trabajamos con ${rubroLabel.toLowerCase()} ayudándolos a conseguir más clientes online. ¿Les interesaría ver una propuesta sin compromiso?`;

const normPhone = (raw) => {
  let d = (raw || "").replace(/\D/g, "");
  if (d.length === 9 && d.startsWith("9")) d = "56" + d; // celular chileno sin código
  return d.length >= 10 ? d : null;
};

export default function AdminProspeccion() {
  const [comuna, setComuna] = useState("");
  const [rubro, setRubro] = useState(RUBROS[0].value);
  const [onlyNoWeb, setOnlyNoWeb] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // null = sin búsqueda aún
  const [saved, setSaved] = useState(new Set());

  useEffect(() => { document.title = "Prospección · Maudev admin"; }, []);

  const search = async () => {
    if (!comuna.trim()) { toast.error("Escribe una comuna (ej: Providencia)."); return; }
    setLoading(true); setResults(null);
    try {
      // 1) Nominatim: comuna → área OSM. OJO: q= es texto libre y NO se puede
      // combinar con parámetros estructurados (country=) — eso devolvía 400.
      const nom = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&accept-language=es&q=${encodeURIComponent(comuna.trim().replace(/,?\s*chile$/i, "") + ", Chile")}`,
      ).then((r) => r.json());
      const place = (nom || []).find((p) => p.osm_type === "relation") || nom?.[0];
      if (!place?.osm_id) throw new Error(`No encontré "${comuna}" en Chile. Prueba solo el nombre de la comuna.`);

      // 2) Overpass: negocios del rubro. Si la comuna tiene polígono (relation)
      // buscamos dentro del área; si no, en un radio de 6 km desde su centro.
      const f = RUBROS.find((r) => r.value === rubro)?.filter;
      let zone;
      if (place.osm_type === "relation") {
        zone = `area(${3600000000 + Number(place.osm_id)})->.a;(node${f}(area.a);way${f}(area.a););`;
      } else {
        zone = `(node${f}(around:6000,${place.lat},${place.lon});way${f}(around:6000,${place.lat},${place.lon}););`;
      }
      const q = `[out:json][timeout:30];${zone}out center tags 80;`;
      const ov = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(q),
      }).then((r) => r.json());

      const seen = new Set();
      const list = (ov.elements || [])
        .map((e) => {
          const t = e.tags || {};
          const name = t.name;
          if (!name || seen.has(name)) return null;
          seen.add(name);
          return {
            id: `${e.type}/${e.id}`,
            name,
            phone: t.phone || t["contact:phone"] || t.mobile || null,
            website: t.website || t["contact:website"] || t["contact:instagram"] || null,
            address: [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(" ") || null,
          };
        })
        .filter(Boolean)
        .sort((a, b) => (a.website ? 1 : 0) - (b.website ? 1 : 0)); // sin web primero
      setResults(list);
      if (!list.length) toast.info("Sin resultados para ese rubro/comuna. Prueba otra combinación.");
    } catch (e) {
      toast.error(e.message || "Error buscando. Intenta de nuevo en unos segundos.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const saveLead = async (b) => {
    const rubroLabel = RUBROS.find((r) => r.value === rubro)?.label || rubro;
    try {
      await api.entities.Lead.create({
        name: b.name,
        email: "",
        whatsapp: b.phone || "",
        interest: "web_dev",
        message: `PROSPECTO (${rubroLabel} · ${comuna.trim()}). ${b.website ? "Web: " + b.website : "SIN sitio web"}. ${b.address ? "Dirección: " + b.address : ""}`,
        source: "prospeccion",
        status: "new",
        consent: false,
      });
      setSaved((s) => new Set(s).add(b.id));
      // Seguimiento automático: en prospección fría la venta está en el 2° toque.
      fetch("https://ig-autopost.maudevchile.workers.dev/remind", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: b.name,
          note: `Prospecto ${rubroLabel} · ${comuna.trim()} — ¿respondió el 1er WhatsApp?`,
          whatsapp: b.phone || "",
          days: 3,
        }),
      }).catch(() => {});
      toast.success(`${b.name} guardado en Leads · seguimiento agendado en 3 días ⏰`);
    } catch (e) {
      toast.error("No se pudo guardar: " + (e.message || "error"));
    }
  };

  const rubroLabel = RUBROS.find((r) => r.value === rubro)?.label || "";
  const shown = (results || []).filter((b) => !onlyNoWeb || !b.website);
  const noWebCount = (results || []).filter((b) => !b.website).length;

  const input = "h-10 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary/50";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
          <Radar className="h-6 w-6 text-primary" /> Prospección
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Busca negocios por rubro y comuna (datos públicos de OpenStreetMap). Los que <strong className="text-foreground">no tienen sitio web</strong> son tus mejores prospectos.
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-40">
            <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Comuna</label>
            <input className={`${input} w-full`} value={comuna} onChange={(e) => setComuna(e.target.value)}
              placeholder="Providencia, Concepción, Viña del Mar…" onKeyDown={(e) => e.key === "Enter" && search()} />
          </div>
          <div className="flex-1 min-w-44">
            <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Rubro</label>
            <select className={`${input} w-full`} value={rubro} onChange={(e) => setRubro(e.target.value)}>
              {RUBROS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <button onClick={search} disabled={loading}
            className="h-10 inline-flex items-center gap-2 px-5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Buscar
          </button>
        </div>
        {results !== null && (
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/40 text-sm">
            <span className="text-muted-foreground">{results.length} negocios · <strong className="text-primary">{noWebCount} sin web</strong></span>
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={onlyNoWeb} onChange={(e) => setOnlyNoWeb(e.target.checked)} className="accent-[#0e7d88]" />
              Mostrar solo sin sitio web
            </label>
          </div>
        )}
      </div>

      {/* Resultados */}
      {results !== null && (
        <div className="space-y-2.5">
          {shown.map((b) => {
            const wa = normPhone(b.phone);
            return (
              <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm">{b.name}</p>
                    {b.website ? (
                      <a href={b.website.startsWith("http") ? b.website : `https://${b.website}`} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary border border-border text-muted-foreground inline-flex items-center gap-1">
                        <Globe className="h-3 w-3" /> con web
                      </a>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-bold">SIN WEB 🎯</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                    {b.address && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{b.address}</span>}
                    {b.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{b.phone}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {wa && (
                    <a href={`https://wa.me/${wa}?text=${encodeURIComponent(waMsg(b.name, rubroLabel))}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-semibold hover:bg-[#25D366]/20">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  )}
                  <button onClick={() => saveLead(b)} disabled={saved.has(b.id)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-secondary border border-border font-semibold hover:border-primary/40 disabled:opacity-60">
                    {saved.has(b.id) ? <><Check className="h-3.5 w-3.5 text-green-500" /> Guardado</> : <><UserPlus className="h-3.5 w-3.5" /> Guardar lead</>}
                  </button>
                </div>
              </div>
            );
          })}
          {shown.length === 0 && (
            <p className="text-sm text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
              Nada que mostrar con este filtro.
            </p>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground/60 mt-6">
        Fuente: OpenStreetMap (datos públicos aportados por la comunidad; cobertura variable según comuna).
        Que un negocio no aparezca con web aquí no garantiza que no la tenga: verifica antes de contactar.
      </p>
    </div>
  );
}
