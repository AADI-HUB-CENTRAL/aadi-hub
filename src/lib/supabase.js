import { createClient } from '@supabase/supabase-js'

/* ---------------------------------------------------------------------------
   Supabase client
   ---------------------------------------------------------------------------
   Only publishable (public) values are used here. Vite inlines every VITE_*
   variable into the public bundle, so nothing secret may ever be passed to
   createClient(). The service-role key must never appear in this file.

   RLS is the real security boundary — see docs/supabase-architecture.md.
--------------------------------------------------------------------------- */

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()

/** True only when both Supabase values look like real credentials. */
export const isSupabaseConfigured = Boolean(
  /^https:\/\/[^\s]+\.supabase\.(co|in)\/?$/.test(url) &&
  publishableKey.length > 20 &&
  !url.includes('your_') &&
  !publishableKey.startsWith('your_')
)

/** Human-readable explanation shown when Supabase is not set up yet. */
export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Supabase is not configured yet. Add VITE_SUPABASE_URL and ' +
  'VITE_SUPABASE_PUBLISHABLE_KEY to your .env file, then restart the dev server. ' +
  'See docs/setup-and-deployment.md.'

export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Store the session in localStorage by default. Cookies would be
        // safer against XSS, but require a Supabase feature that is not
        // enabled on every free project. Documented in setup-and-deployment.md.
        storageKey: 'aadi-auth',
      },
    })
  : null

export const SUPABASE_URL = url
