/* ---------------------------------------------------------------------------
   Shared client-side validation
   ---------------------------------------------------------------------------
   These checks improve the experience only. The database has its own
   constraints and RLS, and Supabase Auth validates credentials server-side.
   Never treat a client-side check as security.
--------------------------------------------------------------------------- */

export const PASSWORD_MIN_LENGTH = 8

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim())
}

/** Returns true when the password meets the minimum rules. */
export function isValidPassword(value) {
  return String(value || '').length >= PASSWORD_MIN_LENGTH
}

/** Rough strength score 0-3 for the UI meter. Not a security control. */
export function passwordStrength(value) {
  const v = String(value || '')
  let score = 0
  if (v.length >= PASSWORD_MIN_LENGTH) score += 1
  if (v.length >= 12) score += 1
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score += 1
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) score += 1
  return Math.min(score, 3)
}

export const PASSWORD_STRENGTH_LABELS = ['Too short', 'Weak', 'Good', 'Strong']

/** Normalise names and clamp to the same limits the database enforces. */
export function cleanText(value, max) {
  const v = String(value ?? '').replace(/\s+/g, ' ').trim()
  return max ? v.slice(0, max) : v
}

export function cleanMultiline(value, max) {
  const v = String(value ?? '').trim()
  return max ? v.slice(0, max) : v
}

/** Only allow http(s) URLs. Blocks javascript:, data: and other schemes. */
export function sanitizeUrl(value) {
  const v = String(value || '').trim()
  if (!v) return ''
  try {
    const parsed = new URL(v)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return ''
    return parsed.toString()
  } catch {
    return ''
  }
}

export function isValidHandleSlug(value) {
  return /^[a-z0-9-]{2,60}$/.test(String(value || ''))
}
