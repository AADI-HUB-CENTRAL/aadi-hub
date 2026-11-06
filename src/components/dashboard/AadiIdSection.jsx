import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  getIdentity,
  getPublicProfileUrl,
  shareProfile,
} from '../../utils/identity.js'
import AadiIdCard from '../AadiIdCard.jsx'
import { ArrowRight, LinkIcon, Share, Graduation, Rocket, Users, Award, Shield, Spark } from '../ui/Icons.jsx'

const EMPTY_ICON = {
  projects: 'M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2M15 9l-6 6M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z',
  communities: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  achievements: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z',
}

function InfoRow({ label, value, icon }) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="aadiid-row">
      {icon && <span className="aadiid-row__icon">{icon}</span>}
      <div className="aadiid-row__text">
        <span className="aadiid-row__label">{label}</span>
        <span className="aadiid-row__value">{value}</span>
      </div>
    </div>
  )
}

function ChipList({ label, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="aadiid-row aadiid-row--chips">
      <span className="aadiid-row__label">{label}</span>
      <div className="aadiid-chips">
        {items.map((item) => (
          <span key={item} className="aadiid-chip">{item}</span>
        ))}
      </div>
    </div>
  )
}

function EmptyPreview({ icon, title, description }) {
  return (
    <div className="aadiid-empty">
      <span className="aadiid-empty__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
      </span>
      <div className="aadiid-empty__text">
        <p className="aadiid-empty__title">{title}</p>
        <p className="aadiid-empty__sub">{description}</p>
      </div>
    </div>
  )
}

export default function AadiIdSection() {
  const navigate = useNavigate()
  const [identity, setIdentity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareStatus, setShareStatus] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      setIdentity(getIdentity())
      setLoading(false)
    }, 350)
    return () => clearTimeout(t)
  }, [])

  const copyLink = async () => {
    if (!identity) return
    const url = getPublicProfileUrl(identity.aadiId)
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('copied')
      setTimeout(() => setShareStatus(''), 2600)
    } catch {
      setShareStatus('')
    }
  }

  const handleShare = async () => {
    if (!identity) return
    const result = await shareProfile(identity.aadiId)
    if (result === 'copied') {
      setShareStatus('copied')
      setTimeout(() => setShareStatus(''), 2600)
    }
  }

  if (loading) {
    return (
      <div className="aadiid aadiid--loading" role="status" aria-live="polite">
        <div className="aadiid-loading">
          <span className="aadiid-loading__spinner" aria-hidden="true" />
          <p>Loading your AADI identity…</p>
        </div>
      </div>
    )
  }

  if (!identity) {
    return (
      <div className="aadiid aadiid--error">
        <div className="aadiid-state">
          <span className="aadiid-state__icon">
            <Shield size={26} />
          </span>
          <h2 className="aadiid-state__title">Identity not found</h2>
          <p className="aadiid-state__sub">
            We could not find your AADI identity on this device. Please sign up or sign in to continue.
          </p>
          <button className="aadiid-btn aadiid-btn--primary" onClick={() => navigate('/register')}>
            Get started
          </button>
        </div>
      </div>
    )
  }

  const aadiId = identity.aadiId
  const profileUrl = getPublicProfileUrl(aadiId)
  const displayHeadline = identity.headline?.trim() || (identity.domain ? `${identity.domain} · Builder` : 'AADI Member')
  const memberSince = identity.createdAt
    ? new Date(identity.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  const projects = Array.isArray(identity.projects) ? identity.projects : []
  const communities = Array.isArray(identity.communities) ? identity.communities : []
  const achievements = Array.isArray(identity.achievements) ? identity.achievements : []

  const currently = identity.currently || {}
  const currentEntries = [
    { key: 'building', label: 'Building' },
    { key: 'learning', label: 'Learning' },
    { key: 'exploring', label: 'Exploring' },
    { key: 'lookingFor', label: 'Looking for' },
    { key: 'openTo', label: 'Open to' },
  ].filter((f) => (currently[f.key] || '').trim())

  return (
    <div className="aadiid">
      {/* ===== Header ===== */}
      <header className="aadiid__header">
        <div>
          <h1 className="aadiid__title">AADI ID</h1>
          <p className="aadiid__desc">Your unique identity on AADI HUB.</p>
        </div>
        <div className="aadiid__perm-id" title="Your AADI ID is permanent and cannot be changed.">
          {aadiId}
        </div>
      </header>

      {/* ===== Digital ID Card ===== */}
      <section className="aadiid__card-wrap">
        <AadiIdCard
          name={identity.fullName}
          domain={identity.domain}
          headline={displayHeadline}
          aadiId={aadiId}
          profilePhoto={identity.profilePhoto}
          createdAt={identity.createdAt}
          college={identity.college}
          location={identity.location}
          ageRange={identity.ageRange}
          education={identity.education}
        />

        {/* Public profile actions */}
        <div className="aadiid__actions">
          <button className="aadiid-btn aadiid-btn--primary" onClick={() => navigate(`/u/${aadiId}`)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/></svg>
            View Public Profile
          </button>
          <button className="aadiid-btn aadiid-btn--outline" onClick={copyLink}>
            <LinkIcon size={15} />
            {shareStatus === 'copied' ? 'Link Copied!' : 'Copy Profile Link'}
          </button>
          <button className="aadiid-btn aadiid-btn--outline" onClick={handleShare}>
            <Share size={15} />
            Share AADI ID
          </button>
        </div>

        <p className="aadiid__url">{profileUrl.replace(/^https?:\/\//, '')}</p>

        {/* QR */}
        <div className="aadiid__qr">
          <div className="aadiid__qr-inner">
            <QRCodeSVG
              value={profileUrl}
              size={132}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#0B111E"
            />
          </div>
          <p className="aadiid__qr-caption">Scan to open your public AADI profile</p>
        </div>
      </section>

      {/* ===== Grid: Identity + Profile ===== */}
      <div className="aadiid__grid">
        {/* Identity */}
        <section className="aadiid-panel">
          <h2 className="aadiid-panel__title">AADI Identity</h2>
          <div className="aadiid-panel__body">
            <div className="aadiid-keyval">
              <span className="aadiid-keyval__label">AADI ID</span>
              <span className="aadiid-keyval__value aadiid-keyval__value--strong">{aadiId}</span>
            </div>
            <div className="aadiid-keyval">
              <span className="aadiid-keyval__label">Status</span>
              <span className="aadiid-status"><span className="aadiid-status__dot" /> AADI MEMBER</span>
            </div>
            <div className="aadiid-keyval">
              <span className="aadiid-keyval__label">Member since</span>
              <span className="aadiid-keyval__value">{memberSince || '—'}</span>
            </div>
          </div>

          <h2 className="aadiid-panel__title">AADI Reputation</h2>
          <div className="aadiid-rep">
            <div className="aadiid-rep__score">
              <span className="aadiid-rep__pts">0 pts</span>
              <span className="aadiid-rep__level">Level 1 · Member</span>
            </div>
            <p className="aadiid-rep__text">Start contributing to build your reputation.</p>
          </div>

          <button className="aadiid-edit" onClick={() => navigate('/dashboard/profile')}>
            Edit Profile
            <ArrowRight size={15} />
          </button>
        </section>

        {/* Profile preview */}
        <section className="aadiid-panel">
          <h2 className="aadiid-panel__title">Profile</h2>
          <div className="aadiid-panel__body">
            <div className="aadiid-preview">
              <InfoRow label="Headline" value={displayHeadline} icon={<Spark size={16} />} />
              <InfoRow label="About" value={identity.bio} />
              <InfoRow label="College / School" value={identity.college} icon={<Graduation size={16} />} />
              {identity.education && (identity.education.degree || identity.education.year) && (
                <InfoRow
                  label="Education"
                  value={[identity.education.degree, identity.education.year].filter(Boolean).join(' · ')}
                />
              )}
              <ChipList label="Skills" items={identity.skills} />
              <ChipList label="Interests" items={identity.interests} />
              {currentEntries.map((f) => <InfoRow key={f.key} label={f.label} value={currently[f.key]} />)}

              {!identity.bio && !identity.college && !identity.skills?.length && !identity.interests?.length && currentEntries.length === 0 && (
                <div className="aadiid-empty aadiid-empty--block">
                  <p className="aadiid-empty__title">No profile details yet</p>
                  <p className="aadiid-empty__sub">Add details in your profile so they appear here automatically.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ===== Projects / Communities / Achievements ===== */}
      <div className="aadiid__grid aadiid__grid--three">
        <section className="aadiid-panel">
          <h2 className="aadiid-panel__title">
            <Rocket size={16} /> Projects
          </h2>
          {projects.length > 0 ? (
            <div className="aadiid-list">
              {projects.map((p, idx) => (
                <div key={p.id || idx} className="aadiid-item">
                  <p className="aadiid-item__title">{p.name || p.title || 'Untitled project'}</p>
                  {p.description && <p className="aadiid-item__sub">{p.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <EmptyPreview
              icon={EMPTY_ICON.projects}
              title="No projects yet"
              description="Projects you create will appear here."
            />
          )}
        </section>

        <section className="aadiid-panel">
          <h2 className="aadiid-panel__title">
            <Users size={16} /> Communities
          </h2>
          {communities.length > 0 ? (
            <div className="aadiid-list">
              {communities.map((c, idx) => (
                <div key={c.id || idx} className="aadiid-item">
                  <p className="aadiid-item__title">{c.name}</p>
                  {c.description && <p className="aadiid-item__sub">{c.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <EmptyPreview
              icon={EMPTY_ICON.communities}
              title="No communities yet"
              description="Communities you join will appear here."
            />
          )}
        </section>

        <section className="aadiid-panel">
          <h2 className="aadiid-panel__title">
            <Award size={16} /> Achievements
          </h2>
          {achievements.length > 0 ? (
            <div className="aadiid-list">
              {achievements.map((a, idx) => (
                <div key={a.id || idx} className="aadiid-item">
                  <p className="aadiid-item__title">{a.title || a.name}</p>
                  {a.description && <p className="aadiid-item__sub">{a.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <EmptyPreview
              icon={EMPTY_ICON.achievements}
              title="No achievements yet"
              description="Achievements you earn will appear here."
            />
          )}
        </section>
      </div>
    </div>
  )
}
