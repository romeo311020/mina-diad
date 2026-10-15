-- Review existing RLS policies before running. Do not disable RLS.
alter table public.profiles enable row level security;
-- Students can read their own profile.
drop policy if exists "Students can read own profile" on public.profiles;
create policy "Students can read own profile" on public.profiles for select to authenticated using (id = auth.uid());
-- Students can create/update only their own student profile. Admin access should remain governed by existing admin policies.
drop policy if exists "Students can insert own student profile" on public.profiles;
create policy "Students can insert own student profile" on public.profiles for insert to authenticated with check (id = auth.uid() and role = 'student');
drop policy if exists "Students can update own student profile" on public.profiles;
create policy "Students can update own student profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = 'student');
-- NOTE: PostgreSQL permissive policies are OR-combined. Review other existing policies so they do not allow users to change their own role.
