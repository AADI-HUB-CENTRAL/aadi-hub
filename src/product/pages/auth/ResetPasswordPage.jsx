import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductLogo, Button, Field, PasswordInput, InlineError, InlineSuccess } from '../../ui/kit.jsx'
import { AuthFrame } from './LoginPage.jsx'
import { updatePassword } from '../../../features/auth/authApi.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'
import { supabase } from '../../../lib/supabase.js'

/* ---------------------------------------------------------------------------
   Reset password — runs inside the recovery session Supabase creates when
   the user clicks the emailed link. Handles expired/invalid sessions by
   telling the user what to do instead of rendering a dead form.
--------------------------------------------------------------------------- */

const PW_MIN = 8

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionState, setSessionState] = useState('checking') // checking | ok | invalid

  useEffect(() => {
    let active = true
    if (!supabase) {
      setSessionState('invalid')
      return undefined
    }
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return
        // A PASSWORD_RECOVERY event marks this session as reset-capable.
        if (error || !data?.session) setSessionState('invalid')
        else setSessionState('ok')
      })
      .catch(() => { if (active) setSessionState('invalid') })
    return () => { active = false }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const next = {}
    if (password.length < PW_MIN) next.password = `Use at least ${PW_MIN} characters.`
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) next.password = 'Include at least one letter and one number.'
    if (confirm !== password) next.confirm = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length > 0 || loading) return

    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)

    if (error) {
      setFormError(friendlyAuthError(error))
      return
    }
    setDone(true)
    // New password is active; return to login per the flow requirement.
    setTimeout(() => navigate('/login', { replace: true }), 1800)
  }

  return (
    <AuthFrame>
      <div className="auth-card">
        <div className="auth-card__head">
          <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={30} size={19} /></Link>
          <h1 className="auth-card__title">Choose a new password</h1>
          <p className="auth-card__sub">This replaces your old password everywhere you are signed in.</p>
        </div>

        {sessionState === 'checking' && (
          <p style={{ textAlign: 'center', color: 'var(--muted-on-dark)', fontSize: 14 }}>
            Checking your reset link…
          </p>
        )}

        {sessionState === 'invalid' && (
          <>
            <InlineError>
              This password reset link is invalid, expired, or already used.
              Request a new one to continue.
            </InlineError>
            <div style={{ marginTop: 16 }}>
              <Link to="/forgot-password" className="p-btn p-btn--primary p-btn--md p-btn--full">
                Request a new link
              </Link>
            </div>
          </>
        )}

        {sessionState === 'ok' && done && (
          <InlineSuccess>Password updated. Taking you to sign in…</InlineSuccess>
        )}

        {sessionState === 'ok' && !done && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <InlineError>{formError}</InlineError>

            <Field label="New password" required error={errors.password}>
              {({ id }) => (
                <PasswordInput id={id} value={password} onChange={e => setPassword(e.target.value)}
                  error={errors.password} placeholder="New password" autoComplete="new-password" />
              )}
            </Field>

            <ul className="pw-rules" aria-label="Password requirements">
              <li className={password.length >= PW_MIN ? 'ok' : ''}>
                <span className="pw-rules__mark">{password.length >= PW_MIN ? '✓' : '•'}</span>
                At least {PW_MIN} characters
              </li>
              <li className={(/[A-Za-z]/.test(password) && /\d/.test(password)) ? 'ok' : ''}>
                <span className="pw-rules__mark">{(/[A-Za-z]/.test(password) && /\d/.test(password)) ? '✓' : '•'}</span>
                A letter and a number
              </li>
              <li className={confirm && confirm === password ? 'ok' : ''}>
                <span className="pw-rules__mark">{confirm && confirm === password ? '✓' : '•'}</span>
                Passwords match
              </li>
            </ul>

            <Field label="Confirm new password" required error={errors.confirm}>
              {({ id }) => (
                <PasswordInput id={id} value={confirm} onChange={e => setConfirm(e.target.value)}
                  error={errors.confirm} placeholder="Repeat the new password" autoComplete="new-password" />
              )}
            </Field>

            <Button type="submit" size="lg" full loading={loading}>Update password</Button>
          </form>
        )}

        <p className="auth-form__foot">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </AuthFrame>
  )
}
