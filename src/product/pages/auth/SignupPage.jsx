import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field, TextInput, PasswordInput, InlineError, validateEmail } from '../../ui/kit.jsx'
import { AuthFrame, NotConfiguredNotice } from './AuthFrame.jsx'
import { signUpWithPassword } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'
import { useAuth } from '../../../context/AuthContext.jsx'

/* ---------------------------------------------------------------------------
   Signup — real Supabase registration. The message after submit reflects
   exactly what the provider returned: a session (confirmation disabled) or a
   verification-pending handoff (confirmation enabled).
--------------------------------------------------------------------------- */

const PW_MIN = 8

export default function SignupPage() {
  const navigate = useNavigate()
  const { configured } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
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
    // Confirmation enabled — hand off to the verification-pending screen.
    navigate('/verify-email', { replace: true, state: { email: form.email.trim() } })
  }

  return (
    <AuthFrame
      title="Create your AADI account"
      subtitle="Claim your permanent AADI ID in a few minutes."
      footer={
        <>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <p>
            <Link to="/">Back to home</Link>
          </p>
        </>
      }
    >
      {!configured ? (
        <NotConfiguredNotice what="Registration" />
      ) : (
        <form className="asp-form" onSubmit={handleSubmit} noValidate>
          <InlineError>{formError}</InlineError>

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

          <p className="asp-fineprint">
            Use an email you can access — your verification link arrives there. One set of
            credentials covers your whole AADI HUB journey.
          </p>

          <Button type="submit" size="lg" full loading={loading}>Create account</Button>
        </form>
      )}
    </AuthFrame>
  )
}
