import { getIdentity } from '../../utils/identity.js'

export default function ProfileCompletionCard() {
  const identity = getIdentity()
  const name = identity?.fullName?.split(' ')[0] || 'there'

  let progress = 0
  if (identity?.profilePhoto) progress += 20
  if (identity?.college) progress += 20
  if (identity?.domain) progress += 20
  if (identity?.roles?.length) progress += 20
  if (identity?.location) progress += 20
  if (progress === 0) progress = 40

  return (
    <section className="dash-card dash-welcome-card">
      <div className="dash-welcome-card__content">
        <h2 className="dash-welcome-card__heading">
          Welcome to AADI, {name} <span aria-hidden="true">&#128075;</span>
        </h2>
        <p className="dash-welcome-card__text">
          Your AADI identity is ready. Let's complete your profile and start building your journey.
        </p>
        <div className="dash-welcome-card__progress">
          <div className="dash-welcome-card__progress-bar">
            <div className="dash-welcome-card__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="dash-welcome-card__progress-text">Profile {progress}% complete</span>
        </div>
        <button className="dash-welcome-card__cta">
          Complete profile
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
    </section>
  )
}
