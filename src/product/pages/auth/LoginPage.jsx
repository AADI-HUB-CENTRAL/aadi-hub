import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Field, TextInput, PasswordInput, InlineError, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame, NotConfiguredNotice } from './AuthFrame.jsx'
import { signInWithPassword } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'
import { useAuth } from '../../../context/AuthContext.jsx'

/** Validates a recovery/verification session shape before rendering forms. */
export function hasRecoverySession() {
  try {
    const raw = window.localStorage.getItem('aadi-auth')
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Boolean(parsed?.session)
  } catch {
    return false
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from

  function safeDest() {
    return from && typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
      ? from
      : '/dashboard'
  }

  function validate() {
    const next = {}
    if (!validateEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validate() || loading) return

    setLoading(true)
    const { error } = await signInWithPassword(email, password)
    setLoading(false)

    if (error) {
      setFormError(friendlyAuthError(error))
      return
    }

    // Session exists now; guards decide where to land (onboarding vs app).
    navigate(safeDest(), { replace: true })
  }

  return (
    <AuthFrame
      title="Welcome back"
      subtitle="Sign in to continue to your AADI HUB ecosystem."
      footer={
        <>
          <p>
            New to AADI HUB? <Link to="/register">Create an account</Link>
          </p>
          <p>
            <Link to="/">Back to home</Link>
          </p>
        </>
      }
    >
      {!configured ? (
        <NotConfiguredNotice what="Sign-in" />
      ) : (
        <form className="asp-form" onSubmit={handleSubmit} noValidate>
          <InlineError>{formError}</InlineError>

          <Field label="Email address" required error={errors.email}>
            {({ id }) => (
              <TextInput
                id={id} type="email" name="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@college.edu"
                autoComplete="email"
                autoCapitalize="off"
                spellCheck={false}
                error={errors.email}
              />
            )}
          </Field>

          <Field label="Password" required error={errors.password}>
            {({ id }) => (
              <PasswordInput
                id={id} value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Your password"
                autoComplete="current-password"
              />
            )}
          </Field>

          <div className="asp-row-end">
            <Link to="/forgot-password" className="asp-link">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" full loading={loading}>Log in</Button>
        </form>
      )}
    </AuthFrame>
  )
}
