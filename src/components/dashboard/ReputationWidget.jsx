export default function ReputationWidget() {
  return (
    <section className="dash-card dash-reputation">
      <h3 className="dash-reputation__title">Your reputation</h3>
      <div className="dash-reputation__score">
        <span className="dash-reputation__pts">0 pts</span>
        <span className="dash-reputation__level">Level 1</span>
      </div>
      <p className="dash-reputation__text">
        Start contributing to build your reputation.
      </p>
    </section>
  )
}
