import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner, InlineError } from '../../ui/kit.jsx'
import { AuthFrame } from './AuthFrame.jsx'
import { supabase } from '../../../lib/supabase.js'
import { friendlyAuthError } from '../../../lib/authErrors.js'

/* ---------------------------------------------------------------------------
   Auth callback — handles email confirmation and OAuth redirects.
   Reports the actual outcome; never pretends verification succeeded.

   Once a session is restored we hand off to the route guards by navigating to
   /dashboard. The guards own the session → profile → onboarding → dashboard
   decision, so this page must NOT jump straight to a destination that assumes
   a completed profile: that is what made an incomplete or freshly-recovered
   account land on the "profile does not exist" wall.
--------------------------------------------------------------------------- */

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    if (!supabase) {
      setError('This deployment is not connected to its authentication service, so sign-in links cannot be processed.')
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
          // Let RequireAuth resolve profile + onboarding state. It shows a
          // loading state while the profile loads and recovers it if missing,
          // then routes to /onboarding or /dashboard as appropriate.
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
    <AuthFrame
      title={error ? 'Link not accepted' : 'Confirming your link…'}
      subtitle="Verifying the link you opened — one moment."
      footer={
        <p>
          <Link to="/">Back to home</Link>
        </p>
      }
    >
      {error ? (
        <div className="asp-stack">
          <InlineError>{error}</InlineError>
          <Link to="/login" className="p-btn p-btn--primary p-btn--md p-btn--full">Go to sign in</Link>
          <Link to="/register" className="p-btn p-btn--ghost p-btn--md p-btn--full">Create a new account</Link>
        </div>
      ) : (
        <div className="asp-center">
          <Spinner label="Verifying…" />
        </div>
      )}
    </AuthFrame>
  )
}
