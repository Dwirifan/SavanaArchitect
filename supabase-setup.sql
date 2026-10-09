-- Run this in Supabase SQL Editor
-- 1. Table for CMS JSON
create table if not exists public.site_settings (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
insert into public.site_settings (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- 2. Enable RLS: public can READ, only service_role can WRITE (via API route)
alter table public.site_settings enable row level security;
drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings for select using (true);
-- NO insert/update/delete policy for anon -> anon cannot write directly
-- API route will use SUPABASE_SERVICE_ROLE_KEY to write

-- 3. Storage bucket for images/videos
insert into storage.buckets (id, name, public) values ('savana', 'savana', true)
on conflict (id) do nothing;

-- Storage policies: public read, authenticated/service_role write (we use service_role via API so no anon write needed)
drop policy if exists "public read savana" on storage.objects;
create policy "public read savana" on storage.objects for select using (bucket_id = 'savana');

drop policy if exists "service_role write savana" on storage.objects;
create policy "service_role write savana" on storage.objects for all using (bucket_id = 'savana') with check (bucket_id = 'savana');
