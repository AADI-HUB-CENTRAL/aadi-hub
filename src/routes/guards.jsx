import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase.js'
import { PageState, Spinner } from '../product/ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Route guards
   ---------------------------------------------------------------------------
   These are UX only. They are NOT a security boundary. Row Level Security in
   PostgreSQL is what actually protects data. See docs/supabase-architecture.md.
--------------------------------------------------------------------------- */

function SetupNeeded() {
  return (
    <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <PageState
        title="AADI HUB is not connected to a database yet."
        body={SUPABASE_NOT_CONFIGURED_MESSAGE}
        action={<Link to="/" className="p-btn p-btn--secondary p-btn--md">Back to home</Link>}
      />
    </div>
  )
}

export function RequireAuth({ children, allowIncompleteOnboarding = false }) {
  const { configured, status, isAuthenticated, profile, profileStatus } = useAuth()
  const location = useLocation()

  if (!configured) return <SetupNeeded />

  if (status === 'loading') return <Spinner label="Checking your session…" />

  if (!isAuthenticated) {
    // Preserve where the user was heading so login can send them back.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  if (profileStatus === 'loading' || profileStatus === 'idle') {
    return <Spinner label="Loading your AADI identity…" />
  }

  if (profileStatus === 'error') {
    return (
      <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <PageState
          title="We could not load your AADI profile."
          body="If this keeps happening, the database migration may not have been applied yet. See docs/setup-and-deployment.md."
          action={<button className="p-btn p-btn--primary p-btn--md" onClick={() => window.location.reload()}>Try again</button>}
        />
      </div>
    )
  }

  if (profileStatus === 'missing') {
    return (
      <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <PageState
          title="Your account exists, but your AADI profile does not."
          body="This usually means the database migration has not been applied, so the signup trigger could not create your profile. See docs/setup-and-deployment.md."
          action={<Link to="/" className="p-btn p-btn--secondary p-btn--md">Back to home</Link>}
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
  const { configured, status, isAuthenticated, profile, profileStatus } = useAuth()
  const location = useLocation()

  if (!configured || status === 'loading') return children ? children : <Outlet />

  if (isAuthenticated) {
    if (profileStatus === 'loading' || profileStatus === 'idle') {
      return <Spinner label="Taking you to your dashboard…" />
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
