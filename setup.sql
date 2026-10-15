-- Run in Supabase SQL Editor. This adds the settings table used by admin.html.
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
insert into public.site_settings(key,value) values
('hero_title_ar','الرياضيات مش صعبة… لما تفهمها صح.'),
('hero_subtitle_ar','مع مستر مينا دياب، هنفهم الفكرة خطوة بخطوة.')
on conflict (key) do nothing;
