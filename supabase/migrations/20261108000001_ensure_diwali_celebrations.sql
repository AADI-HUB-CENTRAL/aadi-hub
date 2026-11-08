-- ============================================================================
-- AADI HUB — Diwali 2026 celebration wall: ensure everything is applied
-- ============================================================================
-- Migration: 20261108000001_ensure_diwali_celebrations
--
-- Safe to run more than once. Use this in the Supabase dashboard SQL editor if
-- visitors' names are not being saved (the table can exist without the insert
-- policy, which makes every anonymous INSERT fail with:
--   "new row violates row-level security policy").
--
-- It creates the table if needed, then (re)creates the anonymous read and
-- insert policies and the required grants. No update or delete access is
-- granted, so stored names can never be changed or removed by visitors.
-- ============================================================================

begin;

create table if not exists public.diwali_celebrations (
  id           uuid        primary key default gen_random_uuid(),
  display_name text        not null,
  created_at   timestamptz not null default now(),
  constraint diwali_celebrations_display_name_check check (
    char_length(btrim(display_name)) between 1 and 48
    and display_name = btrim(display_name)
    and display_name !~ '[[:cntrl:]]'
  )
);

create index if not exists diwali_celebrations_created_at_idx
  on public.diwali_celebrations (created_at desc);

alter table public.diwali_celebrations enable row level security;

drop policy if exists "diwali_celebrations_public_read"
  on public.diwali_celebrations;

create policy "diwali_celebrations_public_read"
  on public.diwali_celebrations
  for select
  to anon, authenticated
  using (true);

drop policy if exists "diwali_celebrations_public_insert"
  on public.diwali_celebrations;

create policy "diwali_celebrations_public_insert"
  on public.diwali_celebrations
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(display_name)) between 1 and 48
    and display_name = btrim(display_name)
    and display_name !~ '[[:cntrl:]]'
  );

revoke all on table public.diwali_celebrations from public;
revoke update, delete, truncate, references, trigger
  on table public.diwali_celebrations from anon, authenticated;
grant select, insert on table public.diwali_celebrations to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'diwali_celebrations'
  ) then
    alter publication supabase_realtime add table public.diwali_celebrations;
  end if;
end
$$;

commit;

notify pgrst, 'reload schema';
