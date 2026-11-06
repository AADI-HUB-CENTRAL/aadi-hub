import { QUICK_ACTIONS } from '../../data/dashboardData.js'

const iconMap = {
  Rocket: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M15 9l-6 6"/><path d="M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z"/></svg>,
  Users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>,
  Lightbulb: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1.1 2.1h4.8c.1-.9.5-1.6 1.1-2.1A6 6 0 0 0 12 3z"/></svg>,
  PenTool: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 13l5-5-4-4M2 2l7.6 7.6"/></svg>,
  Trophy: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/></svg>,
  Briefcase: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>,
}

export default function QuickActions() {
  return (
    <section className="dash-section">
      <h2 className="dash-section__title">What do you want to do?</h2>
      <div className="dash-quick-grid">
        {QUICK_ACTIONS.map((action) => (
          <button key={action.id} className="dash-card dash-action-card">
            <span className="dash-action-card__icon">{iconMap[action.icon]}</span>
            <span className="dash-action-card__label">{action.label}</span>
            <span className="dash-action-card__desc">{action.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
