import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Field, TextInput, InlineError, InlineSuccess, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame, NotConfiguredNotice } from './AuthFrame.jsx'
import { requestPasswordReset } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'
import { useAuth } from '../../../context/AuthContext.jsx'

/* ---------------------------------------------------------------------------
   Forgot password — only claims an email was sent if the provider said so.
--------------------------------------------------------------------------- */

export default function ForgotPasswordPage() {
  const { configured } = useAuth()
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
    <AuthFrame
      title="Reset your password"
      subtitle={sent
        ? 'If this email is registered, a reset link is on its way.'
        : 'Enter the email registered with your account.'}
      footer={
        <>
          <p>
            Remembered it? <Link to="/login">Back to sign in</Link>
          </p>
          <p>
            <Link to="/">Back to home</Link>
          </p>
        </>
      }
    >
      {!configured ? (
        <NotConfiguredNotice what="Password reset" />
      ) : sent ? (
        <div className="asp-stack asp-stack--tight">
          <InlineSuccess>
            Check your inbox for a password reset link. It expires after a short time —
            request a new one if it does.
          </InlineSuccess>
          <Button variant="secondary" full onClick={() => { setSent(false); setError('') }}>
            Send again
          </Button>
        </div>
      ) : (
        <form className="asp-form" onSubmit={handleSubmit} noValidate>
          <InlineError>{error}</InlineError>
          <Field label="Email address" required error={fieldError}>
            {({ id }) => (
              <TextInput
                id={id} type="email" name="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@college.edu" autoComplete="email"
                autoCapitalize="off" spellCheck={false} error={fieldError}
              />
            )}
          </Field>
          <Button type="submit" size="lg" full loading={loading}>Send reset link</Button>
        </form>
      )}
    </AuthFrame>
  )
}
