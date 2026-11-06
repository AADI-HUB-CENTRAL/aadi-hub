-- ============================================================================
-- AADI HUB — Fix 3: idempotent profile recovery
-- ============================================================================
-- Migration: 20261016000003_profile_recovery
--
-- WHAT THIS ADDS
--   1. `public.create_missing_profile()` — a SECURITY DEFINER RPC that lets an
--      authenticated user materialise the ONE profile row that belongs to
--      them, and only if it is genuinely missing. It is the server-side
--      recovery path the frontend calls when a verified session has no profile
--      (e.g. a user who signed up while the counter seed row was missing).
--   2. A hardened `public.handle_new_user()` which is safe even if the counter
--      row is ever missing again, and never fails the auth.users INSERT.
--   3. A one-time backfill for already-verified auth users whose trigger fired
--      before the fix and therefore have no profile row.
--
-- WHY AN RPC IS REQUIRED (and why the client cannot just INSERT)
--   `allocate_aadi_id_num()` is deliberately revoked from `anon` and
--   `authenticated` and granted only to `service_role`/`supabase_admin`. That
--   is the security boundary that stops a client from choosing or racing AADI
--   IDs. Therefore the client cannot use a permissive `profiles_insert_own`
--   policy to mint an ID; ID allocation must stay inside a SECURITY DEFINER
--   function. This RPC grants ordinary users no new privilege: it can only
--   create a row whose `id` is their own `auth.uid()`.
--
-- SECURITY PROPERTIES
--   * Callable only by `authenticated` (revoked from public/anon).
--   * Uses `auth.uid()` internally; it accepts NO arguments, so a caller can
--     never address another user's row.
--   * Returns the caller's existing profile unchanged if one already exists —
--     it can never create a duplicate or a second AADI ID.
--   * Writes exactly one row, owned by the caller, with an ID allocated by the
--     existing secure allocator. It cannot escalate `role`, `aadi_id`, etc.
--   * RLS is not weakened; no policy is added or dropped.
--
-- IDEMPOTENCY
--   * `create_missing_profile()` begins with a lookup and returns early.
--   * The backfill loops over missing users and calls the allocator once each.
--   * Safe to run more than once.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Recovery RPC — materialise the caller's own missing profile
-- ---------------------------------------------------------------------------
-- Mirrors handle_new_user() exactly: same name fallback, same ID format, so a
-- recovered profile is indistinguishable from a trigger-created one.

create or replace function public.create_missing_profile()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid       uuid := auth.uid();
  v_num       integer;
  v_name      text;
  v_aadi_id   text;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  -- Already exists? Return its ID untouched. This is the idempotency guarantee.
  select p.aadi_id into v_aadi_id
    from public.profiles p
   where p.id = v_uid;

  if v_aadi_id is not null then
    return v_aadi_id;
  end if;

  -- Fallback name from the auth record, matching the signup trigger.
  select left(
           coalesce(
             nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
             nullif(trim(split_part(coalesce(u.email, ''), '@', 1)), ''),
             'AADI Member'
           ),
           120
         )
    into v_name
    from auth.users u
   where u.id = v_uid;

  v_name := coalesce(v_name, 'AADI Member');

  -- Allocate the permanent AADI ID through the existing secure mechanism.
  v_num := public.allocate_aadi_id_num();

  v_aadi_id := 'AADI-' || lpad(v_num::text, 5, '0');

  insert into public.profiles (id, aadi_id_num, aadi_id, full_name)
  values (v_uid, v_num, v_aadi_id, v_name);

  return v_aadi_id;
end;
$$;

comment on function public.create_missing_profile() is
  'SECURITY DEFINER. Creates the calling authenticated user''s own profile row '
  'if (and only if) it is missing, allocating a permanent AADI ID through the '
  'revoked allocator, and returns that AADI ID. Idempotent: returns the '
  'existing ID when the profile is already present. Takes no arguments, so it '
  'can never touch another user''s profile.';

revoke execute on function public.create_missing_profile() from public, anon;
grant  execute on function public.create_missing_profile() to authenticated;


-- ---------------------------------------------------------------------------
-- 2. Hardened signup trigger
-- ---------------------------------------------------------------------------
-- Changes vs the original:
--   * Takes `pg_advisory_xact_lock` keyed by the new user id, so a concurrent
--     recovery RPC and the trigger cannot both insert the same profile.
--   * `on conflict (id) do nothing` makes the insert idempotent: a duplicate
--     can never abort the auth.users INSERT.
--   * If the AADI counter row is somehow missing again, it is re-seeded inline
--     instead of raising, so signup degrades gracefully rather than 500ing.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_num  integer;
  v_name text;
begin
  perform pg_advisory_xact_lock(hashtext('aadi_profile:' || new.id::text));

  -- Self-heal the counter if migration 2 has not run (defensive only).
  insert into public.aadi_id_sequences (id, last_num)
  values (1, 80000)
  on conflict (id) do nothing;

  v_num := public.allocate_aadi_id_num();

  v_name := left(
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), ''),
      'AADI Member'
    ),
    120
  );

  insert into public.profiles (id, aadi_id_num, aadi_id, full_name)
  values (new.id, v_num, 'AADI-' || lpad(v_num::text, 5, '0'), v_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'AFTER INSERT on auth.users. Creates the matching profile and allocates the '
  'permanent AADI ID. Idempotent (on conflict do nothing) and self-healing if '
  'the ID counter row is missing, so a profile problem can never abort signup.';


-- ---------------------------------------------------------------------------
-- 3. One-time backfill for already-verified users with no profile
-- ---------------------------------------------------------------------------
-- Repairs accounts created while the trigger was failing. Ordered by creation
-- time so recovered IDs (which start at AADI-80001) follow signup order.

do $$
declare
  r       record;
  v_num   integer;
  v_name  text;
begin
  for r in
    select u.id, u.email, u.raw_user_meta_data, u.created_at
      from auth.users u
      left join public.profiles p on p.id = u.id
     where p.id is null
     order by u.created_at
  loop
    insert into public.aadi_id_sequences (id, last_num)
    values (1, 80000)
    on conflict (id) do nothing;

    v_num := public.allocate_aadi_id_num();

    v_name := left(
      coalesce(
        nullif(trim(r.raw_user_meta_data ->> 'full_name'), ''),
        nullif(trim(split_part(coalesce(r.email, ''), '@', 1)), ''),
        'AADI Member'
      ),
      120
    );

    insert into public.profiles (id, aadi_id_num, aadi_id, full_name)
    values (r.id, v_num, 'AADI-' || lpad(v_num::text, 5, '0'), v_name)
    on conflict (id) do nothing;
  end loop;
end;
$$;

commit;

-- ----------------------------------------------------------------------------
-- VERIFY (run after applying):
--
--   -- No auth user should remain without a profile:
--   select count(*) as orphaned
--     from auth.users u
--     left join public.profiles p on p.id = u.id
--    where p.id is null;
--   -- expected: 0
--
--   -- Every allocated ID is unique and >= AADI-80001:
--   select count(*) as profiles, min(aadi_id) as lowest, max(aadi_id) as highest
--     from public.profiles;
--
--   -- Recovery RPC is callable but not by anon:
--   select has_function_privilege('authenticated', 'public.create_missing_profile()', 'execute');  -- true
--   select has_function_privilege('anon',          'public.create_missing_profile()', 'execute');  -- false
-- ----------------------------------------------------------------------------
