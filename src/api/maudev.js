// Cliente API de Maudev sobre Supabase.
// Expone entities (Lead, BlogPost) con métodos list/filter/get/create/update/delete + auth.

import { supabase } from '@/lib/supabase';
import { ADMIN_EMAILS, isAdminEmail } from '@/lib/auth';

const toRow = (row) => row;

const parseSort = (sortStr) => {
  if (!sortStr) return null;
  const desc = sortStr.startsWith('-');
  return { column: desc ? sortStr.slice(1) : sortStr, ascending: !desc };
};

const buildQuery = (table, whereObj, sortStr, lim) => {
  let q = supabase.from(table).select('*');
  if (whereObj) {
    for (const [k, v] of Object.entries(whereObj)) q = q.eq(k, v);
  }
  const sort = parseSort(sortStr);
  if (sort) q = q.order(sort.column, { ascending: sort.ascending });
  if (lim) q = q.limit(lim);
  return q;
};

const makeEntity = (table) => ({
  list: async (sortStr, lim) => {
    const { data, error } = await buildQuery(table, null, sortStr, lim);
    if (error) throw error;
    return (data || []).map(toRow);
  },
  filter: async (whereObj, sortStr, lim) => {
    const { data, error } = await buildQuery(table, whereObj, sortStr, lim);
    if (error) throw error;
    return (data || []).map(toRow);
  },
  get: async (id) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return toRow(data);
  },
  create: async (payload) => {
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) throw error;
    return toRow(data);
  },
  update: async (id, payload) => {
    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
    if (error) throw error;
    return toRow(data);
  },
  delete: async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return { id };
  },
});

const authApi = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar_url: user.user_metadata?.avatar_url,
      role: isAdminEmail(user.email) ? 'admin' : 'user',
    };
  },
  redirectToLogin: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (error) throw error;
  },
  logout: async (redirectUrl) => {
    await supabase.auth.signOut();
    if (redirectUrl) window.location.href = redirectUrl;
  },
};

const integrations = {
  Core: {
    // Storage Supabase: bucket 'uploads' debe existir y permitir insert al admin.
    UploadFile: async ({ file }) => {
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      return { file_url: data.publicUrl };
    },
  },
};

export const api = {
  auth: authApi,
  entities: {
    BlogPost: makeEntity('blog_posts'),
    Lead: makeEntity('leads'),
    Project: makeEntity('projects'),
  },
  integrations,
  _supabase: supabase,
  _adminEmails: ADMIN_EMAILS,
};
