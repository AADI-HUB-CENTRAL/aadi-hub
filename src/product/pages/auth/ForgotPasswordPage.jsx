import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductLogo, Button, Field, TextInput, InlineError, InlineSuccess, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame } from './LoginPage.jsx'
import { requestPasswordReset } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'

/* ---------------------------------------------------------------------------
   Forgot password — only claims an email was sent if the provider said so.
--------------------------------------------------------------------------- */

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validateEmail(email)) {
      setFieldError('Enter a valid email address.')
      return
    }
    setFieldError('')
    if (loading) return

    setLoading(true)
    const { error } = await requestPasswordReset(email)
    setLoading(false)

    if (error) {
      // Never say "email sent" when the provider failed.
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
          <h1 className="auth-card__title">Reset your password</h1>
          <p className="auth-card__sub">
            {sent
              ? 'If this email is registered, a reset link is on its way.'
              : 'Enter the email registered with your account.'}
          </p>
        </div>

        {sent ? (
          <>
            <InlineSuccess>
              Check your inbox for a password reset link. It expires after a short time —
              request a new one if it does.
            </InlineSuccess>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <Button variant="secondary" full onClick={() => { setSent(false); setError('') }}>
                Send again
              </Button>
              <Link to="/login" className="auth-form__foot" style={{ marginTop: 0 }}>
                Back to <b style={{ color: 'var(--kiwi-400)' }}>sign in</b>
              </Link>
            </div>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <InlineError>{error}</InlineError>
            <Field label="Email address" required error={fieldError}>
              {({ id }) => (
                <TextInput
                  id={id} type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.edu" autoComplete="email"
                  autoCapitalize="off" spellCheck={false} error={fieldError}
                />
              )}
            </Field>
            <Button type="submit" size="lg" full loading={loading}>Send reset link</Button>
          </form>
        )}

        <p className="auth-form__foot">
          Remembered it? <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </AuthFrame>
  )
}
