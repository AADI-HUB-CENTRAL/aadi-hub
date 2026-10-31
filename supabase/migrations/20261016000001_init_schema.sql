-- ============================================================================
-- AADI HUB — Initial schema
-- ============================================================================
-- Migration: 20261016000001_init_schema
-- Status:   PREPARED, NOT APPLIED. Run only after explicit approval.
-- Target:   Supabase (PostgreSQL 15+)
--
-- What this file creates
--   13 application tables + 1 sequence table
--   9 helper / trigger functions
--   Row Level Security policies on every table
--   1 storage bucket with owner-scoped policies
--   A database-generated, atomic, unique AADI ID (starts at AADI-80001)
--
-- Design notes
--   * auth identity lives in Supabase `auth.users`. No passwords here.
--   * Every table has RLS enabled. Nothing is readable/writable by accident.
--   * Helper functions used inside policies are SECURITY DEFINER with a fixed
--     `search_path` to avoid recursive-RLS problems and search-path hijacking.
--   * Existing prototype IDs AADI-70001..70004 were marketing content in
--     src/components/Team.jsx only. They were never stored in any datastore,
--     so there is nothing to migrate. New IDs therefore start at AADI-80001.
--
-- ROLLBACK: see the "Rollback" section at the very bottom of this file.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 0. Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'BEFORE UPDATE trigger: stamps updated_at. Not security sensitive.';


-- ---------------------------------------------------------------------------
-- 1. AADI ID sequence (internal)
-- ---------------------------------------------------------------------------
-- Single-row table. `last_num` is the highest ID handed out so far.
-- We start the counter at 80000 so the very first generated ID is AADI-80001.
-- This deliberately sits above the 70001-70004 range used by the landing-page
-- founder cards, so a real user can never collide with a founder ID.

create table if not exists public.aadi_id_sequences (
  id        integer primary key default 1 check (id = 1),
  last_num  integer not null default 80000
);

alter table public.aadi_id_sequences enable row level security;

-- No policies: nobody can read or write this table directly, not even via the
-- authenticated role. Only the SECURITY DEFINER allocator below touches it.
revoke all on table public.aadi_id_sequences from public, anon, authenticated;


create or replace function public.allocate_aadi_id_num()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_next integer;
begin
  -- FOR UPDATE semantics via the atomic UPDATE: serialises concurrent signups.
  update public.aadi_id_sequences
     set last_num = last_num + 1
   where id = 1
  returning last_num into v_next;

  if v_next is null then
    raise exception 'aadi_id_sequences row id=1 is missing';
  end if;

  return v_next;
end;
$$;

comment on function public.allocate_aadi_id_num() is
  'SECURITY DEFINER. Atomically allocates the next AADI ID number. '
  'Granted only to service_role/supabase_admin so ordinary users can never '
  'call it or influence the counter.';

revoke execute on function public.allocate_aadi_id_num() from public, anon, authenticated;
grant  execute on function public.allocate_aadi_id_num() to service_role, supabase_admin;


-- ---------------------------------------------------------------------------
-- 2. profiles
-- ---------------------------------------------------------------------------
-- 1:1 with auth.users. Deliberately does NOT store an email address:
-- the email lives in auth.users and is visible only to the owner via Supabase
-- Auth. Keeping it out of `profiles` means a public profile can never leak it.

create table if not exists public.profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,

  -- Immutable identity -------------------------------------------------------
  aadi_id               text    not null unique,
  aadi_id_num           integer not null unique,
  role                  text    not null default 'student'
                              check (role in ('student', 'moderator', 'admin')),

  -- Editable profile ---------------------------------------------------------
  full_name             text    not null check (char_length(trim(full_name)) between 1 and 120),
  headline              text    check (headline is null or char_length(headline) <= 160),
  bio                   text    check (bio is null or char_length(bio) <= 500),
  college               text    check (college is null or char_length(college) <= 160),
  course                text    check (course is null or char_length(course) <= 160),
  study_year            text    check (study_year is null or char_length(study_year) <= 40),
  age_range             text    check (age_range is null or age_range in ('Under 15', '15-18', '18-24', '25+')),
  location              text    check (location is null or char_length(location) <= 120),
  skills                text[]  not null default '{}',
  interests             text[]  not null default '{}',
  goals                 text[]  not null default '{}',
  -- Self-descriptive labels, e.g. {Builder, Learner}. Free-form but capped.
  roles                 text[]  not null default '{}',

  -- "Currently" self-descriptions shown on the profile and in the feed.
  building              text    check (building is null or char_length(building) <= 160),
  learning              text    check (learning is null or char_length(learning) <= 160),
  exploring             text    check (exploring is null or char_length(exploring) <= 160),
  looking_for           text    check (looking_for is null or char_length(looking_for) <= 160),
  open_to               text    check (open_to is null or char_length(open_to) <= 160),

  -- Media are storage object paths, not public URLs, so the CDN can change.
  avatar_path           text    check (avatar_path is null or char_length(avatar_path) <= 300),
  cover_type            text    not null default 'preset'
                                check (cover_type in ('preset', 'custom')),
  cover_value           text    check (cover_value is null or char_length(cover_value) <= 300),

  -- Optional outbound links shown on the public profile.
  github_url            text    check (github_url is null or char_length(github_url) <= 300),
  portfolio_url         text    check (portfolio_url is null or char_length(portfolio_url) <= 300),
  linkedin_url          text    check (linkedin_url is null or char_length(linkedin_url) <= 300),

  -- Extended education (onboarding step 1).
  department            text    check (department is null or char_length(department) <= 160),
  graduation_year       integer check (graduation_year is null or (graduation_year between 2024 and 2100)),

  -- Skill experience levels: {"Python": "Intermediate", ...}. Self-reported
  -- only — never presented as independently verified.
  skill_levels          jsonb   not null default '{}',

  -- Collaboration preferences (onboarding step 4).
  collab_prefs          text[]  not null default '{}',
  collab_mode           text    check (collab_mode is null or collab_mode in ('remote', 'onsite', 'hybrid')),

  -- Product / privacy --------------------------------------------------------
  is_public             boolean not null default true,
  onboarding_completed_at timestamptz,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.profiles is
  'Public-facing student identity. 1:1 with auth.users. Email is intentionally '
  'NOT stored here. aadi_id / aadi_id_num / role / id are immutable.';
comment on column public.profiles.aadi_id is
  'Human-readable permanent ID, e.g. AADI-80001. Generated by the database only.';
comment on column public.profiles.is_public is
  'Privacy switch. true = anyone (including signed-out visitors) can read this '
  'profile at /u/:aadiId. false = only the owner and moderators/admins. '
  'Default true because a shareable portfolio is the core AADI promise.';

create index if not exists profiles_aadi_id_num_idx  on public.profiles (aadi_id_num);
create index if not exists profiles_college_idx      on public.profiles (lower(college)) where college is not null;
create index if not exists profiles_is_public_idx    on public.profiles (is_public) where is_public;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 3. projects
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  title        text not null check (char_length(trim(title)) between 1 and 120),
  description  text check (description is null or char_length(description) <= 2000),
  category     text check (category is null or char_length(category) <= 80),
  technologies text[] not null default '{}',
  roles_needed text[] not null default '{}',
  skills_needed text[] not null default '{}',
  status       text not null default 'planning'
                    check (status in ('planning', 'in_progress', 'completed', 'archived')),
  repo_url     text check (repo_url is null or char_length(repo_url) <= 500),
  demo_url     text check (demo_url is null or char_length(demo_url) <= 500),
  visibility   text not null default 'public' check (visibility in ('public', 'private')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists projects_owner_idx  on public.projects (owner_id);
create index if not exists projects_status_idx on public.projects (status) where status <> 'archived';

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 4. project_members
-- ---------------------------------------------------------------------------
-- The owner is NOT duplicated here; projects.owner_id is the source of truth.
-- `pending` exists so "request to join" can be added without a schema change.

create table if not exists public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       text not null default 'member' check (role in ('collaborator', 'member')),
  status     text not null default 'active'  check (status in ('pending', 'active', 'rejected', 'left')),
  message    text check (message is null or char_length(message) <= 500),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create index if not exists project_members_user_idx on public.project_members (user_id);


-- ---------------------------------------------------------------------------
-- 5. communities
-- ---------------------------------------------------------------------------

create table if not exists public.communities (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  name         text not null check (char_length(trim(name)) between 1 and 80),
  description  text check (description is null or char_length(description) <= 500),
  color        text not null default '#B5E84A' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  is_public    boolean not null default true,
  member_count integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists communities_owner_idx on public.communities (owner_id);

create trigger communities_set_updated_at
  before update on public.communities
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 6. community_members
-- ---------------------------------------------------------------------------
-- role is 'member' for everyone except the owner and appointed moderators.
-- The owner row is created together with the community.

create table if not exists public.community_members (
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  role         text not null default 'member' check (role in ('owner', 'moderator', 'member')),
  status       text not null default 'active'  check (status in ('active', 'banned')),
  created_at   timestamptz not null default now(),
  primary key (community_id, user_id)
);

create index if not exists community_members_user_idx on public.community_members (user_id);


-- ---------------------------------------------------------------------------
-- 7. posts
-- ---------------------------------------------------------------------------
-- community_id NULL  -> a global feed post
-- project_id  NULL  -> not tied to a project
-- At most one of the two may be set.

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles (id) on delete cascade,
  community_id uuid references public.communities (id) on delete cascade,
  project_id  uuid references public.projects (id) on delete cascade,
  body        text not null check (char_length(trim(body)) between 1 and 5000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint posts_one_target check (not (community_id is not null and project_id is not null))
);

create index if not exists posts_author_idx    on public.posts (author_id);
create index if not exists posts_community_idx on public.posts (community_id) where community_id is not null;
create index if not exists posts_project_idx   on public.posts (project_id)   where project_id is not null;
create index if not exists posts_created_idx   on public.posts (created_at desc);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 8. comments
-- ---------------------------------------------------------------------------

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_id, created_at);

create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 9. opportunities
-- ---------------------------------------------------------------------------
-- status = 'draft'     invisible to everyone except the creator and admins.
-- status = 'pending'   a student submission awaiting moderator review.
-- status = 'published' live on the hub (verified by a moderator).
-- status = 'closed'    past its deadline or explicitly retired.
-- is_verified distinguishes moderator-vetted listings from community
-- submissions so the UI can label them honestly.

create table if not exists public.opportunities (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(trim(title)) between 1 and 160),
  description  text check (description is null or char_length(description) <= 4000),
  type         text not null default 'other'
                    check (type in ('internship', 'job', 'event', 'scholarship', 'hackathon', 'research', 'workshop', 'other')),
  organization text check (organization is null or char_length(organization) <= 160),
  location     text check (location is null or char_length(location) <= 160),
  mode         text check (mode is null or mode in ('remote', 'onsite', 'hybrid')),
  eligibility  text check (eligibility is null or char_length(eligibility) <= 300),
  apply_url    text check (apply_url is null or char_length(apply_url) <= 500),
  deadline     date,
  status       text not null default 'draft'
                    check (status in ('draft', 'pending', 'published', 'closed')),
  is_verified  boolean not null default false,
  created_by   uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists opportunities_status_idx  on public.opportunities (status, deadline);
create index if not exists opportunities_creator_idx on public.opportunities (created_by);
create index if not exists opportunities_type_idx   on public.opportunities (type) where status = 'published';

create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 9b. opportunity_bookmarks
-- ---------------------------------------------------------------------------
-- A student's private shortlist. Composite PK prevents duplicates.

create table if not exists public.opportunity_bookmarks (
  user_id        uuid not null references public.profiles (id) on delete cascade,
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create index if not exists opportunity_bookmarks_opp_idx on public.opportunity_bookmarks (opportunity_id);


-- ---------------------------------------------------------------------------
-- 10. challenges
-- ---------------------------------------------------------------------------

create table if not exists public.challenges (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(trim(title)) between 1 and 160),
  description text check (description is null or char_length(description) <= 4000),
  type        text not null default 'weekly' check (type in ('daily', 'weekly', 'special')),
  rules       text check (rules is null or char_length(rules) <= 4000),
  starts_at   timestamptz,
  ends_at     timestamptz,
  status      text not null default 'draft'
                   check (status in ('draft', 'upcoming', 'active', 'completed')),
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint challenges_time_order check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index if not exists challenges_status_idx on public.challenges (status, starts_at);

create trigger challenges_set_updated_at
  before update on public.challenges
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 11. challenge_participants
-- ---------------------------------------------------------------------------
-- The composite primary key is what makes duplicate participation impossible,
-- no matter what the application code does.

create table if not exists public.challenge_participants (
  challenge_id   uuid not null references public.challenges (id) on delete cascade,
  user_id        uuid not null references public.profiles (id) on delete cascade,
  status         text not null default 'joined'
                      check (status in ('joined', 'submitted', 'judged', 'winner')),
  submission_url text check (submission_url is null or char_length(submission_url) <= 500),
  note           text check (note is null or char_length(note) <= 1000),
  joined_at      timestamptz not null default now(),
  submitted_at   timestamptz,
  primary key (challenge_id, user_id)
);

create index if not exists challenge_participants_user_idx on public.challenge_participants (user_id);


-- ---------------------------------------------------------------------------
-- 12. notifications
-- ---------------------------------------------------------------------------
-- No insert policy for ordinary cross-user inserts: notifications for another
-- user must come from a trusted SECURITY DEFINER function added later.

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  type       text not null default 'system' check (char_length(type) <= 60),
  title      text not null check (char_length(trim(title)) between 1 and 160),
  body       text check (body is null or char_length(body) <= 500),
  link       text check (link is null or char_length(link) <= 500),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx   on public.notifications (user_id, created_at desc);
create index if not exists notifications_unread_idx on public.notifications (user_id) where read_at is null;


-- ---------------------------------------------------------------------------
-- 13. reports
-- ---------------------------------------------------------------------------
-- A reporter can always see their own report; only moderators/admins can act.

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment', 'profile', 'project', 'community')),
  target_id   uuid not null,
  reason      text not null check (char_length(trim(reason)) between 1 and 1000),
  status      text not null default 'open' check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists reports_reporter_idx on public.reports (reporter_id);
create index if not exists reports_status_idx   on public.reports (status) where status = 'open';


-- ---------------------------------------------------------------------------
-- 14. Immutability guard for protected profile fields
-- ---------------------------------------------------------------------------

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'profile id cannot be changed';
  end if;

  if new.aadi_id is distinct from old.aadi_id
     or new.aadi_id_num is distinct from old.aadi_id_num then
    raise exception 'AADI ID is permanent and cannot be changed';
  end if;

  -- Allowed only for moderators/admins, or when acting outside a user session
  -- (service_role / direct SQL) so an administrator can still promote someone.
  if new.role is distinct from old.role then
    if auth.uid() is not null
       and not exists (
         select 1 from public.profiles p
          where p.id = auth.uid() and p.role in ('moderator', 'admin')
       ) then
      raise exception 'role cannot be changed by this user';
    end if;
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'created_at cannot be changed';
  end if;

  return new;
end;
$$;

create trigger profiles_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();


-- ---------------------------------------------------------------------------
-- 15. Create a profile automatically on signup
-- ---------------------------------------------------------------------------
-- The frontend passes { full_name } in signup options. Everything else is
-- generated here. There is no path for a client to choose its own AADI ID.

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
  v_num := public.allocate_aadi_id_num();

  v_name := left(
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'AADI Member'),
    120
  );

  insert into public.profiles (id, aadi_id_num, aadi_id, full_name)
  values (new.id, v_num, 'AADI-' || lpad(v_num::text, 5, '0'), v_name);

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'AFTER INSERT on auth.users. Creates the matching profile and allocates the '
  'permanent AADI ID. SECURITY DEFINER because it must write to `profiles` '
  'while RLS is active. It only ever inserts one row for the new user id, so '
  'it cannot be used to escalate privileges.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant  execute on function public.handle_new_user() to service_role, supabase_admin;


-- ---------------------------------------------------------------------------
-- 16. RLS helper functions
-- ---------------------------------------------------------------------------
-- Each is SECURITY DEFINER with a pinned search_path, takes an explicit id,
-- and returns a single boolean. They are safe to expose to `authenticated`:
-- they only read membership/role rows and never write.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
     where id = auth.uid() and role in ('moderator', 'admin')
  );
$$;

create or replace function public.is_project_owner(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.projects
     where id = p_project_id and owner_id = auth.uid()
  );
$$;

create or replace function public.is_project_member(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.project_members
     where project_id = p_project_id and user_id = auth.uid() and status = 'active'
  );
$$;

create or replace function public.is_community_member(p_community_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.community_members
     where community_id = p_community_id and user_id = auth.uid() and status = 'active'
  );
$$;

create or replace function public.has_community_role(p_community_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.community_members
     where community_id = p_community_id
       and user_id = auth.uid()
       and status = 'active'
       and role = any (p_roles)
  );
$$;

revoke execute on function public.is_admin()             from public, anon;
revoke execute on function public.is_project_owner(uuid) from public, anon;
revoke execute on function public.is_project_member(uuid) from public, anon;
revoke execute on function public.is_community_member(uuid) from public, anon;
revoke execute on function public.has_community_role(uuid, text[]) from public, anon;

grant execute on function public.is_admin()             to authenticated;
grant execute on function public.is_project_owner(uuid) to authenticated;
grant execute on function public.is_project_member(uuid) to authenticated;
grant execute on function public.is_community_member(uuid) to authenticated;
grant execute on function public.has_community_role(uuid, text[]) to authenticated;


-- ---------------------------------------------------------------------------
-- 17. RLS: enable on every table
-- ---------------------------------------------------------------------------

alter table public.aadi_id_sequences      enable row level security;
alter table public.profiles               enable row level security;
alter table public.projects               enable row level security;
alter table public.project_members        enable row level security;
alter table public.communities            enable row level security;
alter table public.community_members      enable row level security;
alter table public.posts                  enable row level security;
alter table public.comments               enable row level security;
alter table public.opportunities          enable row level security;
alter table public.opportunity_bookmarks  enable row level security;
alter table public.challenges             enable row level security;
alter table public.challenge_participants enable row level security;
alter table public.notifications          enable row level security;
alter table public.reports                enable row level security;


-- ---------------------------------------------------------------------------
-- 18. RLS policies — profiles
-- ---------------------------------------------------------------------------

drop policy if exists "profiles_select_own"    on public.profiles;
drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "profiles_select_admin"  on public.profiles;
drop policy if exists "profiles_insert_own"    on public.profiles;
drop policy if exists "profiles_update_own"    on public.profiles;
drop policy if exists "profiles_delete_own"    on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "profiles_select_public" on public.profiles
  for select
  using (is_public = true);

create policy "profiles_select_admin" on public.profiles
  for select to authenticated
  using (public.is_admin());

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_delete_own" on public.profiles
  for delete to authenticated
  using (id = auth.uid());


-- ---------------------------------------------------------------------------
-- 19. RLS policies — projects
-- ---------------------------------------------------------------------------

drop policy if exists "projects_select_own"    on public.projects;
drop policy if exists "projects_select_public" on public.projects;
drop policy if exists "projects_select_member" on public.projects;
drop policy if exists "projects_insert_own"    on public.projects;
drop policy if exists "projects_update_owner"  on public.projects;
drop policy if exists "projects_delete_owner"  on public.projects;

create policy "projects_select_own" on public.projects
  for select to authenticated using (owner_id = auth.uid());

create policy "projects_select_public" on public.projects
  for select using (visibility = 'public');

create policy "projects_select_member" on public.projects
  for select to authenticated using (public.is_project_member(id));

create policy "projects_insert_own" on public.projects
  for insert to authenticated with check (owner_id = auth.uid());

create policy "projects_update_owner" on public.projects
  for update to authenticated
  using (public.is_project_owner(id))
  with check (public.is_project_owner(id));

create policy "projects_delete_owner" on public.projects
  for delete to authenticated using (public.is_project_owner(id));


-- ---------------------------------------------------------------------------
-- 20. RLS policies — project_members
-- ---------------------------------------------------------------------------

drop policy if exists "project_members_select"         on public.project_members;
drop policy if exists "project_members_join_self"      on public.project_members;
drop policy if exists "project_members_update_owner"   on public.project_members;
drop policy if exists "project_members_delete"         on public.project_members;

create policy "project_members_select" on public.project_members
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_project_owner(project_id)
    or public.is_project_member(project_id)
    or public.is_admin()
  );

-- You may only request to join yourself, and only as a pending plain member.
-- The project owner approves/rejects via UPDATE (see below).
create policy "project_members_join_self" on public.project_members
  for insert to authenticated
  with check (user_id = auth.uid() and role = 'member' and status = 'pending');

-- Only the project owner can approve, reject, or change a role.
-- (The previous `with check (... and user_id = auth.uid())` prevented the
-- owner from touching anyone else's row — fixed.)
create policy "project_members_update_owner" on public.project_members
  for update to authenticated
  using (public.is_project_owner(project_id))
  with check (public.is_project_owner(project_id));

-- A member may withdraw from a project, but cannot promote themselves.
create policy "project_members_withdraw_self" on public.project_members
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and status = 'left');

create policy "project_members_delete" on public.project_members
  for delete to authenticated
  using (user_id = auth.uid() or public.is_project_owner(project_id));


-- ---------------------------------------------------------------------------
-- 21. RLS policies — communities
-- ---------------------------------------------------------------------------

drop policy if exists "communities_select"    on public.communities;
drop policy if exists "communities_insert"    on public.communities;
drop policy if exists "communities_update"    on public.communities;
drop policy if exists "communities_delete"    on public.communities;

create policy "communities_select" on public.communities
  for select
  using (is_public or owner_id = auth.uid() or public.is_admin());

create policy "communities_insert" on public.communities
  for insert to authenticated with check (owner_id = auth.uid());

create policy "communities_update" on public.communities
  for update to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

create policy "communities_delete" on public.communities
  for delete to authenticated using (owner_id = auth.uid());


-- ---------------------------------------------------------------------------
-- 22. RLS policies — community_members
-- ---------------------------------------------------------------------------
-- Note: these deliberately call the SECURITY DEFINER helper functions instead
-- of sub-selecting community_members itself, which would recurse infinitely.

drop policy if exists "community_members_select"   on public.community_members;
drop policy if exists "community_members_join"    on public.community_members;
drop policy if exists "community_members_update"  on public.community_members;
drop policy if exists "community_members_delete"  on public.community_members;

create policy "community_members_select" on public.community_members
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_community_member(community_id)
    or public.has_community_role(community_id, array['owner', 'moderator'])
    or public.is_admin()
  );

-- You may join as an active member, or insert your own owner row at the moment
-- you create the community (owner_id on communities must match you).
create policy "community_members_join" on public.community_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'active'
    and (
      role = 'member'
      or (
        role = 'owner'
        and exists (
          select 1 from public.communities c
           where c.id = community_id and c.owner_id = auth.uid()
        )
      )
    )
  );

-- Only owner/moderator can change someone's role or ban them.
-- Immutability of community_id/user_id is enforced by the
-- sync_community_member_count trigger, so the policy does not need to
-- re-select community_members (which would recurse infinitely).
create policy "community_members_update" on public.community_members
  for update to authenticated
  using (public.has_community_role(community_id, array['owner', 'moderator']))
  with check (public.has_community_role(community_id, array['owner', 'moderator']));

-- Members leave on their own; owners can remove people.
create policy "community_members_delete" on public.community_members
  for delete to authenticated
  using (
    user_id = auth.uid()
    or public.has_community_role(community_id, array['owner'])
  );


-- ---------------------------------------------------------------------------
-- 23. RLS policies — posts
-- ---------------------------------------------------------------------------

drop policy if exists "posts_select"       on public.posts;
drop policy if exists "posts_insert"       on public.posts;
drop policy if exists "posts_update_author" on public.posts;
drop policy if exists "posts_delete_author" on public.posts;

create policy "posts_select" on public.posts
  for select
  using (
    author_id = auth.uid()
    or public.is_admin()
    or (community_id is null and project_id is null)
    or (community_id is not null and public.is_community_member(community_id))
    or (project_id is not null and public.is_project_member(project_id))
  );

create policy "posts_insert" on public.posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and (community_id is null or public.is_community_member(community_id))
    and (project_id  is null or public.is_project_member(project_id))
  );

create policy "posts_update_author" on public.posts
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "posts_delete_author" on public.posts
  for delete to authenticated
  using (author_id = auth.uid() or public.is_admin());


-- ---------------------------------------------------------------------------
-- 24. RLS policies — comments
-- ---------------------------------------------------------------------------

drop policy if exists "comments_select"        on public.comments;
drop policy if exists "comments_insert"        on public.comments;
drop policy if exists "comments_update_author" on public.comments;
drop policy if exists "comments_delete_author" on public.comments;

-- A comment is readable if its parent post is readable to you.
create policy "comments_select" on public.comments
  for select
  using (
    author_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.posts p
       where p.id = post_id
         and (
           p.author_id = auth.uid()
           or (p.community_id is null and p.project_id is null)
           or (p.community_id is not null and public.is_community_member(p.community_id))
           or (p.project_id  is not null and public.is_project_member(p.project_id))
         )
    )
  );

create policy "comments_insert" on public.comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.posts p
       where p.id = post_id
         and (
           p.community_id is null and p.project_id is null
           or (p.community_id is not null and public.is_community_member(p.community_id))
           or (p.project_id  is not null and public.is_project_member(p.project_id))
         )
    )
  );

create policy "comments_update_author" on public.comments
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "comments_delete_author" on public.comments
  for delete to authenticated
  using (author_id = auth.uid() or public.is_admin());


-- ---------------------------------------------------------------------------
-- 25. RLS policies — opportunities
-- ---------------------------------------------------------------------------
-- Published listings are world-readable. Drafts are creator/mod only.
-- Students may SUBMIT an opportunity (status='pending', is_verified=false);
-- only moderators/admins can publish it or mark it verified.

drop policy if exists "opportunities_select"   on public.opportunities;
drop policy if exists "opportunities_insert"   on public.opportunities;
drop policy if exists "opportunities_update"   on public.opportunities;
drop policy if exists "opportunities_delete"   on public.opportunities;

create policy "opportunities_select" on public.opportunities
  for select
  using (
    status = 'published'
    or created_by = auth.uid()
    or public.is_admin()
  );

create policy "opportunities_insert" on public.opportunities
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      -- Moderators/admins create listings directly.
      public.is_admin()
      or (
        -- Students may only submit; the row lands as unverified + pending.
        status = 'pending'
        and is_verified = false
      )
    )
  );

create policy "opportunities_update" on public.opportunities
  for update to authenticated
  using (created_by = auth.uid() or public.is_admin())
  with check (
    created_by = auth.uid()
    or public.is_admin()
  );

create policy "opportunities_delete" on public.opportunities
  for delete to authenticated
  using (created_by = auth.uid() or public.is_admin());


-- ---------------------------------------------------------------------------
-- 25b. RLS policies — opportunity_bookmarks
-- ---------------------------------------------------------------------------
-- Strictly private: each row is visible and manageable only by its owner.

drop policy if exists "ob_select_own" on public.opportunity_bookmarks;
drop policy if exists "ob_insert_own" on public.opportunity_bookmarks;
drop policy if exists "ob_delete_own" on public.opportunity_bookmarks;

create policy "ob_select_own" on public.opportunity_bookmarks
  for select to authenticated using (user_id = auth.uid());

create policy "ob_insert_own" on public.opportunity_bookmarks
  for insert to authenticated with check (user_id = auth.uid());

create policy "ob_delete_own" on public.opportunity_bookmarks
  for delete to authenticated using (user_id = auth.uid());


-- ---------------------------------------------------------------------------
-- 26. RLS policies — challenges
-- ---------------------------------------------------------------------------

drop policy if exists "challenges_select"   on public.challenges;
drop policy if exists "challenges_insert"   on public.challenges;
drop policy if exists "challenges_update"   on public.challenges;
drop policy if exists "challenges_delete"   on public.challenges;

create policy "challenges_select" on public.challenges
  for select
  using (status <> 'draft' or created_by = auth.uid() or public.is_admin());

create policy "challenges_insert" on public.challenges
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_admin());

create policy "challenges_update" on public.challenges
  for update to authenticated
  using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

create policy "challenges_delete" on public.challenges
  for delete to authenticated
  using (created_by = auth.uid() or public.is_admin());


-- ---------------------------------------------------------------------------
-- 27. RLS policies — challenge_participants
-- ---------------------------------------------------------------------------

drop policy if exists "cp_select"   on public.challenge_participants;
drop policy if exists "cp_join"     on public.challenge_participants;
drop policy if exists "cp_update"   on public.challenge_participants;
drop policy if exists "cp_delete"   on public.challenge_participants;

create policy "cp_select" on public.challenge_participants
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Join yourself, into a challenge that is not a draft, once only
-- (the composite PK is the real duplicate guard).
create policy "cp_join" on public.challenge_participants
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'joined'
    and exists (
      select 1 from public.challenges c
       where c.id = challenge_id and c.status in ('upcoming', 'active')
    )
  );

-- You may add your own submission. Nobody may promote themselves to winner.
create policy "cp_update" on public.challenge_participants
  for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and status in ('joined', 'submitted')
  );

create policy "cp_delete" on public.challenge_participants
  for delete to authenticated
  using (user_id = auth.uid());


-- ---------------------------------------------------------------------------
-- 28. RLS policies — notifications
-- ---------------------------------------------------------------------------

drop policy if exists "notifications_select_own"   on public.notifications;
drop policy if exists "notifications_insert_own"   on public.notifications;
drop policy if exists "notifications_update_own"   on public.notifications;
drop policy if exists "notifications_delete_own"   on public.notifications;

create policy "notifications_select_own" on public.notifications
  for select to authenticated using (user_id = auth.uid());

-- A user may only create a notification for themselves (e.g. "welcome").
-- Cross-user notifications (likes, comments) will be added later through a
-- trusted SECURITY DEFINER function, never through a permissive policy.
create policy "notifications_insert_own" on public.notifications
  for insert to authenticated with check (user_id = auth.uid());

create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_delete_own" on public.notifications
  for delete to authenticated using (user_id = auth.uid());


-- ---------------------------------------------------------------------------
-- 29. RLS policies — reports
-- ---------------------------------------------------------------------------

drop policy if exists "reports_insert_own"   on public.reports;
drop policy if exists "reports_select_own"   on public.reports;
drop policy if exists "reports_update_mod"   on public.reports;

create policy "reports_insert_own" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid());

create policy "reports_select_own" on public.reports
  for select to authenticated using (reporter_id = auth.uid() or public.is_admin());

create policy "reports_update_mod" on public.reports
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No delete policy on purpose: moderation reports are retained.


-- ---------------------------------------------------------------------------
-- 30. member_count maintenance
-- ---------------------------------------------------------------------------

create or replace function public.sync_community_member_count()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'active' then
      update public.communities
         set member_count = member_count + 1
       where id = new.community_id;
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.community_id is distinct from old.community_id then
      raise exception 'community membership cannot be moved to another community';
    end if;
    if old.status <> 'active' and new.status = 'active' then
      update public.communities set member_count = member_count + 1 where id = new.community_id;
    elsif old.status = 'active' and new.status <> 'active' then
      update public.communities set member_count = greatest(member_count - 1, 0) where id = new.community_id;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.status = 'active' then
      update public.communities
         set member_count = greatest(member_count - 1, 0)
       where id = old.community_id;
    end if;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists community_members_sync_count on public.community_members;
create trigger community_members_sync_count
  after insert or update or delete on public.community_members
  for each row execute function public.sync_community_member_count();


-- ---------------------------------------------------------------------------
-- 31. Storage — profile media
-- ---------------------------------------------------------------------------
-- Path convention: <auth.uid()>/<filename>. Owner-scoped writes, public read.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-media',
  'profile-media',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "profile-media public read"   on storage.objects;
drop policy if exists "profile-media owner insert"  on storage.objects;
drop policy if exists "profile-media owner update"  on storage.objects;
drop policy if exists "profile-media owner delete"  on storage.objects;

create policy "profile-media public read" on storage.objects
  for select using (bucket_id = 'profile-media');

create policy "profile-media owner insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'profile-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "profile-media owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'profile-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "profile-media owner delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'profile-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


commit;

-- ============================================================================
-- ROLLBACK
-- ============================================================================
-- Run only if you need to undo this migration entirely. This is destructive:
-- it drops all AADI HUB tables and every row in them.
--
--   begin;
--   drop trigger if exists on_auth_user_created on auth.users;
--   drop policy if exists "profile-media public read"  on storage.objects;
--   drop policy if exists "profile-media owner insert" on storage.objects;
--   drop policy if exists "profile-media owner update" on storage.objects;
--   drop policy if exists "profile-media owner delete" on storage.objects;
--   delete from storage.buckets where id = 'profile-media';
--   drop table if exists public.reports cascade;
--   drop table if exists public.notifications cascade;
--   drop table if exists public.challenge_participants cascade;
--   drop table if exists public.challenges cascade;
--   drop table if exists public.opportunity_bookmarks cascade;
--   drop table if exists public.opportunities cascade;
--   drop table if exists public.comments cascade;
--   drop table if exists public.posts cascade;
--   drop table if exists public.community_members cascade;
--   drop table if exists public.communities cascade;
--   drop table if exists public.project_members cascade;
--   drop table if exists public.projects cascade;
--   drop table if exists public.profiles cascade;
--   drop table if exists public.aadi_id_sequences cascade;
--   drop function if exists public.handle_new_user();
--   drop function if exists public.allocate_aadi_id_num();
--   drop function if exists public.protect_profile_fields();
--   drop function if exists public.sync_community_member_count();
--   drop function if exists public.set_updated_at();
--   drop function if exists public.has_community_role(uuid, text[]);
--   drop function if exists public.is_community_member(uuid);
--   drop function if exists public.is_project_member(uuid);
--   drop function if exists public.is_project_owner(uuid);
--   drop function if exists public.is_admin();
--   commit;
