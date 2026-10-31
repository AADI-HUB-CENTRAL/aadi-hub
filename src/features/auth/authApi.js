import { supabase } from '../../lib/supabase.js'

/* ---------------------------------------------------------------------------
   Auth API wrappers
   ---------------------------------------------------------------------------
   Thin, explicit wrappers around supabase.auth so pages do not scatter raw
   calls. No mocking, no fake delays — every call hits the real service.
   When Supabase is not configured, every call returns a friendly error object
   instead of throwing, so the UI can render an honest "not configured" state.
--------------------------------------------------------------------------- */

const NOT_CONFIGURED = {
  data: null,
  error: { code: 'not_configured', message: 'Supabase is not configured.' },
}

/** Base URL used to build email links (verify / reset). */
export function appOrigin() {
  const configured = (import.meta.env.VITE_PUBLIC_APP_URL || '').trim().replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export async function signInWithPassword(email, password) {
  if (!supabase) return NOT_CONFIGURED
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  return { data, error }
}

export async function signUpWithPassword({ email, password, fullName }) {
  if (!supabase) return NOT_CONFIGURED
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
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
  if (!supabase) return NOT_CONFIGURED
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${appOrigin()}/reset-password`,
  })
  return { data, error }
}

export async function updatePassword(newPassword) {
  if (!supabase) return NOT_CONFIGURED
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}

export async function resendVerificationEmail(email) {
  if (!supabase) return NOT_CONFIGURED
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: { emailRedirectTo: `${appOrigin()}/auth/callback` },
  })
  return { data, error }
}

export async function signInWithOAuth(provider) {
  if (!supabase) return NOT_CONFIGURED
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${appOrigin()}/auth/callback` },
  })
  return { data, error }
}

export async function fetchOwnEmail() {
  if (!supabase) return { email: null, error: NOT_CONFIGURED.error }
  const { data, error } = await supabase.auth.getUser()
  return { email: data?.user?.email ?? null, error }
}
