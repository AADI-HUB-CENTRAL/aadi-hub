# AADI HUB — Supabase Implementation Plan

Companion to `docs/supabase-architecture.md`. This is the working plan for
rebuilding AADI HUB on Supabase. It records what is done, what is local-only,
and what requires your Supabase project.

> **Status legend**
> - ✅ Done (local, build-verified)
> - 🟡 Done but unverified against a live backend
> - ⛔ Blocked on credentials / remote approval

---

## 0. Ground rules

- Never apply SQL to a remote database without explicit approval.
- Never write to the real `.env`.
- Never expose or commit secrets. Only the **publishable** key ever reaches the
  browser. The service-role key is never referenced in app code.
- When Supabase is not configured the app degrades to an honest "not connected"
  state. It never fakes auth or data.
- `@supabase/supabase-js` is v2.x. Plain JavaScript/JSX. No TypeScript.

---

## 1. Environment

| Variable | Purpose | Where |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL | `.env` (you provide) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key | `.env` (you provide) |
| `VITE_PUBLIC_APP_URL` | Canonical site URL for email links | `.env` |
| `VITE_FORMSPREE_ENDPOINT` | Existing lead form | `.env` (already set) |
| `VITE_WHATSAPP_COMMUNITY_URL` | Existing community link | `.env` (already set) |

`.env.example` documents all of them with placeholders. `.env` is git-ignored.

The client (`src/lib/supabase.js`) validates that the URL looks like a Supabase
URL and the key is non-trivial before creating a client. `isSupabaseConfigured`
drives every "not connected" state.

---

## 2. Database (schema + RLS + storage)

- ✅ Migration written: `supabase/migrations/20261016000001_init_schema.sql`.
- 🟡 **Not applied.** No live database yet.
- Contains: 13 tables, RLS on all of them, 10 functions, 10 triggers,
  21 indexes, `profile-media` storage bucket + policies, and a rollback block.
- Immutability: `aadi_id`, `aadi_id_num`, `role`, `id`, `created_at` are guarded
  by `protect_profile_fields()`. Only moderators/admins can change `role`.
- AADI ID allocation: `aadi_id_sequences.last_num` starts at **80000**, so the
  first issued ID is **AADI-80001**. Allocation happens in an `AFTER INSERT`
  trigger on `auth.users` (`handle_new_user`) using a `SECURITY DEFINER`
  function. A client cannot choose its own ID.
- Profile columns (post-review): includes `roles text[]`, `building`,
  `learning`, `exploring`, `looking_for`, `open_to` in addition to the base
  profile fields, to match the existing profile UI.

Apply it with one of:

```bash
# Option A — Supabase CLI (recommended)
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste the whole file into Supabase Dashboard → SQL Editor → Run.

---

## 3. Client foundation

| File | Role | Status |
| --- | --- | --- |
| `src/lib/supabase.js` | Client + `isSupabaseConfigured` | ✅ |
| `src/lib/authErrors.js` | Error-code → friendly message | ✅ |
| `src/lib/validation.js` | Email/password/text/URL validators | ✅ |
| `src/lib/files.js` | data-URL → File, byte formatting | ✅ |
| `src/context/AuthContext.jsx` | Session + profile provider, `useAuth()` | ✅ |
| `src/features/auth/authApi.js` | Thin wrappers over `supabase.auth` | ✅ |
| `src/features/profile/profileApi.js` | Profile + storage access | ✅ |
| `src/features/profile/adapters.js` | profile row ↔ legacy identity shape | ✅ |
| `src/hooks/useIdentity.js` | Memoized identity for dashboard | ✅ |
| `src/routes/guards.jsx` | `RequireAuth`, `RedirectIfAuthed` | ✅ |

The provider subscribes to `onAuthStateChange` synchronously (no awaits inside
the callback, to avoid deadlocking the auth client) and loads the profile in a
separate effect keyed on the user id.

---

## 4. Routes

All screens now live under `src/product/` (rebuilt frontend — see
`docs/setup-and-deployment.md` §6).

| Path | Guard | Component | Status |
| --- | --- | --- | --- |
| `/` | public | `product/pages/LandingPage` | ✅ |
| `/form` | public | `product/pages/WaitlistPage` (Formspree) | ✅ restyled |
| `/profile/:aadiId`, `/u/:aadiId`, `/p/:aadiId` | public | `product/pages/profile/PublicProfilePage` | ✅ |
| `/login`, `/register`, `/forgot-password` | `RedirectIfAuthed` | `product/pages/auth/*` | ✅ |
| `/reset-password`, `/verify-email`, `/auth/callback` | none | `product/pages/auth/*` | ✅ |
| `/onboarding` | `RequireAuth allowIncompleteOnboarding` | `product/pages/onboarding/OnboardingPage` | ✅ server-persisted |
| `/create-identity` | — | redirect → `/onboarding` | ✅ |
| `/dashboard`, `/projects`, `/projects/new`, `/projects/:id`, `/projects/:id/edit`, `/opportunities`, `/opportunities/new`, `/opportunities/:id`, `/profile`, `/aadi-id` | `RequireAuth` + `AppShell` | `product/pages/**` | ✅ |
| `/welcome`, `/dashboard/profile`, `/dashboard/aadi-id` | — | redirects → new routes | ✅ |
| `*` | — | `NotFound` (guards.jsx) | ✅ |

Guards are UX only. **RLS is the security boundary.**

`vercel.json` has a single catch-all rewrite so deep links resolve in
production.

---

## 5. Feature status

| Area | Status | Notes |
| --- | --- | --- |
| Register | ✅ | Real `signUp`; handles "confirm email" vs instant session |
| Login | ✅ | Real `signInWithPassword`; safe `from` redirect |
| Logout | ✅ | `signOut()` via context, then redirects to `/login` |
| Forgot / Reset password | ✅ | Real recovery flow; expired/invalid links explained |
| Email verification | ✅ | `/auth/callback` consumes tokens; resend page |
| Onboarding | ✅ | 5 steps, each persisted to `profiles`; completion stamped only after the final save succeeds |
| Dashboard overview | ✅ | Real profile completion, my projects, latest opportunities, pending submissions; honest empty states |
| Profile view/edit | ✅ | Full editor (identity, education, skills+levels, interests, goals, collaboration, links, privacy, avatar) |
| Public profile | ✅ | Reads server data by AADI ID; respects `is_public`; share action |
| AADI ID | ✅ | Flip card + QR encoding the real public URL |
| Projects & collaboration | ✅ | Directory/search, create/edit/archive/delete, join requests with owner approval |
| Opportunities hub | ✅ | Browse/bookmarks/my submissions; student submissions stay `pending` until a moderator publishes |
| Feed / Communities / Challenges / Events | ⬜ | Not built yet — deliberately absent from navigation ("Coming soon") |

---

## 6. Verification plan

Local (runnable now):

1. `npx vite build` — must pass. ✅ currently green.
2. With no Supabase env: protected routes show "not connected"; login/register
   disabled; landing page unaffected.
3. With Supabase env + applied migration: sign up → verify → onboarding → ID
   issued → dashboard → edit profile → public profile.

SQL / RLS tests — `supabase/tests/rls_test_plan.sql` documents the checks to run
against a scratch database. They cannot run locally (no Postgres/Docker).

---

## 7. Remote steps that need your approval

1. Apply the migration (CLI `db push` or SQL editor).
2. Supabase Auth → URL configuration: add site URL + redirect URLs
   (`/auth/callback`, `/reset-password`).
3. (Optional) Enable Google / GitHub OAuth providers.
4. Set the two `VITE_SUPABASE_*` variables in your local `.env` and in Vercel.
5. Deploy — only via PR.

---

## 8. Non-goals (for now)

- Server-side rendering. This stays a Vite SPA.
- Storing email in `profiles` (it stays in `auth.users`).
- Real-time subscriptions (can be added later without schema changes).
- Two-factor auth.
- File uploads other than profile/cover images.
