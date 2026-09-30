// Borrado de lo que cumplió el plazo de conservación que promete /privacidad:
// contactos a los 12 meses, solicitudes de derechos y registros de
// consentimiento a los 24. Mismo criterio que workers/lead-intake/worker.js.
//
// No hay cron (la cuenta gratuita tiene los 5 ocupados): se llama en segundo
// plano al abrir el tablero del panel admin, además de con cada envío que
// recibe lead-intake.
export async function borrarVencidos(db: D1Database) {
  await db.batch([
    db.prepare("DELETE FROM leads WHERE created_at < datetime('now', '-12 months')"),
    db.prepare("DELETE FROM solicitudes_derechos WHERE creado_en < datetime('now', '-24 months')"),
    db.prepare("DELETE FROM consentimientos WHERE creado_en < datetime('now', '-24 months')"),
  ]);
}
