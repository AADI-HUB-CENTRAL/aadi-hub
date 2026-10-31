import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { updateMyProfile, uploadProfileMedia, validateImageFile, publicMediaUrl } from '../../../features/profile/profileApi.js'
import {
  ProductLogo, Button, Field, TextInput, TextArea, Select, Chip, Avatar,
  InlineError, InlineSuccess, StepBar, PageState,
} from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Onboarding — 5-step student setup.
   * Progress is persisted to the profile row on every step transition, so a
     student can leave and resume (guards redirect incomplete users here).
   * onboarding_completed_at is only set after the final validation passes
     AND the final save succeeds — never optimistically.
   * Optional fields never block completion.
--------------------------------------------------------------------------- */

const STEPS = ['Identity', 'Skills', 'Goals', 'Collaboration', 'Review']

const DEGREES = [
  'B.Tech / B.E.', 'B.Sc.', 'BCA', 'BBA', 'B.A.', 'Other undergraduate',
  'M.Tech / M.E.', 'M.Sc.', 'MBA', 'MCA', 'Postgraduate', 'Diploma', 'Other',
]

const YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Graduated', 'Other']

const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() + 1 + i))

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const SKILL_CATALOG = [
  { group: 'Programming', items: ['Python', 'Java', 'C / C++', 'JavaScript', 'TypeScript', 'SQL', 'Go', 'Rust'] },
  { group: 'Technology', items: ['AI', 'Machine Learning', 'Data Science', 'Data Analysis', 'Web Development', 'App Development', 'Cloud', 'Cybersecurity', 'DevOps', 'Internet of Things'] },
  { group: 'Creative', items: ['UI/UX Design', 'Graphic Design', 'Video Editing', 'Content Creation', 'Technical Writing'] },
  { group: 'Business & research', items: ['Entrepreneurship', 'Product Management', 'Research', 'Marketing', 'Business Development', 'Communication', 'Leadership'] },
]

const ALL_SKILLS = SKILL_CATALOG.flatMap(c => c.items)

const INTEREST_CATALOG = [
  { group: 'Opportunities', items: ['Internships', 'Placements', 'Hackathons', 'Coding competitions', 'Research', 'Scholarships', 'Certifications'] },
  { group: 'Learning', items: ['Workshops', 'Open-source', 'Community learning', 'Personal projects', 'IIT and NIT programs'] },
  { group: 'Building', items: ['Startup building', 'Entrepreneurship', 'Networking'] },
]

const GOALS = ['BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE']

const COLLAB_PREFS = [
  'Find project teammates', 'Join existing projects', 'Create and lead projects',
  'Find a co-founder', 'Join a startup team', 'Participate in hackathons',
  'Join technical communities', 'Discover internships and research', 'Learn with peers',
]

const COLLAB_ROLES = ['Developer', 'Designer', 'Researcher', 'Project Lead', 'Content Creator', 'Mentor']

const COLLAB_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'In person' },
  { value: 'hybrid', label: 'Hybrid' },
]

const emptyDraft = {
  full_name: '', college: '', course: '', department: '', study_year: '',
  graduation_year: '', location: '', bio: '',
  avatar_path: '', avatar_url: '',
  skills: [], skill_levels: {},
  links: { github_url: '', portfolio_url: '', linkedin_url: '' },
  interests: [], goals: [],
  collab_prefs: [], roles: [], collab_mode: '', looking_for: '',
  is_public: true,
}

function draftFromProfile(profile) {
  if (!profile) return { ...emptyDraft }
  return {
    full_name: profile.full_name || '',
    college: profile.college || '',
    course: profile.course || '',
    department: profile.department || '',
    study_year: profile.study_year || '',
    graduation_year: profile.graduation_year ? String(profile.graduation_year) : '',
    location: profile.location || '',
    bio: profile.bio || '',
    avatar_path: profile.avatar_path || '',
    avatar_url: publicMediaUrl(profile.avatar_path) || '',
    skills: profile.skills || [],
    skill_levels: profile.skill_levels || {},
    links: {
      github_url: profile.github_url || '',
      portfolio_url: profile.portfolio_url || '',
      linkedin_url: profile.linkedin_url || '',
    },
    interests: profile.interests || [],
    goals: profile.goals || [],
    collab_prefs: profile.collab_prefs || [],
    roles: profile.roles || [],
    collab_mode: profile.collab_mode || '',
    looking_for: profile.looking_for || '',
    is_public: profile.is_public !== false,
  }
}

function draftToPatch(d, { final = false } = {}) {
  const patch = {
    full_name: d.full_name.trim(),
    college: d.college.trim() || null,
    course: d.course || null,
    department: d.department.trim() || null,
    study_year: d.study_year || null,
    graduation_year: d.graduation_year ? Number(d.graduation_year) : null,
    location: d.location.trim() || null,
    bio: d.bio.trim() || null,
    avatar_path: d.avatar_path || null,
    skills: d.skills,
    skill_levels: d.skill_levels,
    github_url: d.links.github_url.trim() || null,
    portfolio_url: d.links.portfolio_url.trim() || null,
    linkedin_url: d.links.linkedin_url.trim() || null,
    interests: d.interests,
    goals: d.goals,
    collab_prefs: d.collab_prefs,
    roles: d.roles,
    collab_mode: d.collab_mode || null,
    looking_for: d.looking_for.trim() || null,
    is_public: d.is_public,
  }
  if (final) patch.onboarding_completed_at = new Date().toISOString()
  return patch
}

function validateStep(step, d) {
  const errs = {}
  if (step === 0) {
    if (d.full_name.trim().length < 2) errs.full_name = 'Enter your full name.'
    if (!d.college.trim()) errs.college = 'College or institution is required.'
    if (!d.course) errs.course = 'Choose your degree or qualification.'
    if (!d.study_year) errs.study_year = 'Choose your current academic year.'
    if (d.graduation_year && !GRAD_YEARS.includes(d.graduation_year)) errs.graduation_year = 'Choose a valid graduation year.'
  }
  if (step === 1) {
    for (const url of [d.links.github_url, d.links.portfolio_url, d.links.linkedin_url]) {
      if (url.trim() && !/^https?:\/\/\S+$/i.test(url.trim())) {
        errs.links = 'Links must start with http:// or https://'
        break
      }
    }
  }
  return errs
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(() => draftFromProfile(profile))
  const [errors, setErrors] = useState({})
  const [pageError, setPageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const [skillQuery, setSkillQuery] = useState('')
  const [customSkill, setCustomSkill] = useState('')

  useEffect(() => {
    if (profile) setDraft(d => ({ ...draftFromProfile(profile), ...pickLocal(d) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  // Local-only UI state that must survive a profile refresh.
  function pickLocal(d) { return { avatar_url: d.avatar_url } }

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }))

  const visibleSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase()
    if (!q) return SKILL_CATALOG
    return SKILL_CATALOG
      .map(c => ({ ...c, items: c.items.filter(i => i.toLowerCase().includes(q)) }))
      .filter(c => c.items.length > 0)
  }, [skillQuery])

  function toggle(listKey, item) {
    setDraft(d => {
      const list = d[listKey]
      const next = list.includes(item) ? list.filter(x => x !== item) : [...list, item]
      return { ...d, [listKey]: next }
    })
  }

  function setSkillLevel(skill, level) {
    setDraft(d => ({
      ...d,
      skill_levels: { ...d.skill_levels, [skill]: level },
    }))
  }

  function addCustomSkill() {
    const v = customSkill.trim()
    if (!v || draft.skills.includes(v)) return
    setDraft(d => ({ ...d, skills: [...d.skills, v], skill_levels: { ...d.skill_levels, [v]: d.skill_levels[v] || 'Beginner' } }))
    setCustomSkill('')
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) { setPhotoError(invalid); return }
    setPhotoError('')
    setSaving(true)
    const { path, error } = await uploadProfileMedia(profile?.id, file, 'avatar')
    if (error) {
      setSaving(false)
      setPhotoError('Could not upload the photo. You can continue without it.')
      return
    }
    setDraft(d => ({ ...d, avatar_path: path, avatar_url: publicMediaUrl(path) || '' }))
    setSaving(false)
  }

  /** Persist the current draft; `final` also stamps completion. */
  async function persist(final = false) {
    setSaving(true)
    const { error } = await updateMyProfile(profile.id, draftToPatch(draft, { final }))
    setSaving(false)
    if (error) {
      setPageError(error.message || 'Could not save your progress. Check your connection and try again.')
      return false
    }
    setPageError('')
    if (final) {
      await refreshProfile()
      navigate('/dashboard', { replace: true })
    }
    return true
  }

  async function handleNext() {
    const errs = validateStep(step, draft)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    const ok = await persist(false)
    setSaving(false)
    if (ok) { setStep(s => Math.min(s + 1, STEPS.length - 1)); window.scrollTo(0, 0) }
  }

  function handleBack() {
    setErrors({})
    setPageError('')
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo(0, 0)
  }

  async function handleFinish() {
    const errs = validateStep(0, draft)
    if (Object.keys(errs).length > 0) { setStep(0); setErrors(errs); return }
    if (!draft.full_name.trim()) { setStep(0); return }
    const ok = await persist(true)
    if (!ok) setPageError('Your profile was not marked complete because saving failed. Nothing was lost — please try again.')
  }

  if (!profile) {
    return <PageState title="Loading your profile…" body="One moment while we prepare your setup." />
  }

  return (
    <div className="onb-page">
      <header className="onb-top">
        <ProductLogo symbol={24} size={17} />
        <button type="button" className="onb-top__skip" onClick={() => navigate('/dashboard')}>
          Save &amp; finish later
        </button>
      </header>

      <div className="onb-body">
        <div style={{ marginBottom: 26 }}>
          <StepBar steps={STEPS} current={step} />
        </div>

        <div className="onb-step-head">
          <p className="onb-step-head__eyebrow">Step {step + 1} of {STEPS.length}</p>
          {step === 0 && (
            <>
              <h1>Your student identity</h1>
              <p>This is the foundation of your AADI profile. Required fields only — everything else can wait.</p>
            </>
          )}
          {step === 1 && (
            <>
              <h1>Skills &amp; expertise</h1>
              <p>Pick what you actually work with and how confident you are. These levels are self-reported, not verified.</p>
            </>
          )}
          {step === 2 && (
            <>
              <h1>Interests &amp; goals</h1>
              <p>Tell us what you are here for. We use this to organise your experience — not to make promises about recommendations.</p>
            </>
          )}
          {step === 3 && (
            <>
              <h1>How you want to collaborate</h1>
              <p>Choose what you want to do on AADI HUB and how you prefer to work with teammates.</p>
            </>
          )}
          {step === 4 && (
            <>
              <h1>Review &amp; privacy</h1>
              <p>Check everything below, choose who can see your profile, then complete setup.</p>
            </>
          )}
        </div>

        <InlineError>{pageError}</InlineError>
        {step === 4 && !pageError && <div style={{ height: 12 }} />}

        {/* ---------------------------- STEP 1 ---------------------------- */}
        {step === 0 && (
          <div className="form-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar src={draft.avatar_url} name={draft.full_name} size={64} />
              <div>
                <label className="p-btn p-btn--secondary p-btn--sm" style={{ cursor: 'pointer' }}>
                  {draft.avatar_url ? 'Change photo' : 'Add photo'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto}
                    style={{ display: 'none' }} disabled={saving} />
                </label>
                <p className="p-field__hint" style={{ marginTop: 6 }}>JPEG, PNG or WebP up to 5 MB. Optional.</p>
              </div>
            </div>
            {photoError && <InlineError>{photoError}</InlineError>}

            <Field label="Full name" required error={errors.full_name}>
              {({ id }) => (
                <TextInput id={id} value={draft.full_name} onChange={e => set('full_name', e.target.value)}
                  placeholder="Your full name" autoComplete="name" error={errors.full_name} />
              )}
            </Field>

            <Field label="College or institution" required error={errors.college}
              hint="Type it in — we do not require your college to be in a fixed list.">
              {({ id }) => (
                <TextInput id={id} value={draft.college} onChange={e => set('college', e.target.value)}
                  placeholder="e.g. Indian Institute of Technology, Delhi" autoComplete="organization"
                  error={errors.college} />
              )}
            </Field>

            <div className="form-grid--2">
              <Field label="Degree or qualification" required error={errors.course}>
                {({ id }) => (
                  <Select id={id} value={draft.course} onChange={e => set('course', e.target.value)}
                    placeholder="Choose qualification" options={DEGREES} error={errors.course} />
                )}
              </Field>
              <Field label="Department or branch" hint="Optional">
                {({ id }) => (
                  <TextInput id={id} value={draft.department} onChange={e => set('department', e.target.value)}
                    placeholder="e.g. Computer Science" />
                )}
              </Field>
            </div>

            <div className="form-grid--2">
              <Field label="Current academic year" required error={errors.study_year}>
                {({ id }) => (
                  <Select id={id} value={draft.study_year} onChange={e => set('study_year', e.target.value)}
                    placeholder="Choose year" options={YEARS} error={errors.study_year} />
                )}
              </Field>
              <Field label="Expected graduation year" error={errors.graduation_year} hint="Optional">
                {({ id }) => (
                  <Select id={id} value={draft.graduation_year} onChange={e => set('graduation_year', e.target.value)}
                    placeholder="Choose year" options={GRAD_YEARS} error={errors.graduation_year} />
                )}
              </Field>
            </div>

            <Field label="City" hint="Optional — helps teammates find you for in-person work.">
              {({ id }) => (
                <TextInput id={id} value={draft.location} onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Pune" autoComplete="address-level2" />
              )}
            </Field>

            <Field label="Short bio" hint="Optional. A sentence or two about what you are building or learning.">
              {({ id }) => (
                <TextArea id={id} rows={3} value={draft.bio} onChange={e => set('bio', e.target.value)}
                  placeholder="I build…" maxLength={500} />
              )}
            </Field>
          </div>
        )}

        {/* ---------------------------- STEP 2 ---------------------------- */}
        {step === 1 && (
          <div className="form-grid">
            <Field label="Search skills">
              {({ id }) => (
                <TextInput id={id} type="search" value={skillQuery} onChange={e => setSkillQuery(e.target.value)}
                  placeholder="e.g. Python, design, cloud…" />
              )}
            </Field>

            {draft.skills.length > 0 && (
              <div>
                <p className="form-section-title" style={{ marginBottom: 8 }}>
                  Your skills ({draft.skills.length})
                </p>
                <div className="form-grid" style={{ gap: 8 }}>
                  {draft.skills.map(s => (
                    <div className="skill-item" key={s}>
                      <span className="skill-item__name">{s}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Select
                          value={draft.skill_levels[s] || 'Beginner'}
                          onChange={e => setSkillLevel(s, e.target.value)}
                          options={SKILL_LEVELS.map(l => ({ value: l, label: l }))}
                          aria-label={`Level for ${s}`}
                        />
                        <button type="button" className="p-iconbtn" aria-label={`Remove ${s}`}
                          onClick={() => setDraft(d => {
                            const levels = { ...d.skill_levels }
                            delete levels[s]
                            return { ...d, skills: d.skills.filter(x => x !== s), skill_levels: levels }
                          })}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visibleSkills.map(cat => (
              <div key={cat.group}>
                <p className="form-section-title" style={{ marginBottom: 8 }}>{cat.group}</p>
                <div className="chip-cloud">
                  {cat.items.map(item => (
                    <Chip key={item} label={item} selected={draft.skills.includes(item)}
                      onToggle={() => toggle('skills', item)} />
                  ))}
                </div>
              </div>
            ))}

            <div className="custom-add">
              <TextInput value={customSkill} onChange={e => setCustomSkill(e.target.value)}
                placeholder="Add a skill not listed" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill() } }} />
              <Button variant="secondary" onClick={addCustomSkill} disabled={!customSkill.trim()}>Add</Button>
            </div>

            <p className="form-section-title">Portfolio links <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(optional)</span></p>
            {errors.links && <InlineError>{errors.links}</InlineError>}
            <Field label="GitHub">
              {({ id }) => (
                <TextInput id={id} type="url" value={draft.links.github_url}
                  onChange={e => setDraft(d => ({ ...d, links: { ...d.links, github_url: e.target.value } }))}
                  placeholder="https://github.com/yourname" />
              )}
            </Field>
            <Field label="Portfolio website">
              {({ id }) => (
                <TextInput id={id} type="url" value={draft.links.portfolio_url}
                  onChange={e => setDraft(d => ({ ...d, links: { ...d.links, portfolio_url: e.target.value } }))}
                  placeholder="https://yourname.dev" />
              )}
            </Field>
            <Field label="LinkedIn">
              {({ id }) => (
                <TextInput id={id} type="url" value={draft.links.linkedin_url}
                  onChange={e => setDraft(d => ({ ...d, links: { ...d.links, linkedin_url: e.target.value } }))}
                  placeholder="https://linkedin.com/in/yourname" />
              )}
            </Field>
          </div>
        )}

        {/* ---------------------------- STEP 3 ---------------------------- */}
        {step === 2 && (
          <div className="form-grid">
            {INTEREST_CATALOG.map(cat => (
              <div key={cat.group}>
                <p className="form-section-title" style={{ marginBottom: 8 }}>{cat.group}</p>
                <div className="chip-cloud">
                  {cat.items.map(item => (
                    <Chip key={item} label={item} selected={draft.interests.includes(item)}
                      onToggle={() => toggle('interests', item)} />
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="form-section-title" style={{ marginBottom: 8 }}>Current goals</p>
              <div className="chip-cloud">
                {GOALS.map(g => (
                  <Chip key={g} label={g} selected={draft.goals.includes(g)}
                    onToggle={() => toggle('goals', g)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------- STEP 4 ---------------------------- */}
        {step === 3 && (
          <div className="form-grid">
            <div>
              <p className="form-section-title" style={{ marginBottom: 8 }}>What do you want to do here?</p>
              <div className="chip-cloud">
                {COLLAB_PREFS.map(p => (
                  <Chip key={p} label={p} selected={draft.collab_prefs.includes(p)}
                    onToggle={() => toggle('collab_prefs', p)} />
                ))}
              </div>
            </div>

            <div>
              <p className="form-section-title" style={{ marginBottom: 8 }}>Roles you enjoy <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional)</span></p>
              <div className="chip-cloud">
                {COLLAB_ROLES.map(r => (
                  <Chip key={r} label={r} selected={draft.roles.includes(r)}
                    onToggle={() => toggle('roles', r)} />
                ))}
              </div>
            </div>

            <Field label="Preferred collaboration mode" hint="Optional">
              {({ id }) => (
                <Select id={id} value={draft.collab_mode} onChange={e => set('collab_mode', e.target.value)}
                  placeholder="No preference" options={COLLAB_MODES} />
              )}
            </Field>

            <Field label="What are you looking for?" hint="Optional. e.g. a frontend teammate for a hackathon project.">
              {({ id }) => (
                <TextInput id={id} value={draft.looking_for} onChange={e => set('looking_for', e.target.value)}
                  placeholder="Teammates, mentorship, an idea to join…" maxLength={160} />
              )}
            </Field>
          </div>
        )}

        {/* ---------------------------- STEP 5 ---------------------------- */}
        {step === 4 && (
          <div className="onb-review">
            <ReviewCard title="Identity" onEdit={() => setStep(0)}>
              <strong>{draft.full_name || '—'}</strong>
              <br />
              {[draft.course, draft.department].filter(Boolean).join(' · ') || 'Degree not set'}
              <br />
              {[draft.college, draft.study_year].filter(Boolean).join(' · ') || 'College not set'}
              {draft.location && (<><br />{draft.location}</>)}
              {draft.bio && (<><br />{draft.bio}</>)}
            </ReviewCard>

            <ReviewCard title={`Skills (${draft.skills.length})`} onEdit={() => setStep(1)}>
              {draft.skills.length === 0
                ? 'No skills selected yet.'
                : draft.skills.map(s => `${s} — ${draft.skill_levels[s] || 'Beginner'}`).join(' · ')}
              {Object.values(draft.links).some(Boolean) && (
                <>
                  <br />
                  {[draft.links.github_url, draft.links.portfolio_url, draft.links.linkedin_url]
                    .filter(Boolean).join(' · ')}
                </>
              )}
            </ReviewCard>

            <ReviewCard title="Interests & goals" onEdit={() => setStep(2)}>
              {draft.interests.length === 0 && draft.goals.length === 0
                ? 'Nothing selected yet.'
                : [...draft.interests, ...draft.goals].join(' · ')}
            </ReviewCard>

            <ReviewCard title="Collaboration" onEdit={() => setStep(3)}>
              {draft.collab_prefs.length === 0 && !draft.collab_mode && !draft.looking_for
                ? 'No preferences set yet.'
                : [
                    draft.collab_prefs.join(' · '),
                    draft.roles.length ? `Roles: ${draft.roles.join(', ')}` : '',
                    draft.collab_mode ? `Mode: ${draft.collab_mode}` : '',
                    draft.looking_for,
                  ].filter(Boolean).join(' — ')}
            </ReviewCard>

            <div className="onb-review__card">
              <div className="onb-review__card-head">
                <h3>Profile visibility</h3>
              </div>
              <div className="chip-cloud" style={{ marginBottom: 10 }}>
                <Chip label="Public — anyone with my link" selected={draft.is_public}
                  onToggle={() => set('is_public', true)} />
                <Chip label="Restricted — signed-in students only" selected={!draft.is_public}
                  onToggle={() => set('is_public', false)} />
              </div>
              <p className="p-field__hint">
                {draft.is_public
                  ? 'Your profile page is reachable by anyone with your AADI ID link. Your email is never shown.'
                  : 'Only signed-in AADI HUB students can view your profile. Your email is never shown either way.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="onb-nav">
        <div className="onb-nav__inner">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0 || saving}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} loading={saving}>Continue</Button>
          ) : (
            <Button onClick={handleFinish} loading={saving}>Complete my profile</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ title, onEdit, children }) {
  return (
    <div className="onb-review__card">
      <div className="onb-review__card-head">
        <h3>{title}</h3>
        <button type="button" className="onb-review__edit" onClick={onEdit}>Edit</button>
      </div>
      <div className="onb-review__lines">{children}</div>
    </div>
  )
}
