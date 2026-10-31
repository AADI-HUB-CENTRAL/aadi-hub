# AADI HUB — Setup & Deployment

Everything needed to run the app locally and put it in front of real students.
Companion docs: `docs/supabase-architecture.md` (trust model, tables, RLS) and
`docs/supabase-implementation-plan.md` (what is built vs. pending).

---

## 1. Requirements

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project (free tier is enough)
- Any static host for deployment (Vercel, Netlify, Cloudflare Pages, …)

---

## 2. Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes* | Supabase project URL (`https://<ref>.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes* | Supabase publishable/anon key (safe by design — it ships in the bundle) |
| `VITE_FORMSPREE_ENDPOINT` | No | Founding-community waitlist at `/form`. Without it the form says so instead of pretending |
| `VITE_WHATSAPP_COMMUNITY_URL` | No | WhatsApp community link on the waitlist success screen |
| `VITE_PUBLIC_APP_URL` | No | Base URL used to build shareable profile links and the AADI ID QR. Defaults to `window.location.origin` |

\* Without both Supabase values the app still builds and runs, but every
backend screen shows an honest **"not connected"** state. Nothing is faked.

**Never commit `.env`.** Only `VITE_`-prefixed values are used; Vite inlines
them into the public bundle, so nothing secret may ever go in them. The
Supabase **service-role key must never appear anywhere in this repository.**

Vite reads env files at build time — restart `npm run dev` (or rebuild) after
changing them.

---

## 3. Create the Supabase project and apply the schema

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. Copy the Project URL and publishable key into `.env`.
3. Apply the single migration:
   `supabase/migrations/20261016000001_init_schema.sql`

   **Option A — SQL editor (simplest):** open *SQL Editor* in the dashboard,
   paste the whole file, run it. It is idempotent (`create table if not exists`,
   `drop policy if exists`, …), so re-running is safe.

   **Option B — Supabase CLI:**
   ```bash
   supabase link --project-ref <ref>
   supabase db push        # or: supabase migration up
   ```

   The migration creates all 13 tables, every RLS policy, the signup trigger
   that assigns each account a permanent **AADI ID** (format `AADI-8xxxx`,
   counter starting at 80001), and the `profile-media` storage bucket with
   owner-scoped policies. Nothing in this repo can apply it for you.

4. In *Authentication → URL Configuration*, add your site URLs, e.g.
   - Site URL: `http://localhost:5173` (and your production URL)
   - Redirect URLs: `http://localhost:5173/auth/callback`,
     `http://localhost:5173/reset-password`, and the production equivalents.
5. *Authentication → Email* controls verification:
   - With **Confirm email** ON (recommended), new signups land on
     `/verify-email` until they click the link.
   - With it OFF, sign-in works immediately. The UI adapts either way.

---

## 4. Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in dist/
npm run preview    # serve the production bundle locally
```

### Smoke checklist (against a configured backend)

1. `/` renders the landing page; `/form` submits the waitlist only if the
   Formspree endpoint is set.
2. Register with a real email → `/verify-email` (or straight to `/onboarding`
   if confirmation is off). A row appears in `profiles` with a generated
   `aadi_id`.
3. Complete onboarding → redirected to `/dashboard`. Reload mid-flow: the
   guards send you back to `/onboarding` with progress restored from the
   server (each step save is a real `profiles` update).
4. Create a project → appears under *My projects*; a second account can send a
   join request, and the owner can approve/reject it.
5. Submit an opportunity → shows as **Awaiting review** and is invisible to
   other students; a moderator account can publish it.
6. `/u/<your-AADI-ID>` opens in a private window (profile public). Flip the
   privacy switch → the same link shows "Profile not available".
7. `/aadi-id` shows the ID card; the QR encodes the public profile URL.

### Honest states you should see (not bugs)

- **No Supabase vars in `.env`** → guards show "AADI HUB is not connected to a
  database yet" with a pointer to this file.
- **Migration not applied** → guard explains that the signup trigger could not
  create your profile.
- **No data yet** → dashboards and directories render empty states. There is
  no seed data and no mock activity anywhere.

---

## 5. Deploy

1. Build with the env vars present **at build time**:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and any optional ones.
2. Deploy the `dist/` folder as a static site. Configure an SPA fallback so
   unknown paths serve `index.html` (Vercel/Netlify do this by default for
   Vite projects; on others add a rewrite of `/*` → `/index.html`).
3. Add the production origin to Supabase *Authentication → URL Configuration*
   (Site URL + redirect URLs including `https://your-domain/auth/callback`).
4. Re-run the smoke checklist on production.

### Session storage note

Sessions persist in `localStorage` under the key `aadi-auth`. Cookies would be
stronger against XSS but require a Supabase feature not enabled on every free
project. This is a deliberate, documented trade-off — see
`docs/supabase-architecture.md` §7.

---

## 6. Where things live

| Path | Role |
| --- | --- |
| `src/product/` | All new screens: UI kit, app shell, landing, auth, onboarding, dashboard, projects, opportunities, profiles |
| `src/features/` | Data access only (auth, profile, projects, opportunities). Shapes requests; RLS decides outcomes |
| `src/context/` | `AuthContext` (Supabase session + profile), `ToastContext` |
| `src/routes/guards.jsx` | Route guards — UX only, never a security boundary |
| `supabase/migrations/` | The one source of schema truth |
| `docs/` | Architecture, audit, implementation plan, this file |
