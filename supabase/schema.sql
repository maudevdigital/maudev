-- ============================================================
-- Maudev · esquema Supabase
-- Ejecutar en: SQL Editor → New query
-- ============================================================

-- Helper: lista de emails admin (edita aquí cuando cambies admins)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      'contacto@maudev.cl',
      'maudevchile@gmail.com',
      'lucasmaulenr@gmail.com'
    ),
    false
  );
$$;

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  email        text not null,
  whatsapp     text,
  interest     text,
  message      text,
  source       text,
  status       text default 'new',
  consent      boolean default true,
  page_path    text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.leads enable row level security;

drop policy if exists "leads insert anyone" on public.leads;
create policy "leads insert anyone"
  on public.leads for insert
  with check (true);

drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read"
  on public.leads for select
  using (public.is_admin());

drop policy if exists "leads admin update" on public.leads;
create policy "leads admin update"
  on public.leads for update
  using (public.is_admin());

drop policy if exists "leads admin delete" on public.leads;
create policy "leads admin delete"
  on public.leads for delete
  using (public.is_admin());

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content       text,
  cover_url     text,
  tags          text[] default '{}',
  status        text default 'draft',  -- draft | published
  published_at  timestamptz,
  created_date  timestamptz default now(),
  updated_date  timestamptz default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "blog read published" on public.blog_posts;
create policy "blog read published"
  on public.blog_posts for select
  using (status = 'published' or public.is_admin());

drop policy if exists "blog admin write" on public.blog_posts;
create policy "blog admin write"
  on public.blog_posts for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- updated_date auto
-- ============================================================
create or replace function public.set_updated_date()
returns trigger language plpgsql as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated on public.leads;
create trigger trg_leads_updated before update on public.leads
  for each row execute procedure public.set_updated_date();

drop trigger if exists trg_blog_updated on public.blog_posts;
create trigger trg_blog_updated before update on public.blog_posts
  for each row execute procedure public.set_updated_date();

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  tagline      text,
  description  text,
  stack        text[] default '{}',
  industry     text,
  role         text,
  image_url    text,
  project_url  text,
  featured     boolean default false,
  status       text default 'published',  -- draft | published
  sort_order   int default 0,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects public read" on public.projects;
create policy "projects public read"
  on public.projects for select
  using (status = 'published' or public.is_admin());

drop policy if exists "projects admin write" on public.projects;
create policy "projects admin write"
  on public.projects for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute procedure public.set_updated_date();
