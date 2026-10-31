import { GOALS } from '../../data/dashboardData.js'

export default function GoalsWidget() {
  return (
    <section className="dash-card dash-goals">
      <h3 className="dash-goals__title">Your goals</h3>
      <div className="dash-goals__list">
        {GOALS.map((goal) => (
          <div key={goal.id} className="dash-goals__item">
            <div className="dash-goals__item-top">
              <span className="dash-goals__item-label">{goal.label}</span>
              <span className="dash-goals__item-pct">{goal.progress}%</span>
            </div>
            <div className="dash-goals__bar">
              <div
                className="dash-goals__bar-fill"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
