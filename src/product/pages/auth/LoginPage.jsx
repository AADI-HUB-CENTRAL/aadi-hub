import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ProductLogo, Button, Field, TextInput, PasswordInput, InlineError, validateEmail } from '../../ui/kit.jsx'
import { signInWithPassword } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'

/* Shared top bar + card frame for every public auth screen. */
export function AuthFrame({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-page__bar">
        <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={24} size={17} /></Link>
        <Link to="/form" className="auth-page__bar-link">Need an account? <b>Get early access</b></Link>
      </div>
      <div className="auth-page__body">{children}</div>
    </div>
  )
}

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from

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
    const dest = from && typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
      ? from
      : '/dashboard'
    navigate(dest, { replace: true })
  }

  return (
    <AuthFrame>
      <div className="auth-card">
        <div className="auth-card__head">
          <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={30} size={19} /></Link>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__sub">Sign in to your AADI HUB account.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <div style={{ textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--kiwi-400)', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" full loading={loading}>Sign in</Button>
        </form>

        <p className="auth-form__foot">
          New to AADI HUB? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </AuthFrame>
  )
}
