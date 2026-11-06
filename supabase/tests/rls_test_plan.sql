-- ============================================================================
-- AADI HUB — RLS / SQL verification plan
-- ============================================================================
-- These are MANUAL checks to run against a scratch Supabase project after
-- applying supabase/migrations/20261016000001_init_schema.sql.
--
-- They are intentionally NOT a migration. Do not run them in production.
-- They cannot run locally: there is no Postgres or Docker in the dev sandbox.
--
-- How to use:
--   1. Create a throwaway Supabase project (never the production one).
--   2. Apply the migration.
--   3. Run the queries below in the SQL editor, reading the comments as the
--      expected result. For per-user RLS checks, use `set local role
--      authenticated; set local request.jwt.claims = '{"sub":"<uuid>"}';`
--      inside a transaction, or drive them through the client with two test
--      accounts.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Object presence
-- ---------------------------------------------------------------------------
-- Expect 13.
select count(*) as table_count
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
  and table_name in (
    'aadi_id_sequences','profiles','projects','project_members','communities',
    'community_members','posts','comments','opportunities','challenges',
    'challenge_participants','notifications','reports'
  );

-- Expect 13 rows, all rls_enabled = true.
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
  and relname in (
    'aadi_id_sequences','profiles','projects','project_members','communities',
    'community_members','posts','comments','opportunities','challenges',
    'challenge_participants','notifications','reports'
  )
order by relname;

-- Expect: profile-media bucket, public = true, 5 MB limit.
select id, public, file_size_limit, allowed_mime_types
from storage.buckets where id = 'profile-media';

-- ---------------------------------------------------------------------------
-- 2. AADI ID allocation
-- ---------------------------------------------------------------------------
-- Before any signup the sequence row should read 80000 (first issued = 80001).
select id, last_num from public.aadi_id_sequences;

-- After creating one user, expect a profile whose aadi_id = 'AADI-80001'
-- and aadi_id_num = 80001. Run twice to confirm the counter is atomic and the
-- two profiles get different, sequential IDs.
select aadi_id, aadi_id_num, full_name from public.profiles order by aadi_id_num;

-- ---------------------------------------------------------------------------
-- 3. Profile immutability (as the owning authenticated user)
-- ---------------------------------------------------------------------------
-- Each of these must RAISE an exception:
--   update public.profiles set aadi_id = 'AADI-99999' where id = auth.uid();
--   update public.profiles set aadi_id_num = 1 where id = auth.uid();
--   update public.profiles set role = 'admin' where id = auth.uid();
--   update public.profiles set created_at = now() where id = auth.uid();
-- This one must SUCCEED (editable field):
--   update public.profiles set headline = 'Builder' where id = auth.uid();

-- ---------------------------------------------------------------------------
-- 4. Profile visibility (RLS)
-- ---------------------------------------------------------------------------
-- As an anonymous request (role anon):
--   * is_public = true  -> SELECT returns the row.
--   * is_public = false -> SELECT returns zero rows.
-- As the owner: always returns own row.
-- As a moderator/admin: returns both.
--
--   set local role anon;
--   select aadi_id from public.profiles where aadi_id = 'AADI-80001';

-- ---------------------------------------------------------------------------
-- 5. Ownership rules
-- ---------------------------------------------------------------------------
-- (These should all FAIL / affect 0 rows unless you are the owner or an admin.)
--
--   update public.projects set title = 'x' where owner_id <> auth.uid();
--   delete from public.posts where author_id <> auth.uid();
--   update public.communities set name = 'x' where owner_id <> auth.uid();
--
-- (These should SUCCEED for the owner.)
--
--   update public.projects set title = 'mine' where owner_id = auth.uid();
--
-- Only moderators/admins may insert opportunities/challenges and change a
-- challenge participant to 'winner'. A student attempting this gets 0 rows /
-- an RLS error.

-- ---------------------------------------------------------------------------
-- 6. Notifications
-- ---------------------------------------------------------------------------
-- A user may insert/read/update only their own notifications:
--   insert into public.notifications (user_id, title) values (auth.uid(), 'Hi');
--   -- must fail:
--   insert into public.notifications (user_id, title)
--     values ('00000000-0000-0000-0000-000000000000', 'Hi');

-- ---------------------------------------------------------------------------
-- 7. Reports
-- ---------------------------------------------------------------------------
-- Any authenticated user may INSERT a report with reporter_id = auth.uid().
-- No one may SELECT/UPDATE/DELETE reports except moderators/admins.

-- ---------------------------------------------------------------------------
-- 8. Storage policies
-- ---------------------------------------------------------------------------
-- Upload to  profile-media/<own-uid>/x.jpg        -> allowed
-- Upload to  profile-media/<other-uid>/x.jpg      -> denied
-- Read any object in profile-media                 -> allowed (public bucket)
-- Delete own object                                -> allowed
-- Delete someone else's object                     -> denied
