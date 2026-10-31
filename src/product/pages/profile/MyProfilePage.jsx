import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import {
  updateMyProfile, uploadProfileMedia, validateImageFile, publicMediaUrl,
} from '../../../features/profile/profileApi.js'
import {
  Button, Field, TextInput, TextArea, Select, Chip, Avatar, InlineError, InlineSuccess,
} from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   My profile — the signed-in student's own editor.
   Saves through updateMyProfile (RLS: own row only) and refreshes the
   AuthContext so the shell, ID card and public page all pick up the change.
--------------------------------------------------------------------------- */

const DEGREES = [
  'B.Tech / B.E.', 'B.Sc.', 'BCA', 'BBA', 'B.A.', 'Other undergraduate',
  'M.Tech / M.E.', 'M.Sc.', 'MBA', 'MCA', 'Postgraduate', 'Diploma', 'Other',
]
const YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Graduated', 'Other']
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() + 1 + i))
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const INTEREST_CATALOG = [
  'Internships', 'Placements', 'Hackathons', 'Coding competitions', 'Research',
  'Scholarships', 'Certifications', 'Workshops', 'Open-source', 'Community learning',
  'Personal projects', 'Startup building', 'Entrepreneurship', 'Networking',
  'IIT and NIT programs',
]
const GOAL_OPTIONS = ['BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE']
const ROLE_OPTIONS = ['Developer', 'Designer', 'Researcher', 'Project Lead', 'Content Creator', 'Mentor']
const COLLAB_PREFS = [
  'Find project teammates', 'Join existing projects', 'Create and lead projects',
  'Find a co-founder', 'Join a startup team', 'Participate in hackathons',
  'Join technical communities', 'Discover internships and research', 'Learn with peers',
]

export default function MyProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const toast = useToast()
  const fileRef = useRef(null)

  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (!profile) return
    setForm({
      full_name: profile.full_name || '',
      headline: profile.headline || '',
      bio: profile.bio || '',
      college: profile.college || '',
      course: profile.course || '',
      department: profile.department || '',
      study_year: profile.study_year || '',
      graduation_year: profile.graduation_year ? String(profile.graduation_year) : '',
      location: profile.location || '',
      avatar_path: profile.avatar_path || '',
      github_url: profile.github_url || '',
      portfolio_url: profile.portfolio_url || '',
      linkedin_url: profile.linkedin_url || '',
      skills: profile.skills || [],
      skill_levels: profile.skill_levels || {},
      interests: profile.interests || [],
      goals: profile.goals || [],
      roles: profile.roles || [],
      collab_prefs: profile.collab_prefs || [],
      looking_for: profile.looking_for || '',
      is_public: profile.is_public !== false,
    })
  }, [profile])

  if (!form) return null

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }

  function toggle(key, value) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(x => x !== value) : [...f[key], value],
    }))
    setSaved(false)
  }

  function setLevel(skill, level) {
    setForm(f => ({ ...f, skill_levels: { ...f.skill_levels, [skill]: level } }))
    setSaved(false)
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) { setPhotoError(invalid); return }
    setPhotoError('')
    const { path, error: upErr } = await uploadProfileMedia(profile.id, file, 'avatar')
    if (upErr) { setPhotoError('Photo upload failed. Your other changes are untouched.'); return }
    set('avatar_path', path)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    const errs = {}
    if (form.full_name.trim().length < 2) errs.full_name = 'Enter your full name.'
    for (const [k, label] of [['github_url', 'GitHub'], ['portfolio_url', 'Portfolio'], ['linkedin_url', 'LinkedIn']]) {
      if (form[k].trim() && !/^https?:\/\/\S+$/i.test(form[k].trim())) errs[k] = `${label} must start with http(s)://`
    }
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (saving) return

    setSaving(true)
    const { error: saveErr } = await updateMyProfile(profile.id, {
      full_name: form.full_name.trim(),
      headline: form.headline,
      bio: form.bio,
      college: form.college,
      course: form.course,
      department: form.department,
      study_year: form.study_year,
      graduation_year: form.graduation_year || null,
      location: form.location,
      avatar_path: form.avatar_path,
      github_url: form.github_url,
      portfolio_url: form.portfolio_url,
      linkedin_url: form.linkedin_url,
      skills: form.skills,
      skill_levels: form.skill_levels,
      interests: form.interests,
      goals: form.goals,
      roles: form.roles,
      collab_prefs: form.collab_prefs,
      looking_for: form.looking_for,
      is_public: form.is_public,
    })
    setSaving(false)

    if (saveErr) { setError(saveErr.message || 'Could not save your profile.'); return }
    await refreshProfile()
    setSaved(true)
    toast.success('Profile saved.')
  }

  const avatarUrl = form.avatar_path ? publicMediaUrl(form.avatar_path) : null

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">My profile</h1>
          <p className="page-head__sub">
            What other students see at{' '}
            <Link to={`/u/${profile.aadi_id}`} style={{ color: 'var(--kiwi-400)' }}>/u/{profile.aadi_id}</Link>
            . Your email is never shown anywhere.
          </p>
        </div>
        <Link to="/aadi-id" className="p-btn p-btn--secondary p-btn--md">View AADI ID</Link>
      </div>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <InlineError>{error}</InlineError>
        {saved && <InlineSuccess>Profile saved. Your public page is up to date.</InlineSuccess>}
        {photoError && <InlineError>{photoError}</InlineError>}

        {/* identity */}
        <div className="p-card">
          <p className="form-section-title" style={{ marginBottom: 14 }}>Identity</p>
          <div className="form-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar src={avatarUrl} name={form.full_name} size={64} />
              <div>
                <button type="button" className="p-btn p-btn--secondary p-btn--sm"
                  onClick={() => fileRef.current?.click()}>
                  {avatarUrl ? 'Change photo' : 'Add photo'}
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhoto} style={{ display: 'none' }} />
                <p className="p-field__hint" style={{ marginTop: 6 }}>JPEG, PNG or WebP up to 5 MB.</p>
              </div>
            </div>

            <Field label="Full name" required error={fieldErrors.full_name}>
              {({ id }) => (
                <TextInput id={id} value={form.full_name} onChange={e => set('full_name', e.target.value)}
                  maxLength={120} error={fieldErrors.full_name} />
              )}
            </Field>

            <Field label="Headline" hint="One line under your name — what you do or are learning.">
              {({ id }) => (
                <TextInput id={id} value={form.headline} onChange={e => set('headline', e.target.value)}
                  placeholder="e.g. 3rd-year CSE student building AI study tools" maxLength={160} />
              )}
            </Field>

            <Field label="About you" hint="Up to 500 characters.">
              {({ id }) => (
                <TextArea id={id} rows={4} value={form.bio} onChange={e => set('bio', e.target.value)}
                  placeholder="A few lines about what you are building or learning…" maxLength={500} />
              )}
            </Field>
          </div>
        </div>

        {/* education */}
        <div className="p-card">
          <p className="form-section-title" style={{ marginBottom: 14 }}>Education</p>
          <div className="form-grid">
            <Field label="College or institution">
              {({ id }) => (
                <TextInput id={id} value={form.college} onChange={e => set('college', e.target.value)}
                  placeholder="e.g. Indian Institute of Technology, Delhi" maxLength={160} />
              )}
            </Field>
            <div className="form-grid--2">
              <Field label="Degree or qualification">
                {({ id }) => (
                  <Select id={id} value={form.course} onChange={e => set('course', e.target.value)}
                    placeholder="Choose qualification" options={DEGREES.map(d => ({ value: d, label: d }))} />
                )}
              </Field>
              <Field label="Department or branch">
                {({ id }) => (
                  <TextInput id={id} value={form.department} onChange={e => set('department', e.target.value)}
                    placeholder="e.g. Computer Science" maxLength={160} />
                )}
              </Field>
            </div>
            <div className="form-grid--2">
              <Field label="Current academic year">
                {({ id }) => (
                  <Select id={id} value={form.study_year} onChange={e => set('study_year', e.target.value)}
                    placeholder="Choose year" options={YEARS.map(y => ({ value: y, label: y }))} />
                )}
              </Field>
              <Field label="Expected graduation year">
                {({ id }) => (
                  <Select id={id} value={form.graduation_year} onChange={e => set('graduation_year', e.target.value)}
                    placeholder="Choose year" options={GRAD_YEARS.map(y => ({ value: y, label: y }))} />
                )}
              </Field>
            </div>
            <Field label="City">
              {({ id }) => (
                <TextInput id={id} value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Pune" maxLength={120} />
              )}
            </Field>
          </div>
        </div>

        {/* skills */}
        <div className="p-card">
          <p className="form-section-title" style={{ marginBottom: 14 }}>Skills — self-reported levels</p>
          {form.skills.length === 0 ? (
            <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)', marginBottom: 14 }}>
              No skills added yet. Skills help teammates find you.
            </p>
          ) : (
            <div className="form-grid" style={{ gap: 8, marginBottom: 14 }}>
              {form.skills.map(s => (
                <div className="skill-item" key={s}>
                  <span className="skill-item__name">{s}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Select value={form.skill_levels[s] || 'Beginner'}
                      onChange={e => setLevel(s, e.target.value)}
                      options={SKILL_LEVELS.map(l => ({ value: l, label: l }))}
                      aria-label={`Level for ${s}`} />
                    <button type="button" className="p-iconbtn" aria-label={`Remove ${s}`}
                      onClick={() => setForm(f => {
                        const lv = { ...f.skill_levels }
                        delete lv[s]
                        return { ...f, skills: f.skills.filter(x => x !== s), skill_levels: lv }
                      })}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="chip-cloud">
            {['Python', 'Java', 'JavaScript', 'React', 'AI', 'Machine Learning', 'UI/UX Design', 'Cloud', 'Data Analysis', 'Cybersecurity', 'Content Creation', 'Research'].map(s => (
              <Chip key={s} label={s} selected={form.skills.includes(s)} onToggle={() => toggle('skills', s)} />
            ))}
          </div>
        </div>

        {/* interests & goals */}
        <div className="p-card">
          <p className="form-section-title" style={{ marginBottom: 14 }}>Interests &amp; goals</p>
          <div className="form-grid">
            <div>
              <p className="p-field__hint" style={{ marginBottom: 8 }}>Interests</p>
              <div className="chip-cloud">
                {INTEREST_CATALOG.map(i => (
                  <Chip key={i} label={i} selected={form.interests.includes(i)} onToggle={() => toggle('interests', i)} />
                ))}
              </div>
            </div>
            <div>
              <p className="p-field__hint" style={{ marginBottom: 8 }}>Goals</p>
              <div className="chip-cloud">
                {GOAL_OPTIONS.map(g => (
                  <Chip key={g} label={g} selected={form.goals.includes(g)} onToggle={() => toggle('goals', g)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* collaboration */}
        <div className="p-card">
          <p className="form-section-title" style={{ marginBottom: 14 }}>Collaboration</p>
          <div className="form-grid">
            <div>
              <p className="p-field__hint" style={{ marginBottom: 8 }}>What you want to do here</p>
              <div className="chip-cloud">
                {COLLAB_PREFS.map(p => (
                  <Chip key={p} label={p} selected={form.collab_prefs.includes(p)} onToggle={() => toggle('collab_prefs', p)} />
                ))}
              </div>
            </div>
            <div>
              <p className="p-field__hint" style={{ marginBottom: 8 }}>Roles you enjoy</p>
              <div className="chip-cloud">
                {ROLE_OPTIONS.map(r => (
                  <Chip key={r} label={r} selected={form.roles.includes(r)} onToggle={() => toggle('roles', r)} />
                ))}
              </div>
            </div>
            <Field label="Looking for" hint="Shown on your public profile so people can reach out.">
              {({ id }) => (
                <TextInput id={id} value={form.looking_for} onChange={e => set('looking_for', e.target.value)}
                  placeholder="e.g. a frontend teammate for a hackathon" maxLength={160} />
              )}
            </Field>
          </div>
        </div>

        {/* links + privacy */}
        <div className="p-card">
          <p className="form-section-title" style={{ marginBottom: 14 }}>Links &amp; privacy</p>
          <div className="form-grid">
            <Field label="GitHub" error={fieldErrors.github_url}>
              {({ id }) => (
                <TextInput id={id} type="url" value={form.github_url} onChange={e => set('github_url', e.target.value)}
                  placeholder="https://github.com/yourname" error={fieldErrors.github_url} />
              )}
            </Field>
            <Field label="Portfolio website" error={fieldErrors.portfolio_url}>
              {({ id }) => (
                <TextInput id={id} type="url" value={form.portfolio_url} onChange={e => set('portfolio_url', e.target.value)}
                  placeholder="https://yourname.dev" error={fieldErrors.portfolio_url} />
              )}
            </Field>
            <Field label="LinkedIn" error={fieldErrors.linkedin_url}>
              {({ id }) => (
                <TextInput id={id} type="url" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/yourname" error={fieldErrors.linkedin_url} />
              )}
            </Field>
            <div>
              <p className="p-field__hint" style={{ marginBottom: 8 }}>Who can view your profile</p>
              <div className="chip-cloud">
                <Chip label="Public — anyone with my link" selected={form.is_public} onToggle={() => set('is_public', true)} />
                <Chip label="Restricted — signed-in students" selected={!form.is_public} onToggle={() => set('is_public', false)} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" loading={saving}>Save profile</Button>
        </div>
      </form>
    </div>
  )
}
