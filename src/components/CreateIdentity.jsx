import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandSymbol } from './Logo.jsx'
import { generateAadiId, saveIdentity } from '../utils/identity.js'
import { getAccount, hasAccount } from '../utils/account.js'
import AadiIdCard from './AadiIdCard.jsx'
import PhotoCropEditor from './PhotoCropEditor.jsx'

function BookIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function CalendarIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function MapPinIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CameraIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

const AGE_RANGES = ['Under 15', '15–18', '18–24', '25+']
const DOMAINS = [
  'Data Science', 'Artificial Intelligence', 'Software Development',
  'Design', 'Business', 'Content', 'Entrepreneurship',
  'Engineering', 'Finance', 'Other',
]
const ROLES = ['Builder', 'Learner', 'Creator', 'Developer', 'Designer', 'Entrepreneur']
const CREATION_STEPS = [
  'Verifying your details',
  'Creating your identity',
  'Assigning your AADI ID',
  'Preparing your digital card',
]

export default function CreateIdentity() {
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({
    college: '', ageRange: '', domain: '', location: '',
  })
  const [roles, setRoles] = useState([])
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [creationStep, setCreationStep] = useState(0)
  const [aadiId, setAadiId] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [cropEditorOpen, setCropEditorOpen] = useState(false)
  const [pendingImageSrc, setPendingImageSrc] = useState(null)
  const fileInputRef = useRef(null)

  const account = getAccount()

  useEffect(() => {
    if (!hasAccount()) {
      navigate('/register', { replace: true })
    }
  }, [navigate])

  if (!account && step === 'form') {
    return null
  }

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const toggleRole = (role) => {
    setRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const validate = () => {
    const e = {}
    if (!form.college.trim()) e.college = 'Please enter your college or school.'
    if (!form.ageRange) e.ageRange = 'Please select your age range.'
    if (!form.domain) e.domain = 'Please select your domain.'
    setErrors(e)
    return e
  }

  const focusFirstError = (errs) => {
    const order = ['college', 'ageRange', 'domain']
    for (const key of order) {
      if (errs[key]) {
        const el = document.getElementById(`id-${key}`)
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' })
          el.focus()
        }
        break
      }
    }
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
      setPendingImageSrc(ev.target.result)
      setCropEditorOpen(true)
      setErrors(prev => ({ ...prev, photo: '' }))
    }
    reader.readAsDataURL(file)
  }

  const handleCropApply = (croppedDataUrl) => {
    setProfilePhoto(croppedDataUrl)
    setCropEditorOpen(false)
    setPendingImageSrc(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCropCancel = () => {
    setCropEditorOpen(false)
    setPendingImageSrc(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChangePhoto = () => {
    fileInputRef.current?.click()
  }

  const removePhoto = () => {
    setProfilePhoto(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs)
      return
    }

    const id = generateAadiId()
    const now = new Date().toISOString()
    setAadiId(id)
    setCreatedAt(now)

    saveIdentity({
      fullName: account.fullName,
      email: account.email,
      ageRange: form.ageRange,
      college: form.college.trim(),
      domain: form.domain,
      location: form.location.trim(),
      profilePhoto,
      roles,
      aadiId: id,
      createdAt: now,
    })

    setStep('creating')
    let current = 0
    const interval = setInterval(() => {
      current++
      setCreationStep(current)
      if (current >= CREATION_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => setStep('success'), 400)
      }
    }, 400)
  }

  if (step === 'creating') {
    return (
      <div className="auth">
        <div className="auth__form-panel" style={{ minHeight: '100vh' }}>
          <div className="id-creating">
            <div className="id-creating__icon">
              <BrandSymbol size={52} style={{ color: '#B5E84A' }} />
            </div>
            <h2 className="id-creating__heading">Creating your AADI identity...</h2>
            <div className="id-creating__steps">
              {CREATION_STEPS.map((text, i) => {
                const num = String(i + 1).padStart(2, '0')
                return (
                  <div
                    key={i}
                    className={`id-creating__step${i < creationStep ? ' done' : i === creationStep ? ' active' : ''}`}
                  >
                    <span className="id-creating__check">
                      {i < creationStep ? '✓' : num}
                    </span>
                    <span>{text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="auth">
        <div className="auth__form-panel" style={{ minHeight: '100vh' }}>
          <div className="id-success">
            <h2 className="id-success__heading">Your AADI ID is ready. 🎉</h2>
            <p className="id-success__subtitle">
              Your digital identity has been successfully created.
            </p>
            <div className="id-success__card">
              <AadiIdCard
                name={account.fullName}
                domain={form.domain}
                aadiId={aadiId}
                profilePhoto={profilePhoto}
                createdAt={createdAt}
                college={form.college.trim()}
                location={form.location.trim()}
                ageRange={form.ageRange}
              />
            </div>
            <div className="id-success__id">{aadiId}</div>
            <p className="id-success__note">Your identity within the AADI ecosystem.</p>
            <Link to="/welcome" className="auth__btn id-success__continue">
              Continue to AADI
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth">
      <div className="auth__topbar">
        <Link to="/" className="auth__topbar-brand">AADI HUB</Link>
        <Link to="/" className="auth__topbar-back">Back to AADI HUB</Link>
      </div>

      <div className="auth__visual">
        <img
          src="/loginimg.png"
          alt="AADI HUB — the youth ecosystem for the next generation"
        />
        <div className="auth__brand">
          <span className="auth__brand-line">Your <em>identity.</em></span>
          <span className="auth__brand-line">Your <em>AADI ID.</em></span>
          <span className="auth__brand-line">Your <em>ecosystem.</em></span>
        </div>
      </div>

      <div className="auth__form-panel">
        <div className="auth__inner">
          <span className="auth__eyebrow">Step 02 — Identity</span>
          <h1 className="auth__heading">Create your AADI identity.</h1>
          <p className="auth__sub">
            Your account is ready. Now create the identity you&apos;ll use across the AADI ecosystem.
          </p>

          <div className="auth__progress">
            <span className="auth__progress-step auth__progress-step--done">
              <span className="auth__progress-num">✓</span>
              <span className="auth__progress-text">Account</span>
            </span>
            <span className="auth__progress-sep" aria-hidden="true">→</span>
            <span className="auth__progress-step auth__progress-step--active">
              <span className="auth__progress-num">02</span>
              <span className="auth__progress-text">Identity</span>
            </span>
          </div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="auth__field">
              <label htmlFor="id-college">College / School</label>
              <div className="auth__input-wrap">
                <span className="auth__input-icon"><BookIcon size={17} /></span>
                <input
                  id="id-college"
                  type="text"
                  className={`auth__input${errors.college ? ' auth__input--error' : ''}`}
                  placeholder="Where do you study?"
                  value={form.college}
                  onChange={(e) => set('college', e.target.value)}
                />
              </div>
              <span className="auth__error">{errors.college || ''}</span>
            </div>

            <div className="auth__field">
              <label htmlFor="id-age">Age range</label>
              <div className="auth__input-wrap">
                <span className="auth__input-icon"><CalendarIcon size={17} /></span>
                <select
                  id="id-age"
                  className={`auth__input auth__select${errors.ageRange ? ' auth__input--error' : ''}${!form.ageRange ? ' auth__select--placeholder' : ''}`}
                  value={form.ageRange}
                  onChange={(e) => set('ageRange', e.target.value)}
                >
                  <option value="">Select age range</option>
                  {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <span className="auth__error">{errors.ageRange || ''}</span>
            </div>

            <div className="auth__field">
              <label htmlFor="id-domain">What do you build or learn?</label>
              <div className="auth__input-wrap">
                <span className="auth__input-icon"><BookIcon size={17} /></span>
                <select
                  id="id-domain"
                  className={`auth__input auth__select${errors.domain ? ' auth__input--error' : ''}${!form.domain ? ' auth__select--placeholder' : ''}`}
                  value={form.domain}
                  onChange={(e) => set('domain', e.target.value)}
                >
                  <option value="">Select your domain</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <span className="auth__error">{errors.domain || ''}</span>
            </div>

            <div className="auth__field">
              <label htmlFor="id-location">
                City / Location <span className="auth__optional">(optional)</span>
              </label>
              <div className="auth__input-wrap">
                <span className="auth__input-icon"><MapPinIcon size={17} /></span>
                <input
                  id="id-location"
                  type="text"
                  className="auth__input"
                  placeholder="e.g. Madanapalle"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                />
              </div>
            </div>

            <div className="auth__field">
              <label>
                Profile photo <span className="auth__optional">(optional)</span>
              </label>
              <div className="auth__photo-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="auth__photo-input"
                  aria-label="Upload profile photo"
                />
                <button
                  type="button"
                  className="auth__photo-circle"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={profilePhoto ? 'Change profile photo' : 'Upload profile photo'}
                >
                  {profilePhoto ? (
                    <>
                      <img src={profilePhoto} alt="Profile preview" className="auth__photo-preview" />
                      <span className="auth__photo-overlay">Change</span>
                    </>
                  ) : (
                    <span className="auth__photo-placeholder">
                      <CameraIcon size={22} />
                      <span>Add photo</span>
                    </span>
                  )}
                </button>
                {profilePhoto && (
                  <div className="auth__photo-actions">
                    <button
                      type="button"
                      className="auth__photo-change"
                      onClick={handleChangePhoto}
                    >
                      Change photo
                    </button>
                    <button
                      type="button"
                      className="auth__photo-remove"
                      onClick={removePhoto}
                      aria-label="Remove photo"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <span className="auth__error">{errors.photo || ''}</span>
            </div>

            <div className="auth__field">
              <label>What describes you? <span className="auth__optional">(optional)</span></label>
              <div className="auth__interests">
                {ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    className={`auth__interest${roles.includes(role) ? ' auth__interest--active' : ''}`}
                    onClick={() => toggleRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="auth__btn">
              Create my AADI ID
            </button>
          </form>

          {cropEditorOpen && pendingImageSrc && (
            <PhotoCropEditor
              src={pendingImageSrc}
              onApply={handleCropApply}
              onCancel={handleCropCancel}
            />
          )}
        </div>
      </div>
    </div>
  )
}
