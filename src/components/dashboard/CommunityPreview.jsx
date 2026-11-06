import { COMMUNITIES } from '../../data/dashboardData.js'

export default function CommunityPreview() {
  return (
    <section className="dash-section">
      <div className="dash-section__header">
        <h2 className="dash-section__title">Communities for you</h2>
        <button className="dash-section__link">
          Explore communities
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="dash-cards-row">
        {COMMUNITIES.map((c) => (
          <div key={c.id} className="dash-card dash-community-card">
            <div className="dash-community-card__color" style={{ background: c.color }} />
            <span className="dash-community-card__name">{c.name}</span>
            <span className="dash-community-card__desc">{c.description}</span>
            <span className="dash-community-card__members">{c.members} members</span>
          </div>
        ))}
      </div>
    </section>
  )
}
