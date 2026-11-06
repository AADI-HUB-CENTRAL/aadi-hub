import { useNavigate } from 'react-router-dom'
import { getIdentity, getInitials } from '../../utils/identity.js'

export default function AadiIdWidget() {
  const identity = getIdentity()
  const navigate = useNavigate()

  if (!identity) return null

  return (
    <section className="dash-card dash-id-widget">
      <div className="dash-id-widget__top">
        <div className="dash-id-widget__avatar">
          {identity.profilePhoto ? (
            <img src={identity.profilePhoto} alt="" className="dash-id-widget__avatar-img" />
          ) : (
            <span className="dash-id-widget__avatar-initials">{getInitials(identity.fullName)}</span>
          )}
        </div>
        <div className="dash-id-widget__info">
          <span className="dash-id-widget__name">{identity.fullName}</span>
          <span className="dash-id-widget__id">{identity.aadiId}</span>
        </div>
      </div>
      <div className="dash-id-widget__details">
        {identity.domain && (
          <span className="dash-id-widget__detail">{identity.domain}</span>
        )}
        <span className="dash-id-widget__badge">AADI MEMBER</span>
      </div>
      <button
        className="dash-id-widget__cta"
        onClick={() => navigate('/dashboard/aadi-id')}
      >
        View AADI ID
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </section>
  )
}
