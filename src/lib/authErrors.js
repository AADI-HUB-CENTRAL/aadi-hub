/* ---------------------------------------------------------------------------
   Auth error messages
   ---------------------------------------------------------------------------
   Supabase returns technical error strings and sometimes details whether an
   email exists. We translate to friendly text and intentionally keep
   login failures generic so the UI never confirms whether an email or
   password was the wrong part.
--------------------------------------------------------------------------- */

const MESSAGES = {
  invalid_credentials: 'Email or password is incorrect.',
  invalid_grant: 'Email or password is incorrect.',
  email_not_confirmed: 'Please verify your email address before signing in.',
  email_exists: 'An account with this email already exists. Try signing in instead.',
  user_already_exists: 'An account with this email already exists. Try signing in instead.',
  weak_password: 'That password is too weak. Use at least 8 characters.',
  over_email_send_rate_limit: 'Too many emails requested. Please wait a few minutes and try again.',
  over_request_rate_limit: 'Too many attempts. Please wait a moment and try again.',
  signup_disabled: 'New signups are currently disabled.',
  user_not_found: 'Email or password is incorrect.',
  same_password: 'Your new password must be different from your current password.',
  otp_expired: 'That link has expired. Please request a new one.',
  session_not_found: 'Your session has expired. Please sign in again.',
  validation_failed: 'Please check the details you entered and try again.',
  not_configured: 'AADI HUB is not connected to its database yet, so accounts are unavailable.',
}

/** Map a Supabase / network error into a safe, friendly message. */
export function friendlyAuthError(error) {
  if (!error) return 'Something went wrong. Please try again.'

  const code = error.code || error.error_code || ''
  if (code && MESSAGES[code]) return MESSAGES[code]

  const raw = String(error.message || '').toLowerCase()

  if (raw.includes('failed to fetch') || raw.includes('networkerror')) {
    return 'Could not reach the server. Check your internet connection and try again.'
  }
  if (raw.includes('email not confirmed')) {
    return MESSAGES.email_not_confirmed
  }
  if (raw.includes('already registered') || raw.includes('already exists')) {
    return MESSAGES.email_exists
  }
  if (raw.includes('invalid login credentials')) {
    return MESSAGES.invalid_credentials
  }
  if (raw.includes('password should be at least')) {
    return MESSAGES.weak_password
  }
  if (raw.includes('rate limit') || raw.includes('too many')) {
    return MESSAGES.over_request_rate_limit
  }

  return 'Something went wrong. Please try again.'
}
