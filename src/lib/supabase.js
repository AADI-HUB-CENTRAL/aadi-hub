import { createClient } from '@supabase/supabase-js'

/* ---------------------------------------------------------------------------
   Supabase client
   ---------------------------------------------------------------------------
   Only publishable (public) values are used here. Vite inlines every VITE_*
   variable into the public bundle, so nothing secret may ever be passed to
   createClient(). The service-role key must never appear in this file.

   RLS is the real security boundary — see docs/supabase-architecture.md.

   The fallback constants below are PUBLIC publishable values (safe to ship in
   the client bundle). They guarantee the site still connects to Supabase when
   the hosting provider is missing VITE_SUPABASE_* environment variables, which
   was the cause of the "Celebration wall is not connected yet" message.
--------------------------------------------------------------------------- */

const FALLBACK_SUPABASE_URL = 'https://ldzjgmarowqlbmnqpslz.supabase.co'
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_EAGFKbsG5QQEI-eOQyH06w_3Aw5ZqvV'

function looksLikeSupabaseUrl(value) {
  return (
    /^https:\/\/[^\s]+\.supabase\.(co|in)\/?$/.test(value) &&
    !value.includes('your_')
  )
}

function looksLikePublishableKey(value) {
  return value.length > 20 && !value.startsWith('your_')
}

const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const envKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim()

const url = looksLikeSupabaseUrl(envUrl) ? envUrl : FALLBACK_SUPABASE_URL
const publishableKey = looksLikePublishableKey(envKey)
  ? envKey
  : FALLBACK_SUPABASE_PUBLISHABLE_KEY

/** True only when both Supabase values look like real credentials. */
export const isSupabaseConfigured = Boolean(
  looksLikeSupabaseUrl(url) && looksLikePublishableKey(publishableKey)
)

/** Human-readable explanation shown when Supabase is not set up yet. */
export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Supabase is not configured yet. Add VITE_SUPABASE_URL and ' +
  'VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) to your .env file, then restart the dev server. ' +
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
