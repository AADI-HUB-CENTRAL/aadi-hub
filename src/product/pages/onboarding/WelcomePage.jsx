import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { ProductLogo, Button } from '../../ui/kit.jsx'
import '../../styles/onboarding.css'

/* ---------------------------------------------------------------------------
   Welcome — the "Welcome to the AADI Family!" moment.
   * Shown ONLY when navigation state says the student just finished onboarding
     (`state.fromOnboarding`), which OnboardingPage sets exclusively after the
     final save succeeded. A refresh or a direct visit goes straight to the
     dashboard, so this never replays on ordinary logins.
   * The reveal is CSS-driven (~1s) and fully disabled under
     prefers-reduced-motion; the CTA is usable from the first frame.
--------------------------------------------------------------------------- */

export default function WelcomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [justCompleted, setJustCompleted] = useState(Boolean(location.state?.fromOnboarding))

  useEffect(() => {
    if (location.state?.fromOnboarding) setJustCompleted(true)
    // Replaying on an explicit revisit is fine as long as the state was passed.
  }, [location.state])

  if (!justCompleted) return <Navigate to="/dashboard" replace />

  const fullName = (profile?.full_name || '').trim()
  const firstName = fullName.split(/\s+/)[0] || ''

  return (
    <div className="wlc-page">
      <div className="wlc-nodes" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>

      <div className="wlc-inner" role="status" aria-live="polite">
        <div className="wlc-logo">
          <ProductLogo symbol={44} size={26} />
        </div>

        <p className="wlc-eyebrow">Onboarding complete</p>

        <h1>
          Welcome to the AADI Family{firstName ? ',' : '!'}
          {firstName && <> <span className="wlc-name">{firstName}</span>!</>}
        </h1>

        <p>Your journey to connect, build, learn, and compete starts here.</p>

        <div className="wlc-cta">
          <Button size="lg" onClick={() => navigate('/dashboard', { replace: true })}>
            Explore my dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
