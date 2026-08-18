import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Graduation } from './ui/Icons.jsx'

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

function UserIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const INTERESTS = ['Technology', 'AI', 'Data', 'Design', 'Content', 'Business', 'Startups', 'Gaming', 'Creative']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', college: '' })
  const [interests, setInterests] = useState([])
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const toggleInterest = (tag) => {
    setInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim()) {
      e.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      e.password = 'Please enter a password.'
    } else if (form.password.length < 8) {
      e.password = 'Password must contain at least 8 characters.'
    }
    if (!form.confirm) {
      e.confirm = 'Please confirm your password.'
    } else if (form.confirm !== form.password) {
      e.confirm = 'Passwords do not match.'
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
    }, 2000)
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
              <h3 className="auth__heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>Your AADI identity starts here.</h3>
              <p>Registration flow is ready for backend integration.</p>
              <p style={{ marginTop: 8, fontSize: '0.78rem' }}>
                No account has been created yet.
              </p>
            </div>
          ) : (
            <>
              <span className="auth__eyebrow">Create your AADI ID</span>
              <h1 className="auth__heading">Create your AADI identity.</h1>
              <p className="auth__sub">Start building your journey with AADI HUB.</p>

              <form className="auth__form" onSubmit={handleSubmit} noValidate>
                <div className="auth__field">
                  <label htmlFor="reg-name">Full name</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><UserIcon size={17} /></span>
                    <input
                      id="reg-name"
                      type="text"
                      className={`auth__input${errors.name ? ' auth__input--error' : ''}`}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <span className="auth__error">{errors.name || ''}</span>
                </div>

                <div className="auth__field">
                  <label htmlFor="reg-email">Email</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><MailIcon size={17} /></span>
                    <input
                      id="reg-email"
                      type="email"
                      className={`auth__input${errors.email ? ' auth__input--error' : ''}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <span className="auth__error">{errors.email || ''}</span>
                </div>

                <div className="auth__field">
                  <label htmlFor="reg-password">Password</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><LockIcon size={17} /></span>
                    <input
                      id="reg-password"
                      type={showPw ? 'text' : 'password'}
                      className={`auth__input${errors.password ? ' auth__input--error' : ''}`}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      autoComplete="new-password"
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

                <div className="auth__field">
                  <label htmlFor="reg-confirm">Confirm password</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><LockIcon size={17} /></span>
                    <input
                      id="reg-confirm"
                      type={showConfirmPw ? 'text' : 'password'}
                      className={`auth__input${errors.confirm ? ' auth__input--error' : ''}`}
                      placeholder="Re-enter password"
                      value={form.confirm}
                      onChange={(e) => set('confirm', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="auth__toggle-pw"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPw ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                    </button>
                  </div>
                  <span className="auth__error">{errors.confirm || ''}</span>
                </div>

                <div className="auth__field">
                  <label htmlFor="reg-college">College / School</label>
                  <div className="auth__input-wrap">
                    <span className="auth__input-icon"><Graduation size={17} /></span>
                    <input
                      id="reg-college"
                      type="text"
                      className="auth__input"
                      placeholder="Optional"
                      value={form.college}
                      onChange={(e) => set('college', e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth__field">
                  <label>Interests</label>
                  <div className="auth__interests">
                    {INTERESTS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`auth__interest${interests.includes(tag) ? ' auth__interest--active' : ''}`}
                        onClick={() => toggleInterest(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="auth__btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="auth__btn-spinner" />
                      Creating account...
                    </>
                  ) : 'Create AADI Account'}
                </button>
              </form>

              <p className="auth__terms">
                By continuing, you agree to the AADI HUB terms and community guidelines.
              </p>

              <p className="auth__switch">
                Already part of AADI? <Link to="/login">Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
