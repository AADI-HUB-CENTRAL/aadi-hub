import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductLogo, Button, Field, TextInput, InlineError, InlineSuccess, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame } from './LoginPage.jsx'
import { resendVerificationEmail, fetchOwnEmail } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'

/* ---------------------------------------------------------------------------
   Verify email — shown when a student signs up with confirmation enabled.
   Resends only when the provider supports it and the call succeeds.
--------------------------------------------------------------------------- */

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Prefill with the address Supabase knows about, if a session exists.
  useState(() => {
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
    <AuthFrame>
      <div className="auth-card">
        <div className="auth-card__head">
          <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={30} size={19} /></Link>
          <h1 className="auth-card__title">Verify your email</h1>
          <p className="auth-card__sub">
            One quick step: confirm your email address to activate your AADI ID.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
            <form className="auth-form" onSubmit={handleResend} noValidate>
              <Field label="Email address" required>
                {({ id }) => (
                  <TextInput id={id} type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.edu" autoComplete="email"
                    autoCapitalize="off" spellCheck={false} />
                )}
              </Field>
              <Button type="submit" full loading={loading}>Resend verification email</Button>
            </form>
          )}

          <p className="auth-note">
            Wrong address? <Link to="/register" style={{ color: 'var(--kiwi-400)', fontWeight: 600 }}>Create an account with the right one</Link>
          </p>
        </div>
      </div>
    </AuthFrame>
  )
}
