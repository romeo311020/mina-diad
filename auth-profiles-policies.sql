-- نفّذ هذا الجزء بعد مراجعة السياسات الحالية في Supabase.
-- لا يحذف السياسات القديمة؛ ينشئ السياسات المطلوبة إن لم تكن موجودة.
alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "Student can read own profile" on public.profiles;
create policy "Student can read own profile" on public.profiles
for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Student can insert own profile" on public.profiles;
create policy "Student can insert own profile" on public.profiles
for insert to authenticated with check ((select auth.uid()) = id and role = 'student');

drop policy if exists "Student can update own profile" on public.profiles;
create policy "Student can update own profile" on public.profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and role = 'student');

-- لا تضف سياسة عامة تسمح للطلاب بقراءة كل profiles.
-- صلاحية admin تُمنح يدويًا من SQL Editor بعد التحقق من UUID.
