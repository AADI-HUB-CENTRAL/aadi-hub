# AADI HUB — Project Audit

> Written during Phase 0 of the Supabase rebuild. Read-only inspection plus one
> checkpoint commit. No application code was changed by the audit itself.

- **Audit date:** 2026-10-16
- **Branch at audit time:** `main`
- **Last commit before work:** `6048828` (feat: functional Early Access form with Formspree)
- **Checkpoint commit created:** `e13f3ed`
- **Backup branch:** `backup/pre-supabase-20261016` (points at `e13f3ed`)

---

## 1. How to recover the pre-Supabase prototype

Everything that existed before this rebuild is preserved.

```bash
git log --oneline -5                 # e13f3ed is the checkpoint
git switch backup/pre-supabase-20261016   # go back to the prototype
git switch main                      # return to the rebuild
```

Nothing was deleted or overwritten to create the checkpoint. Uncommitted work was
committed as-is in `e13f3ed`.

**Note:** the repository had no git identity configured, so a *repository-local*
`user.name` / `user.email` was set (not `--global`). Change it if you prefer:

```bash
git config --local user.name  "Your Name"
git config --local user.email "you@example.com"
```

---

## 2. Technology stack (as found)

| Layer | Technology | Locked version |
|---|---|---|
| Build | Vite | 6.4.3 |
| UI | React + React DOM | 19.2.8 |
| Routing | react-router-dom | 7.18.2 |
| QR | qrcode.react | 4.2.0 |
| Language | JavaScript (JSX) — no TypeScript | — |
| Package manager | npm (`package-lock.json`, lockfileVersion 3) | — |
| Styling | Hand-written CSS, 9 files, ~15,160 lines | — |
| Fonts | Space Grotesk + Inter via Google Fonts CDN | — |
| Backend | **None** | — |
| Database | **None** | — |
| Auth | **None** (localStorage prototype) | — |
| Deploy | Vercel static (`vercel.json`) | — |
| Tests / lint / CI | **None** (no scripts, no configs, no test files) | — |

**Scripts available:** `dev`, `build`, `preview` only.

---

## 3. Repository structure

```
index.html                 SEO/OG/JSON-LD, Google Fonts
vite.config.js             react plugin, build.target es2018
vercel.json                2 SPA rewrites (incomplete — see §6)
package.json / package-lock.json
.env                       NOT tracked by git (verified)
.env.example               tracked, placeholders only
public/                    logos, team photos, campus badges, loginimg.png (2.2 MB)
src/
  main.jsx                 mounts app, imports 9 CSS files
  App.jsx                  route table (11 routes, no 404 catch-all)
  components/              25 landing sections + auth + dashboard (65 JSX files)
  components/dashboard/    18 files: layout, sidebar, header, profile, AADI ID
  components/ui/           Avatar, Button, Icons, Qr, Reveal, SectionHeader
  data/dashboardData.js    ALL dashboard content is mock data
  utils/                   account.js, identity.js, logout.js (localStorage)
  styles/                  tokens.css (design system) + 8 more
supabase/migrations/       created by this rebuild
docs/                      created by this rebuild
```

**Routes found** (`src/App.jsx`):

| Route | Component | Guard |
|---|---|---|
| `/` | LandingPage (25 sections) | — |
| `/form` | FormPage → EarlyAccessForm (Formspree) | — |
| `/login` | Login | none |
| `/register` | Register | none |
| `/create-identity` | CreateIdentity | localStorage `hasAccount()` |
| `/welcome` | Welcome | localStorage `getIdentity()` |
| `/dashboard`, `/dashboard/profile`, `/dashboard/aadi-id`, `/aadi-id` | Dashboard | localStorage `getIdentity()` |
| `/profile/:aadiId`, `/u/:aadiId` | PublicProfile | — |
| **`*` (404)** | **missing** | — |

---

## 4. Authentication — what actually existed

**There was no real authentication.** Specific findings:

| Location | Finding |
|---|---|
| `src/components/Login.jsx:79-87` | `handleSubmit` runs `setTimeout(1800)` then shows a "Demo Mode" panel. No credential check, no navigation. |
| `src/components/Login.jsx:193,197` | Google / GitHub buttons call `alert('Authentication is coming soon.')`. |
| `src/components/Login.jsx:211-221` | "Forgot password" is a stub modal. |
| `src/components/Register.jsx:106-121` | Saves `{fullName, email}` to `localStorage['aadi_account']`. **The password is validated then discarded — never stored or sent.** |
| `src/utils/account.js` | localStorage read/write helpers only. |
| `src/utils/logout.js` | Removes 2 of 4 keys, then `window.location.href = '/register'`. |
| Route guards | 4 independent `useEffect` redirects in `CreateIdentity.jsx`, `Dashboard.jsx`, `Welcome.jsx`, `ProfilePage.jsx` — all to `/register`. |

Other auth problems found:

1. Password length mismatch: 6 chars on Login, 8 on Register.
2. No session, token, cookie, expiry, email verification, or password reset.
3. All state in `localStorage` — trivially forgeable in DevTools.
4. No error boundary anywhere (0 matches for `ErrorBoundary` / `componentDidCatch`).
5. PII (email, base64 photo) stored unencrypted in `localStorage`.

---

## 5. AADI ID — what actually existed

`src/utils/identity.js`:

```js
const SEQUENCE_KEY = 'aadi_next_id'
const START_ID = 70001
```

- IDs are allocated from a **browser-local counter**. Every new visitor becomes
  `AADI-70001`. IDs are not unique between users or devices.
- `src/components/Team.jsx:18,31,43,55` hardcodes `AADI-70001`–`AADI-70004` for the
  four founders. **The first real registrant collides with the Founder's ID.**
- `src/components/PublicProfile.jsx` reads `localStorage['aadi_identities']`, so a
  shared `/u/AADI-70001` link shows "Identity Unavailable" on every other device,
  while the page still claims *"Identity verified through AADI HUB"*.

This is why the rebuild generates AADI IDs **in the database**, starting at
`AADI-80001`. See `docs/supabase-architecture.md`.

---

## 6. Deployment and build status

### Build (verified by running it)

```
npx vite build
```

Result: **PASSED** — 117 modules, `index.html` 2.70 kB, CSS 256.56 kB (gzip 40.87),
JS 552.64 kB (gzip 150.59), 5.66 s. Warning: single chunk > 500 kB, no code splitting.

### Not available (cannot be claimed as passing)

- `npm run lint` — no script, no ESLint config
- `npm run typecheck` — no TypeScript
- `npm test` — no test framework, 0 test files
- CI — no `.github/` directory
- README — did not exist

### Deployment bug (critical)

`vercel.json` only rewrote 2 routes:

```json
{ "rewrites": [
    { "source": "/form",            "destination": "/index.html" },
    { "source": "/profile/:aadiId", "destination": "/index.html" }
] }
```

`/login`, `/register`, `/create-identity`, `/welcome`, `/dashboard`,
`/dashboard/*`, `/aadi-id` and `/u/:aadiId` had **no SPA fallback**, so deep links
and hard refreshes returned 404 in production. Fixed during this rebuild with a
catch-all rewrite (see `docs/setup-and-deployment.md`).

---

## 7. Environment and secrets

| Check | Result |
|---|---|
| `.env` tracked by git? | **No** — correctly git-ignored |
| `.env.example` tracked? | Yes, placeholders only |
| Secrets hardcoded in tracked source? | **No** — scan of all tracked files found none |
| `.env.example` completeness | Was missing `VITE_PUBLIC_APP_URL` |
| `VITE_*` exposure | All `VITE_` values are inlined into the public JS bundle. **Never put a secret in a `VITE_` variable.** |

Variables in `.env` at audit time (names only, values not disclosed):
`VITE_FORMSPREE_ENDPOINT`, `VITE_WHATSAPP_COMMUNITY_URL`, `VITE_PUBLIC_APP_URL`.
All three were set.

---

## 8. Design system (preserved — not redesigned)

`src/styles/tokens.css` is complete and on-brand. It was kept as-is.

- **Deep Night navy:** `--night-950 #04060B` → `--night-100 #E9EDF4`
- **Kiwi green accent:** `--kiwi-500 #B5E84A` (primary), `--kiwi-100` … `--kiwi-700`
- **Neutrals:** `--paper #F5F8F0`, `--white #FFFFFF`, `--ink #0B111E`
- Radii, container width, gutter, shadows and easing tokens all present
- Fonts: `--font-display: "Space Grotesk"`, `--font-body: "Inter"`

Reusable components kept: `ui/Button.jsx` (router-aware), `ui/Reveal.jsx`,
`ui/SectionHeader.jsx`, `ui/Avatar.jsx`, `ui/Qr.jsx`, `ui/Icons.jsx` (44 icons),
`Logo.jsx` (`BrandSymbol`), the dashboard shell, `PhotoCropEditor.jsx`,
`CoverCropper.jsx`, `CoverDesigns.jsx`, and all 25 landing sections.

`EarlyAccessForm.jsx` is the accessibility reference implementation
(`aria-invalid`, `aria-describedby`, `role="alert"`, error focus management).

---

## 9. Issue summary

### Critical
1. No real authentication — everything client-side and forgeable.
2. Passwords collected then discarded.
3. AADI ID collision between generated IDs and hardcoded founder IDs.
4. Public profiles are browser-local, so shared links never work.
5. No error boundary — a single render exception blanks the app.
6. Production deep routes 404 (missing SPA fallback).

### Functional
1. Login does nothing; dead-ends on a "Demo Mode" panel.
2. Logout redirects to `/register` and leaves stale keys.
3. Social login buttons use `alert()`.
4. Dashboard URL desyncs for 8 of 11 sections (UI changes, URL does not).
5. No 404 route — unknown paths render a blank page.
6. Dead controls: QuickActions, "Explore projects", Settings, Help.
7. Unhandled `localStorage` quota error on large photos.

### Missing
Backend, database, API, email verification, password reset, file storage,
8 of 11 dashboard sections, notifications, settings, tests, lint, CI, README.

### Technical debt
10,383 JS lines + 15,160 CSS lines with zero linting. Monoliths:
`ProfilePage.jsx` (892 lines), `Projects.jsx` (504), `sections.css` (8,330).
Icon duplication across 5 files. localStorage key strings scattered.

---

## 10. Commands run during the audit

| Command | Result |
|---|---|
| `git status`, `git log`, `git branch`, `git ls-files`, `git diff` | informational |
| `npx vite build` (outDir outside repo) | PASSED |
| `npm run dev` + HTTP GET `/login`, `/u/AADI-70001`, `/nonexistent-page` | 200 (dev SPA fallback) |
| Secret regex scan over all tracked files | clean |
| Static greps (env, localStorage, fetch, auth libs, a11y, links, anchors) | informational |
| `npm install @supabase/supabase-js@^2` | added 9 packages |
| `npm audit` → `npm audit fix` | 1 high (dev-only `source-map-js`) → **0 vulnerabilities** |
| `git add -A && git commit` + `git branch backup/…` | checkpoint created |

No destructive command was run. No remote resource was created or modified.
