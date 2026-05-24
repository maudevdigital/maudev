// Lista blanca de emails admin. Mantener sincronizado con
// la función is_admin() de supabase/schema.sql
export const ADMIN_EMAILS = [
  'maudevchile@gmail.com',
  'lucasmaulenr@gmail.com',
];

export const ADMIN_EMAIL = ADMIN_EMAILS[0];

export const normalizeEmail = (email = '') => email.trim().toLowerCase();

export const isAdminEmail = (email) => ADMIN_EMAILS.includes(normalizeEmail(email));
