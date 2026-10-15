-- شغّل هذا الملف في Supabase > SQL Editor بعد مراجعة الجداول الموجودة.
-- يفترض أن public.profiles و public.courses موجودان بالفعل من الإعداد السابق.
create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

-- يسمح للزائر بقراءة إعدادات الصفحة الرئيسية فقط.
drop policy if exists "Public can read homepage settings" on public.site_settings;
create policy "Public can read homepage settings"
on public.site_settings for select using (key in ('hero_title_ar','hero_subtitle_ar'));

-- الإدارة فقط يمكنها تغيير الإعدادات.
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings for all
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

grant select, insert, update, delete on public.site_settings to anon, authenticated;

insert into public.site_settings(key,value) values
('hero_title_ar','الرياضيات مش صعبة… لما تفهمها صح.'),
('hero_subtitle_ar','مع مستر مينا دياب، هنفهم الفكرة خطوة بخطوة، ونحل بثقة.')
on conflict (key) do nothing;

-- ملاحظة: لا تنشئ صلاحية admin من واجهة المتصفح. بعد إنشاء حساب المدير
-- حدّد UUID الخاص به من Authentication > Users، ثم نفّذ أمر UPDATE منفصلًا
-- في SQL Editor بعد التحقق من الحساب:
-- update public.profiles set role = 'admin' where id = 'AUTH_USER_UUID_HERE';
-- هذا يتطلب وجود صف profiles للحساب. لا تنفّذ الأمر قبل استبدال UUID.
