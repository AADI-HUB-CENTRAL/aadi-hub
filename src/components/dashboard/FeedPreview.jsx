import { FEED_PREVIEW } from '../../data/dashboardData.js'

const PALETTE = ['#F0C96E', '#E8A87C', '#9CD3F0', '#C8A6F0', '#A6E8C8', '#F0A6B8']

function getInitials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function getAvatarColor(name) {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

export default function FeedPreview() {
  return (
    <section className="dash-section">
      <div className="dash-section__header">
        <h2 className="dash-section__title">From the community</h2>
        <button className="dash-section__link">
          View feed
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="dash-cards-col">
        {FEED_PREVIEW.map((post) => (
          <div key={post.id} className="dash-card dash-feed-card">
            <div className="dash-feed-card__header">
              <span
                className="dash-feed-card__avatar"
                style={{ background: getAvatarColor(post.name) }}
                aria-hidden="true"
              >
                {getInitials(post.name)}
              </span>
              <div className="dash-feed-card__meta">
                <span className="dash-feed-card__name">{post.name}</span>
                <span className="dash-feed-card__role">{post.role} &middot; {post.time}</span>
              </div>
            </div>
            <p className="dash-feed-card__text">{post.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
