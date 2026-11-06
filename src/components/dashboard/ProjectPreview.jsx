import { PROJECTS } from '../../data/dashboardData.js'

export default function ProjectPreview() {
  return (
    <section className="dash-section">
      <div className="dash-section__header">
        <h2 className="dash-section__title">Projects</h2>
        <button className="dash-section__link">
          Explore projects
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="dash-cards-col">
        {PROJECTS.map((p) => (
          <div key={p.id} className="dash-card dash-project-card">
            <span className="dash-project-card__title">{p.title}</span>
            <span className="dash-project-card__desc">{p.description}</span>
            <div className="dash-project-card__roles">
              <span className="dash-project-card__roles-label">Looking for:</span>
              {p.lookingFor.map((r) => (
                <span key={r} className="dash-project-card__role">{r}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
