import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Field, TextInput, InlineError, InlineSuccess, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame, NotConfiguredNotice } from './AuthFrame.jsx'
import { resendVerificationEmail, fetchOwnEmail } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'
import { useAuth } from '../../../context/AuthContext.jsx'

/* ---------------------------------------------------------------------------
   Verify email — shown when a student signs up with confirmation enabled.
   Resends only when the provider supports it and the call succeeds.
--------------------------------------------------------------------------- */

export default function VerifyEmailPage() {
  const location = useLocation()
  const { configured } = useAuth()
  const [email, setEmail] = useState(String(location.state?.email || ''))
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(Boolean(location.state?.email))

  // Prefill with the address Supabase knows about, if a session exists.
  useState(() => {
    if (location.state?.email) return
    fetchOwnEmail().then(({ email: own }) => { if (own) setEmail(own) })
  })

  async function handleResend(e) {
    e.preventDefault()
    setError('')
    if (!validateEmail(email)) {
      setError('Enter the email you signed up with.')
      return
    }
    if (loading) return
    setLoading(true)
    const { error } = await resendVerificationEmail(email)
    setLoading(false)
    if (error) {
      setError(friendlyAuthError(error))
      return
    }
    setSent(true)
  }

  return (
    <AuthFrame
      title="Verify your email"
      subtitle="One quick step: confirm your email address to activate your AADI ID."
      footer={
        <p>
          <Link to="/">Back to home</Link>
        </p>
      }
    >
      {!configured ? (
        <NotConfiguredNotice what="Email verification" />
      ) : (
      <div className="asp-stack">
        <div className="p-inline-success">
          We sent a verification link to your inbox. Open it on this device to finish
          signing up. The link expires — you can request a new one below.
        </div>

        <InlineError>{error}</InlineError>
        {sent && <InlineSuccess>Verification email sent again. Check your inbox.</InlineSuccess>}

        {!expanded ? (
          <Button variant="secondary" full onClick={() => setExpanded(true)}>
            Use a different email / resend
          </Button>
        ) : (
          <form className="asp-form" onSubmit={handleResend} noValidate>
            <Field label="Email address" required>
              {({ id }) => (
                <TextInput id={id} type="email" name="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.edu" autoComplete="email"
                  autoCapitalize="off" spellCheck={false} />
              )}
            </Field>
            <Button type="submit" full loading={loading}>Resend verification email</Button>
          </form>
        )}

        <p className="asp-note">
          Wrong address? <Link to="/register" className="asp-link">Create an account with the right one</Link>
        </p>
      </div>
      )}
    </AuthFrame>
  )
}
