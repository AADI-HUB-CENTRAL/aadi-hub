import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { BrandSymbol } from './Logo.jsx'
import { getIdentityById, getInitials, getPublicProfileUrl } from '../utils/identity.js'
import { getCoverComponent } from './dashboard/CoverDesigns.jsx'

export default function PublicProfile() {
  const { aadiId } = useParams()
  const identity = getIdentityById(aadiId)

  if (!identity) {
    return (
      <div className="profile-page">
        <div className="profile-page__card">
          <div className="profile-page__header">
            <BrandSymbol size={32} style={{ color: '#B5E84A' }} />
            <span className="profile-page__brand-text">AADI HUB</span>
          </div>
          <div className="profile-page__unavailable">
            <h1>Identity Unavailable</h1>
            <p>
              This AADI identity could not be found on this prototype environment.
            </p>
            <p className="profile-page__id-display">{aadiId}</p>
            <Link to="/" className="profile-page__back">Back to AADI HUB</Link>
          </div>
        </div>
      </div>
    )
  }

  const initials = getInitials(identity.fullName)
  const profileUrl = getPublicProfileUrl(aadiId)
  const memberDate = new Date(identity.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const displayHeadline = identity.headline || (identity.domain ? `${identity.domain} · AADI Member` : 'AADI Member')

  return (
    <div className="profile-page">
      <div className="profile-page__card">
        {(() => {
          const cover = identity.profileCover
          const CoverComp = cover?.type === 'preset' ? getCoverComponent(cover.value) : null
          return (
            <div className="profile-page__cover">
              {cover?.type === 'custom' ? (
                <img src={cover.value} alt="" className="profile-page__cover-img" />
              ) : CoverComp ? (
                <CoverComp />
              ) : (
                <div className="profile-page__cover-default" />
              )}
            </div>
          )
        })()}
        <div className="profile-page__header">
          <BrandSymbol size={28} style={{ color: '#B5E84A' }} />
          <span className="profile-page__brand-text">AADI HUB</span>
        </div>

        <p className="profile-page__subtitle">Digital Identity</p>
        <span className="profile-page__badge">
          <span className="profile-page__badge-check">✓</span>
          AADI MEMBER
        </span>

        <div className="profile-page__identity">
          <div className="profile-page__photo">
            {identity.profilePhoto ? (
              <img src={identity.profilePhoto} alt={identity.fullName} />
            ) : (
              <span className="profile-page__initials">{initials}</span>
            )}
          </div>
          <h2 className="profile-page__name">{identity.fullName}</h2>
          <p className="profile-page__domain">{displayHeadline}</p>
          {identity.college && (
            <p className="profile-page__college">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/></svg>
              {identity.college}
            </p>
          )}
        </div>

        <div className="profile-page__id-section">
          <span className="profile-page__id-label">AADI ID</span>
          <span className="profile-page__id-value">{identity.aadiId}</span>
        </div>

        {identity.bio && (
          <div className="profile-page__section">
            <span className="profile-page__section-label">About</span>
            <p className="profile-page__bio">{identity.bio}</p>
          </div>
        )}

        {identity.skills?.length > 0 && (
          <div className="profile-page__section">
            <span className="profile-page__section-label">Skills</span>
            <div className="profile-page__chips">
              {identity.skills.map(s => (
                <span key={s} className="profile-page__chip">{s}</span>
              ))}
            </div>
          </div>
        )}

        {identity.goals?.length > 0 && (
          <div className="profile-page__section">
            <span className="profile-page__section-label">On AADI</span>
            <div className="profile-page__chips">
              {identity.goals.map(g => (
                <span key={g} className="profile-page__chip profile-page__chip--kiwi">{g}</span>
              ))}
            </div>
          </div>
        )}

        <div className="profile-page__qr">
          <QRCodeSVG
            value={profileUrl}
            size={100}
            level="M"
            bgColor="#FFFFFF"
            fgColor="#0B111E"
          />
        </div>

        <div className="profile-page__divider" />

        <p className="profile-page__verified">Identity verified through AADI HUB</p>
        <p className="profile-page__date">Member since: {memberDate}</p>

        <div className="profile-page__divider" />

        <p className="profile-page__footer-note">
          This is an AADI digital identity profile.
        </p>
      </div>
    </div>
  )
}
