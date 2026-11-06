import { CHALLENGES } from '../../data/dashboardData.js'

export default function ChallengePreview() {
  return (
    <section className="dash-section">
      <div className="dash-section__header">
        <h2 className="dash-section__title">Challenges</h2>
        <button className="dash-section__link">
          View all
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="dash-cards-row">
        {CHALLENGES.map((ch) => (
          <div key={ch.id} className="dash-card dash-challenge-card">
            <span className="dash-challenge-card__type">{ch.type}</span>
            <span className="dash-challenge-card__title">{ch.title}</span>
            <span className="dash-challenge-card__desc">{ch.description}</span>
            <span className={`dash-challenge-card__status dash-challenge-card__status--${ch.status}`}>
              {ch.status === 'active' ? 'Active now' : ch.status === 'upcoming' ? 'Coming soon' : 'Coming soon'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
