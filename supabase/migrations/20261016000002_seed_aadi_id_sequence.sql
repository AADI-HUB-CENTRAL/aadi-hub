-- ============================================================================
-- AADI HUB — Fix 2: seed the AADI ID counter row (id = 1)
-- ============================================================================
-- Migration: 20261016000002_seed_aadi_id_sequence
--
-- PROBLEM THIS FIXES
--   The initial migration creates `public.aadi_id_sequences` with
--   `last_num integer not null default 80000` but never inserts the single
--   required row (`id = 1`). `public.allocate_aadi_id_num()` performs
--
--       update public.aadi_id_sequences set last_num = last_num + 1 where id = 1;
--
--   which affects zero rows, then raises:
--
--       P0001  aadi_id_sequences row id=1 is missing
--
--   Because `handle_new_user()` runs AFTER INSERT on auth.users, that raise
--   aborts the whole auth.users INSERT. The visible symptom is:
--     * signup returns HTTP 500 "aadi_id_sequences row id=1 is missing"
--     * no auth user is created, so no verification email is ever sent
--     * any previously verified account whose profile row was never created
--       hits the "your AADI profile does not exist" wall.
--
--   This is a DATA defect, not a table defect: the table exists, RLS on it is
--   correct, the allocator function is correct. Only the seed row is missing.
--
-- SAFETY
--   * Idempotent: `on conflict (id) do nothing` leaves an existing counter
--     untouched, so re-running can never reset or skip an AADI ID.
--   * No reset, no drop, no data deletion.
--   * Does not weaken RLS and does not touch any other table.
--   * The counter is seeded at 80000 so the first real ID is AADI-80001,
--     exactly as documented in docs/supabase-architecture.md.
-- ============================================================================

begin;

insert into public.aadi_id_sequences (id, last_num)
values (1, 80000)
on conflict (id) do nothing;

commit;

-- ----------------------------------------------------------------------------
-- VERIFY (run after applying):
--
--   select id, last_num from public.aadi_id_sequences;
--   -- expected: exactly one row:  1 | 80000
--
-- Then, if any auth users exist whose profile row was never created, run
-- 20261016000003_profile_recovery.sql to backfill their profiles.
-- ----------------------------------------------------------------------------
