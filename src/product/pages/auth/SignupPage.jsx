import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductLogo, Button, Field, TextInput, PasswordInput, InlineError, InlineSuccess, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame } from './LoginPage.jsx'
import { signUpWithPassword, resendVerificationEmail } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'

/* ---------------------------------------------------------------------------
   Signup — real Supabase registration. Never fakes success; the message
   after submit reflects what the provider actually returned.
--------------------------------------------------------------------------- */

const PW_MIN = 8

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const pwLong = form.password.length >= PW_MIN
  const pwMixed = /[A-Za-z]/.test(form.password) && /\d/.test(form.password)
  const pwMatch = form.confirm.length > 0 && form.password === form.confirm

  function validate() {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!validateEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!pwLong) next.password = `Use at least ${PW_MIN} characters.`
    else if (!pwMixed) next.password = 'Include at least one letter and one number.'
    if (!form.confirm) next.confirm = 'Confirm your password.'
    else if (form.password !== form.confirm) next.confirm = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSuccess('')
    if (!validate() || loading) return

    setLoading(true)
    const { data, error } = await signUpWithPassword({
      email: form.email,
      password: form.password,
      fullName: form.name.trim(),
    })
    setLoading(false)

    if (error) {
      setFormError(friendlyAuthError(error))
      return
    }

    // Supabase returns different shapes depending on whether email
    // confirmation is enabled. Report exactly what happened.
    const session = data?.session
    const user = data?.user
    if (session) {
      // Confirmation disabled — session issued. Guards will run onboarding.
      navigate('/onboarding', { replace: true })
      return
    }
    if (user?.identities?.length === 0) {
      setFormError('An account with this email already exists. Try signing in instead.')
      return
    }
    setSuccess(
      'Account created. Check your inbox for a verification link, then sign in.'
    )
  }

  return (
    <AuthFrame>
      <div className="auth-card">
        <div className="auth-card__head">
          <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={30} size={19} /></Link>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__sub">Claim your permanent AADI ID in a few minutes.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <InlineError>{formError}</InlineError>
          <InlineSuccess>{success}</InlineSuccess>

          {success ? (
            <Button
              type="button" variant="secondary" full
              onClick={async () => {
                setFormError('')
                const { error } = await resendVerificationEmail(form.email)
                if (error) setFormError(friendlyAuthError(error))
                else setSuccess('Verification email sent again. Check your inbox.')
              }}
            >
              Resend verification email
            </Button>
          ) : (
            <>
              <Field label="Full name" required error={errors.name}>
                {({ id }) => (
                  <TextInput id={id} name="name" value={form.name} onChange={set('name')}
                    placeholder="Your full name" autoComplete="name"
                    error={errors.name} />
                )}
              </Field>

              <Field label="Email address" required error={errors.email}>
                {({ id }) => (
                  <TextInput id={id} type="email" name="email" value={form.email} onChange={set('email')}
                    placeholder="you@college.edu" autoComplete="email" autoCapitalize="off" spellCheck={false}
                    error={errors.email} />
                )}
              </Field>

              <Field label="Password" required error={errors.password}>
                {({ id }) => (
                  <PasswordInput id={id} value={form.password} onChange={set('password')}
                    error={errors.password} placeholder="Create a password" autoComplete="new-password" />
                )}
              </Field>

              <ul className="pw-rules" aria-label="Password requirements">
                <li className={pwLong ? 'ok' : ''}>
                  <span className="pw-rules__mark">{pwLong ? '✓' : '•'}</span>
                  At least {PW_MIN} characters
                </li>
                <li className={pwMixed ? 'ok' : ''}>
                  <span className="pw-rules__mark">{pwMixed ? '✓' : '•'}</span>
                  A letter and a number
                </li>
                <li className={pwMatch ? 'ok' : ''}>
                  <span className="pw-rules__mark">{pwMatch ? '✓' : '•'}</span>
                  Passwords match
                </li>
              </ul>

              <Field label="Confirm password" required error={errors.confirm}>
                {({ id }) => (
                  <PasswordInput id={id} name="confirm-password" value={form.confirm} onChange={set('confirm')}
                    error={errors.confirm} placeholder="Repeat your password" autoComplete="new-password" />
                )}
              </Field>

              <Button type="submit" size="lg" full loading={loading}>Create account</Button>
            </>
          )}
        </form>

        <p className="auth-form__foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthFrame>
  )
}
