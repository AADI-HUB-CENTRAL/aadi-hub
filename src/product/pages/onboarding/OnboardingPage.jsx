import { useState, useEffect, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { updateMyProfile, uploadProfileMedia, validateImageFile, publicMediaUrl } from '../../../features/profile/profileApi.js'
import {
  ProductLogo, Button, Field, TextInput, TextArea, Select, Chip, Avatar,
  InlineError, StepBar, PageState,
} from '../../ui/kit.jsx'
import '../../styles/onboarding.css'

/* ---------------------------------------------------------------------------
   Onboarding — 7-step student setup.
   * Step 0 is Welcome; then Profile, Skills, Interests, Goals, Collaboration,
     Review.
    * Progress (draft data) is persisted to the profile row on every step
      transition, so a student can leave and resume — guards redirect
      incomplete users here, and the step index is remembered per account so
      a new session continues at the right step. The answers themselves only
      ever live in the database.
   * onboarding_completed_at is only set after the final validation passes
     AND the final save succeeds — never optimistically.
   * On first-time completion the student lands on the welcome experience.
   * Optional fields never block completion.
--------------------------------------------------------------------------- */

const STEPS = ['Welcome', 'Profile', 'Skills', 'Interests', 'Goals', 'Collaboration', 'Review']

const STEP_KEY = 'aadi_onboarding_step'

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

const INTERESTS = [
  'AI & Machine Learning', 'Data Science & Analytics', 'Web & App Development',
  'Design & Creativity', 'Startups & Entrepreneurship', 'Research & Innovation',
  'Content & Media', 'Gaming', 'Business & Marketing', 'Robotics & Hardware', 'Other',
]

const GOALS = [
  'Find internships and opportunities', 'Build real-world projects',
  'Meet collaborators or teammates', 'Join student communities',
  'Participate in challenges and hackathons', 'Improve skills', 'Explore research',
  'Start a venture or initiative', 'Showcase my work',
]

const COLLAB_PREFS = [
  'Join existing teams', 'Find teammates for my ideas', 'Work on individual projects',
  'Participate in competitions', 'Explore communities first', 'Find a co-founder',
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
  if (step === 1) {
    if (d.full_name.trim().length < 2) errs.full_name = 'Enter your full name.'
    if (!d.college.trim()) errs.college = 'College or institution is required.'
    if (!d.course) errs.course = 'Choose your degree or qualification.'
    if (!d.study_year) errs.study_year = 'Choose your current academic year.'
    if (d.graduation_year && !GRAD_YEARS.includes(d.graduation_year)) errs.graduation_year = 'Choose a valid graduation year.'
  }
  if (step === 2) {
    for (const url of [d.links.github_url, d.links.portfolio_url, d.links.linkedin_url]) {
      if (url.trim() && !/^https?:\/\/\S+$/i.test(url.trim())) {
        errs.links = 'Links must start with http:// or https://'
        break
      }
    }
  }
  return errs
}

function stepStorageKey(userId) {
  return `${STEP_KEY}:${userId || 'anon'}`
}

function readResumeStep(userId) {
  try {
    const n = Number(window.localStorage.getItem(stepStorageKey(userId)))
    if (Number.isInteger(n) && n >= 1 && n < STEPS.length) return n
  } catch { /* storage unavailable — start from the top */ }
  return 0
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  const [step, setStep] = useState(() => readResumeStep(profile?.id))
  const [draft, setDraft] = useState(() => draftFromProfile(profile))
  const [errors, setErrors] = useState({})
  const [pageError, setPageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const [skillQuery, setSkillQuery] = useState('')
  const [customSkill, setCustomSkill] = useState('')
  const [customInterest, setCustomInterest] = useState('')

  useEffect(() => {
    if (profile) setDraft(d => ({ ...draftFromProfile(profile), ...pickLocal(d) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  useEffect(() => {
    try { window.localStorage.setItem(stepStorageKey(profile?.id), String(step)) } catch { /* ignore */ }
  }, [step, profile?.id])

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

  function addCustomInterest() {
    const v = customInterest.trim()
    if (!v || draft.interests.includes(v)) return
    setDraft(d => ({ ...d, interests: [...d.interests, v] }))
    setCustomInterest('')
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
    return true
  }

  async function handleNext() {
    // The welcome step carries no data — move on without a network write.
    if (step === 0) {
      setStep(1)
      window.scrollTo(0, 0)
      return
    }
    const errs = validateStep(step, draft)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const ok = await persist(false)
    if (ok) { setStep(s => Math.min(s + 1, STEPS.length - 1)); window.scrollTo(0, 0) }
  }

  function handleBack() {
    setErrors({})
    setPageError('')
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo(0, 0)
  }

  async function handleFinish() {
    const errs = validateStep(1, draft)
    if (Object.keys(errs).length > 0) { setStep(1); setErrors(errs); return }
    const ok = await persist(true)
    if (!ok) {
      setPageError('Your profile was not marked complete because saving failed. Nothing was lost — please try again.')
      return
    }
    try { window.localStorage.removeItem(stepStorageKey(profile?.id)) } catch { /* ignore */ }
    // Refresh the shared profile so guards see the completion stamp, then run
    // the first-time welcome experience (only ever reached after a real save).
    await refreshProfile()
    navigate('/welcome', { replace: true, state: { fromOnboarding: true } })
  }

  if (!profile) {
    return <PageState title="Loading your profile…" body="One moment while we prepare your setup." />
  }

  // Already finished (e.g. a stale-tab revisit) — the dashboard is the truth.
  if (profile.onboarding_completed_at) return <Navigate to="/dashboard" replace />

  return (
    <div className="onb-page">
      <header className="onb-top">
        <ProductLogo symbol={24} size={17} />
      </header>

      <div className="onb-body">
        <div style={{ marginBottom: 26 }}>
          <StepBar steps={STEPS} current={step} />
        </div>

        <div className="onb-step-head">
          <p className="onb-step-head__eyebrow">Step {step + 1} of {STEPS.length}</p>
          {step === 0 && (
            <>
              <h1>Let's make AADI HUB yours.</h1>
              <p>A few quick answers help us shape projects, opportunities, and communities around what you actually care about. You choose what to share, and you can change it later.</p>
            </>
          )}
          {step === 1 && (
            <>
              <h1>Your student profile</h1>
              <p>The basics that identify you to teammates. Only your name and college are required — everything else is optional.</p>
            </>
          )}
          {step === 2 && (
            <>
              <h1>What can you bring to a team?</h1>
              <p>Pick the skills you can contribute. Still learning something? Set it to Beginner — everyone starts somewhere, and honest teams need all levels.</p>
            </>
          )}
          {step === 3 && (
            <>
              <h1>What are you excited to explore?</h1>
              <p>Choose the areas you want to see more of across projects and opportunities. Pick as many as you like — or none that do not fit.</p>
            </>
          )}
          {step === 4 && (
            <>
              <h1>What would you like AADI HUB to help you achieve?</h1>
              <p>Pick your goals so we can surface the right next steps. This is your plan, not a promise from us.</p>
            </>
          )}
          {step === 5 && (
            <>
              <h1>How would you like to participate?</h1>
              <p>Tell us how you prefer to work with other students. It helps others know how to reach out to you.</p>
            </>
          )}
          {step === 6 && (
            <>
              <h1>Review &amp; privacy</h1>
              <p>Check everything below, choose who can see your profile, then complete setup.</p>
            </>
          )}
        </div>

        <InlineError>{pageError}</InlineError>
        {step === 6 && !pageError && <div style={{ height: 12 }} />}

        {/* ---------------------------- STEP 1 · WELCOME ---------------------------- */}
        {step === 0 && (
          <div className="onb-welcome">
            <div className="onb-welcome__viz" aria-hidden="true">
              <svg viewBox="0 0 220 140" role="presentation">
                <g className="onb-welcome__lines">
                  <line x1="42" y1="96" x2="96" y2="44" />
                  <line x1="96" y1="44" x2="164" y2="70" />
                  <line x1="42" y1="96" x2="128" y2="118" />
                  <line x1="96" y1="44" x2="128" y2="118" />
                  <line x1="164" y1="70" x2="128" y2="118" />
                </g>
                <g className="onb-welcome__dots">
                  <circle cx="42" cy="96" r="6" />
                  <circle cx="96" cy="44" r="8" className="is-accent" />
                  <circle cx="164" cy="70" r="6" />
                  <circle cx="128" cy="118" r="5" />
                  <circle cx="186" cy="26" r="4" className="is-accent is-soft" />
                </g>
              </svg>
            </div>
            <p className="onb-welcome__note">
              About a minute of questions. Your answers are saved as you go, so you can stop and pick
              up where you left off.
            </p>
          </div>
        )}

        {/* ---------------------------- STEP 2 · PROFILE ---------------------------- */}
        {step === 1 && (
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

            <Field label="Full name" required error={errors.full_name}
              hint="Prefilled from your signup — update it if needed.">
              {({ id }) => (
                <TextInput id={id} value={draft.full_name} onChange={e => set('full_name', e.target.value)}
                  placeholder="Your full name" autoComplete="name" error={errors.full_name} />
              )}
            </Field>

            <Field label="College or institution" required error={errors.college}
              hint="Any college or institution — we do not keep a fixed list.">
              {({ id }) => (
                <TextInput id={id} value={draft.college} onChange={e => set('college', e.target.value)}
                  placeholder="e.g. Your college or university" autoComplete="organization"
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
              <Field label="Branch or specialization" hint="Optional">
                {({ id }) => (
                  <TextInput id={id} value={draft.department} onChange={e => set('department', e.target.value)}
                    placeholder="e.g. Computer Science" />
                )}
              </Field>
            </div>

            <div className="form-grid--2">
              <Field label="Current year of study" required error={errors.study_year}>
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

        {/* ---------------------------- STEP 3 · SKILLS ---------------------------- */}
        {step === 2 && (
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

        {/* ---------------------------- STEP 4 · INTERESTS ---------------------------- */}
        {step === 3 && (
          <div className="form-grid">
            <div>
              <div className="chip-cloud">
                {INTERESTS.map(item => (
                  <Chip key={item} label={item} selected={draft.interests.includes(item)}
                    onToggle={() => toggle('interests', item)} />
                ))}
              </div>
            </div>

            <div className="custom-add">
              <TextInput value={customInterest} onChange={e => setCustomInterest(e.target.value)}
                placeholder="Add an area not listed"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomInterest() } }} />
              <Button variant="secondary" onClick={addCustomInterest} disabled={!customInterest.trim()}>Add</Button>
            </div>

            {draft.interests.filter(i => !INTERESTS.includes(i)).length > 0 && (
              <div>
                <p className="form-section-title" style={{ marginBottom: 8 }}>Also selected</p>
                <div className="chip-cloud">
                  {draft.interests.filter(i => !INTERESTS.includes(i)).map(item => (
                    <Chip key={item} label={item} selected
                      onToggle={() => toggle('interests', item)} />
                  ))}
                </div>
              </div>
            )}

            <p className="p-field__hint">Nothing here is mandatory — interests only shape what you see, and you can change them any time.</p>
          </div>
        )}

        {/* ---------------------------- STEP 5 · GOALS ---------------------------- */}
        {step === 4 && (
          <div className="form-grid">
            <div>
              <div className="chip-cloud">
                {GOALS.map(g => (
                  <Chip key={g} label={g} selected={draft.goals.includes(g)}
                    onToggle={() => toggle('goals', g)} />
                ))}
              </div>
            </div>

            {draft.goals.filter(g => !GOALS.includes(g)).length > 0 && (
              <div>
                <p className="form-section-title" style={{ marginBottom: 8 }}>Also selected</p>
                <div className="chip-cloud">
                  {draft.goals.filter(g => !GOALS.includes(g)).map(g => (
                    <Chip key={g} label={g} selected onToggle={() => toggle('goals', g)} />
                  ))}
                </div>
              </div>
            )}

            <p className="p-field__hint">Select everything that applies — there is no wrong answer, and you can revisit this later.</p>
          </div>
        )}

        {/* ---------------------------- STEP 6 · COLLABORATION ---------------------------- */}
        {step === 5 && (
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

            {draft.collab_prefs.filter(p => !COLLAB_PREFS.includes(p)).length > 0 && (
              <div>
                <p className="form-section-title" style={{ marginBottom: 8 }}>Also selected</p>
                <div className="chip-cloud">
                  {draft.collab_prefs.filter(p => !COLLAB_PREFS.includes(p)).map(p => (
                    <Chip key={p} label={p} selected onToggle={() => toggle('collab_prefs', p)} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="form-section-title" style={{ marginBottom: 8 }}>Roles you enjoy <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional)</span></p>
              <div className="chip-cloud">
                {COLLAB_ROLES.map(r => (
                  <Chip key={r} label={r} selected={draft.roles.includes(r)}
                    onToggle={() => toggle('roles', r)} />
                ))}
              </div>
            </div>

            <Field label="Preferred collaboration mode" hint="Optional. Shown on your profile so teammates know what suits you.">
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

        {/* ---------------------------- STEP 7 · REVIEW ---------------------------- */}
        {step === 6 && (
          <div className="onb-review">
            <ReviewCard title="Student profile" onEdit={() => setStep(1)}>
              <strong>{draft.full_name || '—'}</strong>
              <br />
              {[draft.course, draft.department].filter(Boolean).join(' · ') || 'Degree not set'}
              <br />
              {[draft.college, draft.study_year].filter(Boolean).join(' · ') || 'College not set'}
              {draft.location && (<><br />{draft.location}</>)}
              {draft.bio && (<><br />{draft.bio}</>)}
            </ReviewCard>

            <ReviewCard title={`Skills (${draft.skills.length})`} onEdit={() => setStep(2)}>
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

            <ReviewCard title={`Interests (${draft.interests.length})`} onEdit={() => setStep(3)}>
              {draft.interests.length === 0 ? 'No interests selected yet.' : draft.interests.join(' · ')}
            </ReviewCard>

            <ReviewCard title={`Goals (${draft.goals.length})`} onEdit={() => setStep(4)}>
              {draft.goals.length === 0 ? 'No goals selected yet.' : draft.goals.join(' · ')}
            </ReviewCard>

            <ReviewCard title="Collaboration" onEdit={() => setStep(5)}>
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
            <Button onClick={handleNext} loading={saving}>
              {step === 0 ? "Let's get started" : 'Continue'}
            </Button>
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
