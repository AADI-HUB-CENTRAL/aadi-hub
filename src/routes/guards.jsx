import { useState } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PageState, Spinner } from '../product/ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Route guards
   ---------------------------------------------------------------------------
   These are UX only. They are NOT a security boundary. Row Level Security in
   PostgreSQL is what actually protects data. See docs/supabase-architecture.md.

   When the backend is not configured there is no session, so protected routes
   redirect to /login, which renders an honest configuration notice.
--------------------------------------------------------------------------- */

export function RequireAuth({ children, allowIncompleteOnboarding = false }) {
  const { status, isAuthenticated, profile, profileStatus, profileError, refreshProfile } = useAuth()
  const location = useLocation()
  const [retrying, setRetrying] = useState(false)

  async function handleRetry() {
    setRetrying(true)
    await refreshProfile()
    setRetrying(false)
  }

  if (status === 'loading') return <Spinner label="Checking your session…" />

  if (!isAuthenticated) {
    // Preserve where the user was heading so login can send them back.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  if (profileStatus === 'loading' || profileStatus === 'idle') {
    return <Spinner label="Loading your AADI identity…" />
  }

  if (profileStatus === 'error') {
    const msg = profileError || ''
    const needsMigration = /create_missing_profile|PGRST202|does not exist|schema cache/i.test(msg)
    return (
      <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <PageState
          title="We could not set up your AADI profile yet."
          body={needsMigration
            ? 'Your account is verified, but the database recovery function is missing. Apply migrations 20261016000002 and 20261016000003 in Supabase, then try again.'
            : `The database returned an error: ${msg || 'unknown error'}. Try again — if it persists, check your connection and the database migrations.`}
          action={
            <button
              className="p-btn p-btn--primary p-btn--md"
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? 'Trying again…' : 'Try again'}
            </button>
          }
        />
      </div>
    )
  }

  if (profileStatus === 'missing') {
    // Recovery ran but the row is still absent — a rare, inconsistent state.
    // Offer a manual retry rather than a dead end.
    return (
      <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <PageState
          title="We could not set up your AADI profile yet."
          body="Your account is verified, but its profile row is still missing. Try again — if it persists, re-apply the profile recovery migration."
          action={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="p-btn p-btn--primary p-btn--md"
                onClick={handleRetry}
                disabled={retrying}
              >
                {retrying ? 'Trying again…' : 'Try again'}
              </button>
              <button className="p-btn p-btn--ghost p-btn--md" onClick={() => window.location.reload()}>
                Reload
              </button>
            </div>
          }
        />
      </div>
    )
  }

  if (!allowIncompleteOnboarding && profile && !profile.onboarding_completed_at) {
    return <Navigate to="/onboarding" replace />
  }

  return children ? children : <Outlet />
}

export function RedirectIfAuthed({ children }) {
  const { status, isAuthenticated, profile, profileStatus } = useAuth()
  const location = useLocation()

  if (status === 'loading') return children ? children : <Outlet />

  if (isAuthenticated) {
    if (profileStatus === 'loading' || profileStatus === 'idle') {
      return <Spinner label="Taking you to your dashboard…" />
    }
    // A missing or errored profile is resolved by RequireAuth (which can run
    // recovery); send the user there so the two guards cannot bounce a
    // half-loaded account back and forth.
    if (profileStatus === 'missing' || profileStatus === 'error') {
      return <Navigate to="/dashboard" replace />
    }
    // Incomplete onboarding always wins over the "from" destination.
    if (profile && !profile.onboarding_completed_at) {
      return <Navigate to="/onboarding" replace />
    }
    const from = location.state?.from
    return <Navigate to={from && from !== '/login' && from !== '/register' ? from : '/dashboard'} replace />
  }

  return children ? children : <Outlet />
}

export function NotFound() {
  return (
    <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <PageState
        title="This page does not exist."
        body="The link may be broken, or the page may have been moved."
        action={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="p-btn p-btn--primary p-btn--md">Back to AADI HUB</Link>
            <Link to="/dashboard" className="p-btn p-btn--ghost p-btn--md">Go to dashboard</Link>
          </div>
        }
      />
    </div>
  )
}
