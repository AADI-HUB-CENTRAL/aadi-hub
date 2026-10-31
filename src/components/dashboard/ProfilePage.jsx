import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getIdentity, updateIdentity, getInitials, getPublicProfileUrl, getProfileCompletion, shareProfile } from '../../utils/identity.js'
import PhotoCropEditor from '../PhotoCropEditor.jsx'
import { getCoverComponent } from './CoverDesigns.jsx'
import CoverSelector from './CoverSelector.jsx'
import CoverCropper from './CoverCropper.jsx'

const SKILLS = [
  'AI', 'Machine Learning', 'Data Science', 'Data Analysis', 'Python', 'Java',
  'JavaScript', 'Web Development', 'App Development', 'UI/UX Design', 'Graphic Design',
  'Content Creation', 'Video Editing', 'Business', 'Entrepreneurship', 'Communication',
  'Leadership', 'Research', 'Cloud', 'Cybersecurity',
]

const INTERESTS = [
  'AI', 'Technology', 'Data', 'Design', 'Content', 'Startups', 'Business',
  'Gaming', 'Creative', 'Photography', 'Finance', 'Education', 'Innovation', 'Open Source',
]

const GOALS = [
  'BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE',
]

const GOAL_DESCRIPTIONS = {
  BUILD: 'Build products and projects',
  CONNECT: 'Connect with like-minded people',
  LEARN: 'Learn new skills and technologies',
  CREATE: 'Create content and experiences',
  COMPETE: 'Compete in challenges',
  LEAD: 'Lead teams and communities',
  'FIND OPPORTUNITIES': 'Find internships and opportunities',
  'MEET PEOPLE': 'Meet new people',
}

const GOAL_ICONS = {
  BUILD: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  CONNECT: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  LEARN: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  CREATE: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  COMPETE: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z',
  LEAD: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  'FIND OPPORTUNITIES': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  'MEET PEOPLE': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
}

const CURRENT_FIELDS = [
  {
    key: 'building', label: 'Building', placeholder: 'What are you building right now?',
    icon: <path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2M15 9l-6 6M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z" />,
  },
  {
    key: 'learning', label: 'Learning', placeholder: 'What are you learning at the moment?',
    icon: <path d="M22 10v6M2 10l10-5 10 5-10 5z" />,
  },
  {
    key: 'exploring', label: 'Exploring', placeholder: 'What are you exploring lately?',
    icon: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
  },
  {
    key: 'lookingFor', label: 'Looking for', placeholder: 'Collaborators, internships, ideas...',
    icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  },
  {
    key: 'openTo', label: 'Open to', placeholder: 'Projects, hackathons, opportunities...',
    icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  },
]

const EMPTY_CURRENTLY = {
  building: '', learning: '', exploring: '', lookingFor: '', openTo: '',
}

const LEVEL_STEPS = ['Member', 'Contributor', 'Builder', 'Mentor', 'Leader']

function ChipSelect({ options, selected, onToggle, disabled }) {
  return (
    <div className="pf-chips">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`pf-chip${selected.includes(opt) ? ' pf-chip--active' : ''}`}
          onClick={() => !disabled && onToggle(opt)}
          disabled={disabled}
        >
          {selected.includes(opt) && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          )}
          {opt}
        </button>
      ))}
    </div>
  )
}

function CompletionRing({ pct, size = 80 }) {
  const r = 42
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg className="pf-completion__ring" viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(11,17,30,0.06)" strokeWidth="7" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke="var(--kiwi-500)" strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.6s var(--ease-out)' }}
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
        className="pf-completion__pct">{pct}%</text>
    </svg>
  )
}

function SectionCard({ title, onEdit, editLabel, children }) {
  return (
    <section className="pf-card">
      <div className="pf-card__header">
        <h2 className="pf-card__title">{title}</h2>
        {onEdit && (
          <button className="pf-card__edit" onClick={onEdit} aria-label={editLabel || `Edit ${title}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="pf-empty">
      {icon && (
        <div className="pf-empty__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
        </div>
      )}
      <p className="pf-empty__title">{title}</p>
      <p className="pf-empty__sub">{description}</p>
      {actionLabel && onAction && (
        <button className="pf-btn pf-btn--sm pf-btn--kiwi" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [identity, setIdentity] = useState(() => getIdentity())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState('')
  const [cropOpen, setCropOpen] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)
  const [shareStatus, setShareStatus] = useState('')
  const [coverOpen, setCoverOpen] = useState(false)
  const [coverCropperSrc, setCoverCropperSrc] = useState(null)
  const [cover, setCover] = useState(null)
  const fileRef = useRef(null)
  const coverFileRef = useRef(null)

  const [form, setForm] = useState({
    fullName: '', headline: '', college: '', ageRange: '', bio: '',
  })
  const [education, setEducation] = useState({ degree: '', year: '' })
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [goals, setGoals] = useState([])
  const [currently, setCurrently] = useState(EMPTY_CURRENTLY)
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})

  const hydrateForm = (id) => {
    setForm({
      fullName: id.fullName || '',
      headline: id.headline || '',
      college: id.college || '',
      ageRange: id.ageRange || '',
      bio: id.bio || '',
    })
    setEducation(id.education || { degree: '', year: '' })
    setSkills(id.skills || [])
    setInterests(id.interests || [])
    setGoals(id.goals || [])
    setCurrently({ ...EMPTY_CURRENTLY, ...(id.currently || {}) })
    setPhoto(id.profilePhoto || null)
    setCover(id.profileCover || { type: 'preset', value: 'cover-01' })
  }

  useEffect(() => {
    if (!identity) {
      navigate('/register', { replace: true })
      return
    }
    hydrateForm(identity)
  }, [identity, navigate])

  if (!identity) return null

  const completion = getProfileCompletion(identity)
  const profileUrl = getPublicProfileUrl(identity.aadiId)
  const initials = getInitials(identity.fullName)
  const displayHeadline = identity.headline || (identity.domain ? `${identity.domain} · AADI Member` : 'AADI Member')
  const memberSince = identity.createdAt
    ? new Date(identity.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null
  const currentEntries = CURRENT_FIELDS.filter(f => (currently[f.key] || '').trim())
  const userProjects = Array.isArray(identity.projects) ? identity.projects : []

  const setField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const setCurrentField = (key, val) => {
    setCurrently(prev => ({ ...prev, [key]: val }))
  }

  const toggleItem = (arr, setArr) => (item) => {
    setArr(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])
  }

  const startEdit = () => {
    hydrateForm(identity)
    setErrors({})
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setErrors({})
    hydrateForm(identity)
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Please enter your name.'
    if (form.bio.length > 250) e.bio = 'Bio must be 250 characters or fewer.'
    setErrors(e)
    return e
  }

  const save = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    setTimeout(() => {
      updateIdentity({
        fullName: form.fullName.trim(),
        headline: form.headline.trim(),
        college: form.college.trim(),
        ageRange: form.ageRange,
        bio: form.bio.trim(),
        education,
        skills,
        interests,
        goals,
        currently: Object.fromEntries(
          CURRENT_FIELDS.map(f => [f.key, (currently[f.key] || '').trim()])
        ),
        profilePhoto: photo,
        profileCover: cover,
      })
      setIdentity(getIdentity())
      setSaving(false)
      setEditing(false)
      setNotification('Profile updated successfully.')
      setTimeout(() => setNotification(''), 3000)
    }, 400)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image must be under 5MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPendingImage(ev.target.result)
      setCropOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropApply = (dataUrl) => {
    setPhoto(dataUrl)
    setCropOpen(false)
    setPendingImage(null)
  }

  const handleCropCancel = () => {
    setCropOpen(false)
    setPendingImage(null)
  }

  const handleCoverSelect = (coverData) => {
    setCover(coverData)
    setCoverOpen(false)
  }

  const handleCoverUpload = (dataUrl) => {
    setCoverCropperSrc(dataUrl)
    setCoverOpen(false)
  }

  const handleCoverCropApply = (dataUrl) => {
    setCover({ type: 'custom', value: dataUrl })
    setCoverCropperSrc(null)
  }

  const handleCoverCropCancel = () => {
    setCoverCropperSrc(null)
  }

  const handleShare = async () => {
    const result = await shareProfile(identity.aadiId)
    if (result === 'copied') {
      setShareStatus('copied')
      setNotification('Profile link copied!')
      setTimeout(() => { setNotification(''); setShareStatus('') }, 3000)
    } else if (result === 'shared') {
      setNotification('Profile shared.')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  return (
    <div className="pf">
      {notification && (
        <div className="pf-toast" role="status">{notification}</div>
      )}

      {/* ====== HERO / COVER ====== */}
      <section className="pf-hero">
        <div className="pf-hero__cover">
          {cover?.type === 'custom' ? (
            <img src={cover.value} alt="" className="pf-hero__cover-img" />
          ) : (() => {
            const CoverComponent = getCoverComponent(cover?.value)
            return <CoverComponent />
          })()}
          <button
            className="pf-hero__cover-edit"
            onClick={() => setCoverOpen(true)}
            aria-label="Change cover photo"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Edit cover
          </button>
        </div>

        <div className="pf-hero__body">
          <div className="pf-hero__photo-area">
            <div className="pf-hero__photo">
              {photo ? (
                <img src={photo} alt={identity.fullName} />
              ) : (
                <span className="pf-hero__initials">{initials}</span>
              )}
            </div>
            {editing && (
              <>
                <input
                  ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange} className="pf-sr-only"
                  aria-label="Upload profile photo"
                />
                <button className="pf-hero__photo-btn" onClick={() => fileRef.current?.click()}
                  aria-label="Change profile photo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                </button>
              </>
            )}
            {errors.photo && <span className="pf-error-inline">{errors.photo}</span>}
          </div>

          <div className="pf-hero__info">
            <div className="pf-hero__top-row">
              <div className="pf-hero__text">
                {editing ? (
                  <input
                    className={`pf-input pf-input--lg${errors.fullName ? ' pf-input--err' : ''}`}
                    value={form.fullName} onChange={e => setField('fullName', e.target.value)}
                    placeholder="Your full name" aria-label="Full name"
                  />
                ) : (
                  <h1 className="pf-hero__name">{identity.fullName}</h1>
                )}
                {editing ? (
                  <input
                    className="pf-input"
                    value={form.headline} onChange={e => setField('headline', e.target.value)}
                    placeholder="e.g. Data Science Student · Builder" aria-label="Headline"
                  />
                ) : (
                  <p className="pf-hero__headline">{displayHeadline}</p>
                )}
                <div className="pf-hero__meta">
                  <span className="pf-hero__aadi-id">{identity.aadiId}</span>
                  <span className="pf-badge">AADI MEMBER</span>
                  {identity.college && !editing && (
                    <span className="pf-hero__college">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/></svg>
                      {identity.college}
                    </span>
                  )}
                </div>
                {!editing && (identity.location || memberSince || identity.roles?.length > 0) && (
                  <div className="pf-hero__meta pf-hero__meta--sub">
                    {identity.location && (
                      <span className="pf-hero__college">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {identity.location}
                      </span>
                    )}
                    {memberSince && (
                      <span className="pf-hero__college">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        Member since {memberSince}
                      </span>
                    )}
                    {identity.roles?.map(role => (
                      <span key={role} className="pf-chip pf-chip--ro pf-chip--role">{role}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pf-hero__actions-col">
                {!editing && (
                  <div className="pf-hero__mini-strength" title="Profile strength">
                    <CompletionRing pct={completion.pct} size={46} />
                    <div className="pf-hero__mini-strength-text">
                      <span className="pf-hero__mini-strength-label">Profile strength</span>
                      <span className="pf-hero__mini-strength-pct">{completion.pct}%</span>
                    </div>
                  </div>
                )}
                <div className="pf-hero__actions">
                  {editing ? (
                    <>
                      <button className="pf-btn pf-btn--primary" onClick={save} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="pf-btn pf-btn--ghost" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="pf-btn pf-btn--outline" onClick={startEdit}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit Profile
                      </button>
                      <button className="pf-btn pf-btn--outline" onClick={handleShare}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        Share Profile
                      </button>
                      <button className="pf-btn pf-btn--kiwi" onClick={() => navigate('/dashboard/aadi-id')}>
                        AADI ID
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TWO-COLUMN GRID ====== */}
      <div className="pf-grid">
        {/* Left Column */}
        <div className="pf-col pf-col--main">

          {/* About */}
          <SectionCard title="About" onEdit={!editing ? startEdit : undefined} editLabel="Edit about">
            {editing ? (
              <div className="pf-about-edit">
                <div className="pf-about-edit__row">
                  <label className="pf-about__label">Headline</label>
                  <input className="pf-input" value={form.headline}
                    onChange={e => setField('headline', e.target.value)}
                    placeholder="e.g. Data Science Student · Builder" />
                </div>
                <div className="pf-about-edit__row">
                  <label className="pf-about__label">College / School</label>
                  <input className="pf-input" value={form.college}
                    onChange={e => setField('college', e.target.value)}
                    placeholder="Where do you study?" />
                </div>
                <div className="pf-about-edit__row">
                  <label className="pf-about__label">Age range</label>
                  <select className="pf-input pf-select" value={form.ageRange}
                    onChange={e => setField('ageRange', e.target.value)}>
                    <option value="">Select</option>
                    <option>Under 15</option><option>15–18</option><option>18–24</option><option>25+</option>
                  </select>
                </div>
                <div className="pf-about-edit__row pf-about-edit__row--col">
                  <label className="pf-about__label">About me</label>
                  <textarea
                    className={`pf-input pf-textarea${errors.bio ? ' pf-input--err' : ''}`}
                    value={form.bio} onChange={e => setField('bio', e.target.value)}
                    placeholder="Tell people what you're building, learning, or interested in..."
                    rows={4} maxLength={260} />
                  <div className="pf-textarea-footer">
                    <span className="pf-char-count">{form.bio.length}/250</span>
                    {errors.bio && <span className="pf-error">{errors.bio}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pf-about">
                {identity.bio ? (
                  <p className="pf-about__bio">{identity.bio}</p>
                ) : (
                  <div className="pf-about__empty">
                    <p className="pf-about__bio pf-about__bio--muted">Tell the AADI community about yourself.</p>
                    <button className="pf-btn pf-btn--kiwi pf-btn--sm" onClick={startEdit}>Add bio</button>
                  </div>
                )}
                {(identity.college || identity.ageRange || identity.domain) && (
                  <div className="pf-about__details">
                    {identity.college && (
                      <div className="pf-about__detail">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/></svg>
                        <span>{identity.college}</span>
                      </div>
                    )}
                    {identity.domain && (
                      <div className="pf-about__detail">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                        <span>{identity.domain}</span>
                      </div>
                    )}
                    {identity.ageRange && (
                      <div className="pf-about__detail">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span>{identity.ageRange}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education" onEdit={!editing ? startEdit : undefined} editLabel="Edit education">
            {editing ? (
              <div className="pf-about-edit">
                <div className="pf-about-edit__row">
                  <label className="pf-about__label">College / University</label>
                  <input className="pf-input" value={form.college}
                    onChange={e => setField('college', e.target.value)}
                    placeholder="e.g. MITS Deemed to be University" />
                </div>
                <div className="pf-about-edit__row">
                  <label className="pf-about__label">Degree / Program</label>
                  <input className="pf-input" value={education.degree}
                    onChange={e => setEducation(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g. B.Tech — Data Science" />
                </div>
                <div className="pf-about-edit__row">
                  <label className="pf-about__label">Year</label>
                  <input className="pf-input" value={education.year}
                    onChange={e => setEducation(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="e.g. 2025–2029" />
                </div>
              </div>
            ) : (identity.college || education.degree) ? (
              <div className="pf-edu-card">
                <div className="pf-edu-card__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/></svg>
                </div>
                <div className="pf-edu-card__info">
                  <span className="pf-edu-card__school">{identity.college}</span>
                  {education.degree && <span className="pf-edu-card__degree">{education.degree}</span>}
                  {education.year && <span className="pf-edu-card__year">{education.year}</span>}
                </div>
              </div>
            ) : (
              <EmptyState
                icon="M2 9l10-5 10 5-10 5zM6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"
                title="No education added yet."
                description="Add your school or university details."
                actionLabel="Add education"
                onAction={startEdit}
              />
            )}
          </SectionCard>

          {/* Skills */}
          <SectionCard title="Skills" onEdit={!editing ? startEdit : undefined} editLabel="Edit skills">
            {editing ? (
              <ChipSelect options={SKILLS} selected={skills} onToggle={toggleItem(skills, setSkills)} />
            ) : skills.length > 0 ? (
              <div className="pf-chips pf-chips--readonly">
                {skills.map(s => <span key={s} className="pf-chip pf-chip--active pf-chip--ro pf-chip--skill">{s}</span>)}
              </div>
            ) : (
              <EmptyState
                icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                title="No skills added yet."
                description="Select your skills so others can see what you bring."
                actionLabel="Add skills"
                onAction={startEdit}
              />
            )}
          </SectionCard>

          {/* Interests */}
          <SectionCard title="Interests" onEdit={!editing ? startEdit : undefined} editLabel="Edit interests">
            {editing ? (
              <ChipSelect options={INTERESTS} selected={interests} onToggle={toggleItem(interests, setInterests)} />
            ) : interests.length > 0 ? (
              <div className="pf-chips pf-chips--readonly">
                {interests.map(i => <span key={i} className="pf-chip pf-chip--interest pf-chip--ro">{i}</span>)}
              </div>
            ) : (
              <EmptyState
                icon="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20"
                title="No interests added yet."
                description="Add your interests so communities can find you."
                actionLabel="Add interests"
                onAction={startEdit}
              />
            )}
          </SectionCard>

          {/* On AADI I want to */}
          <SectionCard title="On AADI, I want to" onEdit={!editing ? startEdit : undefined} editLabel="Edit goals">
            {editing ? (
              <div className="pf-goals-edit">
                {GOALS.map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`pf-goal-card${goals.includes(g) ? ' pf-goal-card--active' : ''}`}
                    onClick={() => toggleItem(goals, setGoals)(g)}
                  >
                    <div className="pf-goal-card__icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={GOAL_ICONS[g]} /></svg>
                    </div>
                    <span className="pf-goal-card__label">{g}</span>
                    {goals.includes(g) && (
                      <svg className="pf-goal-card__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </button>
                ))}
              </div>
            ) : goals.length > 0 ? (
              <div className="pf-goals-grid">
                {goals.map(g => (
                  <div key={g} className="pf-goal-display">
                    <div className="pf-goal-display__icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={GOAL_ICONS[g]} /></svg>
                    </div>
                    <div className="pf-goal-display__text">
                      <span className="pf-goal-display__label">{g}</span>
                      <span className="pf-goal-display__desc">{GOAL_DESCRIPTIONS[g]}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                title="No goals selected yet."
                description="Choose what you want to do on AADI."
                actionLabel="Select goals"
                onAction={startEdit}
              />
            )}
          </SectionCard>

          {/* Currently */}
          <SectionCard title="Currently" onEdit={!editing ? startEdit : undefined} editLabel="Edit currently">
            {editing ? (
              <div className="pf-currently-edit">
                {CURRENT_FIELDS.map(f => (
                  <div key={f.key} className="pf-about-edit__row">
                    <label className="pf-about__label pf-currently-label" htmlFor={`pf-currently-${f.key}`}>
                      <span className="pf-currently-item__icon pf-currently-item__icon--sm" aria-hidden="true">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                      </span>
                      {f.label}
                      <span className="pf-about__label-hint">optional</span>
                    </label>
                    <input
                      id={`pf-currently-${f.key}`}
                      className="pf-input"
                      value={currently[f.key] || ''}
                      onChange={e => setCurrentField(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      maxLength={80}
                    />
                  </div>
                ))}
              </div>
            ) : currentEntries.length > 0 ? (
              <div className="pf-currently-grid">
                {currentEntries.map(f => (
                  <div key={f.key} className="pf-currently-item">
                    <span className="pf-currently-item__icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                    </span>
                    <div className="pf-currently-item__text">
                      <span className="pf-currently-item__label">{f.label}</span>
                      <span className="pf-currently-item__value">{currently[f.key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="M22 12h-4l-3 9L9 3l-3 9H2"
                title="Share what you're up to."
                description="Add what you're building, learning or exploring right now."
                actionLabel="Add updates"
                onAction={startEdit}
              />
            )}
          </SectionCard>

          {/* Projects */}
          <SectionCard title="Projects">
            {userProjects.length > 0 ? (
              <div className="pf-projects">
                {userProjects.map((p, idx) => {
                  const name = p.name || p.title || 'Untitled project'
                  const tags = Array.isArray(p.tags) ? p.tags : (Array.isArray(p.technologies) ? p.technologies : [])
                  const demo = p.demo || p.liveUrl || p.url
                  const github = p.github || p.repoUrl
                  return (
                    <article key={p.id || idx} className="pf-project-card">
                      {p.image && (
                        <img src={p.image} alt="" className="pf-project-card__img" />
                      )}
                      <div className="pf-project-card__header">
                        <h3 className="pf-project-card__title">{name}</h3>
                        {p.status && <span className="pf-project-card__status">{p.status}</span>}
                      </div>
                      {p.description && <p className="pf-project-card__desc">{p.description}</p>}
                      {tags.length > 0 && (
                        <div className="pf-chips pf-chips--readonly">
                          {tags.map(t => <span key={t} className="pf-chip pf-chip--interest pf-chip--ro">{t}</span>)}
                        </div>
                      )}
                      {(demo || github || p.date || Array.isArray(p.members)) && (
                        <div className="pf-project-card__footer">
                          {p.date && <span className="pf-project-card__date">{p.date}</span>}
                          {Array.isArray(p.members) && p.members.length > 0 && (
                            <span className="pf-project-card__team">{p.members.join(', ')}</span>
                          )}
                          {(github || demo) && (
                            <div className="pf-project-card__links">
                              {github && (
                                <a href={github} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn--ghost pf-btn--sm">GitHub</a>
                              )}
                              {demo && (
                                <a href={demo} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn--kiwi pf-btn--sm">Demo</a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2M15 9l-6 6M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z"
                title="No projects yet"
                description="Start building something and showcase it here."
                actionLabel="Start a project"
                onAction={() => navigate('/dashboard')}
              />
            )}
          </SectionCard>

          {/* Communities */}
          <SectionCard title="Communities">
            <EmptyState
              icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"
              title="No communities joined yet"
              description="Explore communities on AADI and connect with people who share your interests."
              actionLabel="Explore communities"
              onAction={() => navigate('/dashboard')}
            />
          </SectionCard>

          {/* Contributions */}
          <SectionCard title="Contributions">
            <EmptyState
              icon="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              title="No contributions yet"
              description="Posts, projects, challenges and community contributions will appear here as you participate."
            />
          </SectionCard>

          {/* Challenges & Achievements */}
          {/* Future credential categories (certifications / hackathons / awards) can plug in here once supported. */}
          <SectionCard title="Challenges & Achievements">
            <EmptyState
              icon="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"
              title="No achievements yet"
              description="Complete challenges and participate in the community to earn recognition."
              actionLabel="Explore challenges"
              onAction={() => navigate('/dashboard')}
            />
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="pf-col pf-col--side">

          {/* Profile Strength */}
          <section className="pf-card pf-strength">
            <div className="pf-strength__header">
              <CompletionRing pct={completion.pct} />
              <div className="pf-strength__info">
                <span className="pf-strength__label">Profile strength</span>
                <span className="pf-strength__pct">{completion.pct}%</span>
              </div>
            </div>
            <p className="pf-strength__text">
              {completion.pct === 100
                ? 'Your profile is ready to represent you across AADI.'
                : 'Complete your profile to help people discover you.'}
            </p>
            <div className="pf-strength__list">
              {completion.items.map(item => (
                <div key={item.label} className={`pf-strength__item${item.done ? ' pf-strength__item--done' : ''}`}>
                  {item.done ? (
                    <span className="pf-strength__check" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  ) : (
                    <span className="pf-strength__todo" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* AADI Identity */}
          <section className="pf-card pf-id-card">
            <h2 className="pf-card__title">Your AADI Identity</h2>
            <div className="pf-id-card__body">
              <div className="pf-id-card__photo">
                {photo ? (
                  <img src={photo} alt={identity.fullName} />
                ) : (
                  <span className="pf-id-card__initials">{initials}</span>
                )}
              </div>
              <span className="pf-id-card__name">{identity.fullName}</span>
              <span className="pf-id-card__aadi-id">{identity.aadiId}</span>
              <span className="pf-badge pf-badge--sm">AADI MEMBER</span>

              <div className="pf-id-card__qr">
                <QRCodeSVG value={profileUrl} size={110} level="M" bgColor="#FFFFFF" fgColor="#0B111E" />
              </div>

              <span className="pf-id-card__url">{profileUrl.replace('https://', '')}</span>

              <div className="pf-id-card__actions">
                <button className="pf-btn pf-btn--outline pf-btn--full" onClick={() => navigate('/dashboard/aadi-id')}>
                  View AADI ID
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
                <button className="pf-btn pf-btn--ghost pf-btn--full" onClick={handleShare}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  {shareStatus === 'copied' ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </section>

          {/* AADI Reputation */}
          <section className="pf-card pf-reputation">
            <h2 className="pf-card__title">AADI Reputation</h2>
            <div className="pf-reputation__body">
              <div className="pf-reputation__score">
                <span className="pf-reputation__pts">0 pts</span>
                <span className="pf-reputation__level">Level 1</span>
              </div>
              <div className="pf-reputation__track" aria-hidden="true">
                {LEVEL_STEPS.map((step, i) => (
                  <div key={step} className={`pf-track-step${i === 0 ? ' pf-track-step--active' : ''}`}>
                    <span className="pf-track-step__dot" />
                    <span className="pf-track-step__name">{step}</span>
                  </div>
                ))}
              </div>
              <p className="pf-reputation__text">Start contributing to build your reputation.</p>
              <button className="pf-btn pf-btn--ghost pf-btn--full" onClick={() => navigate('/dashboard')}>
                View reputation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </section>

          {/* Badges — placeholder shelf; badges unlock once the challenges system rolls out */}
          <section className="pf-card pf-badges">
            <h2 className="pf-card__title">Badges</h2>
            <div className="pf-badges__shelf">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="pf-badges__slot" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
              ))}
            </div>
            <p className="pf-badges__caption">Earn badges by completing challenges and contributing to the community.</p>
          </section>
        </div>
      </div>

      {cropOpen && pendingImage && (
        <PhotoCropEditor src={pendingImage} onApply={handleCropApply} onCancel={handleCropCancel} />
      )}

      {coverOpen && (
        <CoverSelector
          currentCover={cover}
          onSelect={handleCoverSelect}
          onUpload={handleCoverUpload}
          onCancel={() => setCoverOpen(false)}
        />
      )}

      {coverCropperSrc && (
        <CoverCropper
          src={coverCropperSrc}
          onApply={handleCoverCropApply}
          onCancel={handleCoverCropCancel}
        />
      )}
    </div>
  )
}
