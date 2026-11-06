import { supabase } from '../../lib/supabase.js'

/* ---------------------------------------------------------------------------
   Auth API wrappers
   ---------------------------------------------------------------------------
   Thin, explicit wrappers around supabase.auth so pages do not scatter raw
   calls. Every call hits the real Supabase Auth service; there is no local
   fallback. If the client is missing (environment not configured) each call
   fails honestly with code 'not_configured' instead of pretending success.
--------------------------------------------------------------------------- */

const NOT_CONFIGURED = {
  code: 'not_configured',
  message: 'AADI HUB is not connected to its authentication service yet.',
}

function unavailable() {
  return { data: null, error: NOT_CONFIGURED }
}

/** Base URL used to build email links (verify / reset). */
export function appOrigin() {
  const configured = (import.meta.env.VITE_PUBLIC_APP_URL || '').trim().replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export async function signInWithPassword(email, password) {
  if (!supabase) return unavailable()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(email || '').trim(),
    password,
  })
  return { data, error }
}

export async function signUpWithPassword({ email, password, fullName }) {
  if (!supabase) return unavailable()
  const { data, error } = await supabase.auth.signUp({
    email: String(email || '').trim(),
    password,
    options: {
      // Consumed by the handle_new_user() trigger to seed the profile row.
      data: { full_name: fullName },
      emailRedirectTo: `${appOrigin()}/auth/callback`,
    },
  })
  return { data, error }
}

export async function requestPasswordReset(email) {
  if (!supabase) return unavailable()
  const { data, error } = await supabase.auth.resetPasswordForEmail(String(email || '').trim(), {
    redirectTo: `${appOrigin()}/reset-password`,
  })
  return { data, error }
}

export async function updatePassword(newPassword) {
  if (!supabase) return unavailable()
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}

export async function resendVerificationEmail(email) {
  if (!supabase) return unavailable()
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: String(email || '').trim(),
    options: { emailRedirectTo: `${appOrigin()}/auth/callback` },
  })
  return { data, error }
}

export async function signInWithOAuth(provider) {
  if (!supabase) return unavailable()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${appOrigin()}/auth/callback` },
  })
  return { data, error }
}

export async function fetchOwnEmail() {
  if (!supabase) return { email: null, error: NOT_CONFIGURED }
  const { data, error } = await supabase.auth.getUser()
  return { email: data?.user?.email ?? null, error }
}
