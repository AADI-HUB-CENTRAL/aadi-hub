import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductLogo, Spinner } from '../../ui/kit.jsx'
import { AuthFrame } from './LoginPage.jsx'
import { supabase } from '../../../lib/supabase.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'

/* ---------------------------------------------------------------------------
   Auth callback — handles email confirmation and OAuth redirects.
   Reports the actual outcome; never pretends verification succeeded.
--------------------------------------------------------------------------- */

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    if (!supabase) {
      setError('AADI HUB is not connected to its database yet, so sign-in links cannot be processed.')
      return undefined
    }

    // detectSessionInUrl parses the hash fragment; getSession picks it up.
    supabase.auth.getSession()
      .then(async ({ data, error: sessionError }) => {
        if (!active) return
        if (sessionError) {
          setError(friendlyAuthError(sessionError))
          return
        }
        if (data?.session) {
          navigate('/dashboard', { replace: true })
          return
        }
        // No session: the link may be expired or already used.
        const hash = window.location.hash || ''
        if (hash.includes('error_description') || hash.includes('error=')) {
          setError('This sign-in link is invalid or has expired. Please sign in again or request a new email.')
          return
        }
        setError('This link could not be verified. Please sign in again or request a new link.')
      })
      .catch(err => { if (active) setError(friendlyAuthError(err)) })

    return () => { active = false }
  }, [navigate])

  return (
    <AuthFrame>
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-card__head">
          <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={30} size={19} /></Link>
          <h1 className="auth-card__title">{error ? 'Link not accepted' : 'Confirming your link…'}</h1>
        </div>

        {error ? (
          <>
            <p className="p-inline-error" role="alert">{error}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              <Link to="/login" className="p-btn p-btn--primary p-btn--md p-btn--full">Go to sign in</Link>
              <Link to="/register" className="p-btn p-btn--ghost p-btn--md p-btn--full">Create a new account</Link>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <Spinner label="Verifying…" />
          </div>
        )}
      </div>
    </AuthFrame>
  )
}
