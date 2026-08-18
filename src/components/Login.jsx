import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Github } from './ui/Icons.jsx'

function MailIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  )
}

function LockIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="3" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const validate = () => {
    const e = {}
    if (!email.trim()) {
      e.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address.'
    }
    if (!password) {
      e.password = 'Please enter your password.'
    } else if (password.length < 6) {
      e.password = 'Password must contain at least 6 characters.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1800)
  }

  return (
    <div className="auth">
      <div className="auth__topbar">
        <Link to="/" className="auth__topbar-brand">AADI HUB</Link>
        <Link to="/" className="auth__topbar-back">Back to AADI HUB</Link>
      </div>

      <div className="auth__visual">
        <img
          src="/loginimg.png"
          alt="AADI HUB — the youth ecosystem for the next generation"
        />
        <div className="auth__brand">
          <span className="auth__brand-line">Your <em>people.</em></span>
          <span className="auth__brand-line">Your <em>journey.</em></span>
          <span className="auth__brand-line">Your <em>next.</em></span>
        </div>
      </div>

      <div className="auth__form-panel">
        <div className="auth__inner">
          {submitted ? (
            <div className="auth__demo">
              <span className="auth__demo-label">Demo Mode</span>
              <h3 className="auth__heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>Welcome back.</h3>
              <p>Your AADI journey is ready to continue.</p>
              <p style={{ marginTop: 8, fontSize: '0.78rem' }}>
                Authentication will be connected when the backend is ready.
              </p>
            </div>
          ) : (
            <>
              <span className="auth__eyebrow">Welcome to AADI</span>
              <h1 className="auth__heading">Welcome back.</h1>
              <p className="auth__sub">Continue your journey with AADI HUB.</p>

              <form className="auth__form" onSubmit={handleSubmit} noValidate>
                <div className="auth__field">
                  <label htmlFor="login-email">Email</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><MailIcon size={17} /></span>
                    <input
                      id="login-email"
                      type="email"
                      className={`auth__input${errors.email ? ' auth__input--error' : ''}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })) }}
                      autoComplete="email"
                    />
                  </div>
                  <span className="auth__error">{errors.email || ''}</span>
                </div>

                <div className="auth__field">
                  <label htmlFor="login-password">Password</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><LockIcon size={17} /></span>
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      className={`auth__input${errors.password ? ' auth__input--error' : ''}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })) }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="auth__toggle-pw"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                    </button>
                  </div>
                  <span className="auth__error">{errors.password || ''}</span>
                </div>

                <button
                  type="button"
                  className="auth__forgot"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  className="auth__btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="auth__btn-spinner" />
                      Signing in...
                    </>
                  ) : 'Login'}
                </button>
              </form>

              <div className="auth__divider"><span>OR</span></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button type="button" className="auth__social-btn" onClick={() => alert('Authentication is coming soon.')}>
                  <span className="auth__social-icon"><GoogleIcon /></span>
                  Continue with Google
                </button>
                <button type="button" className="auth__social-btn" onClick={() => alert('Authentication is coming soon.')}>
                  <span className="auth__social-icon"><Github size={18} /></span>
                  Continue with GitHub
                </button>
              </div>

              <p className="auth__switch">
                Don&apos;t have an AADI account? <Link to="/register">Create one</Link>
              </p>
            </>
          )}
        </div>
      </div>

      {showForgot && (
        <div className="auth__modal-backdrop" onClick={() => setShowForgot(false)}>
          <div className="auth__modal" onClick={(e) => e.stopPropagation()}>
            <h3>Forgot password?</h3>
            <p>Password recovery will be available when AADI authentication is connected.</p>
            <button className="auth__modal-btn" onClick={() => setShowForgot(false)}>
              Back to login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
