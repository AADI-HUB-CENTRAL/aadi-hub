-- ============================================================================
-- AADI HUB — Diwali Festival Edition 2026
-- ============================================================================
-- Migration: 20261107000001_diwali_celebrations
-- Status:   PREPARED, NOT APPLIED. Apply through the Supabase dashboard SQL
--           editor or `supabase db push` before the celebration wall can store
--           visitor names.
--
-- What this file creates
--   public.diwali_celebrations + latest-first index
--   Row Level Security: anonymous read + anonymous insert only
--   No update or delete policies, so those actions stay denied by RLS.
--
-- The frontend inserts a client-generated UUID as `id`. Retries of the same
-- celebration reuse that UUID, so the primary key blocks accidental duplicate
-- rows caused by repeated clicks or network retries.
--
-- ROLLBACK:
--   drop table if exists public.diwali_celebrations;
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

comment on table public.diwali_celebrations is
  'Public Diwali 2026 celebration wall. Anonymous visitors may add one name '
  'and read all names. Updates and deletes are never allowed.';

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

-- No update or delete policies are created. With RLS enabled, both actions
-- are denied for anon and authenticated visitors by default.
revoke all on table public.diwali_celebrations from public;
revoke update, delete, truncate, references, trigger
  on table public.diwali_celebrations from anon, authenticated;
grant select, insert on table public.diwali_celebrations to anon, authenticated;

-- Enable realtime broadcasts for insert events so all connected visitors see
-- new celebrations instantly.
alter publication supabase_realtime add table public.diwali_celebrations;

commit;

-- Ask PostgREST to refresh its schema cache immediately after the table is
-- created through the Supabase SQL editor.
notify pgrst, 'reload schema';
