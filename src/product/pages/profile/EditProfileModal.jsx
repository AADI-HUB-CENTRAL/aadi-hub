import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import { updateMyProfile } from '../../../features/profile/profileApi.js'
import { Button, Field, TextInput, TextArea, Select, Chip } from '../../ui/kit.jsx'
import { Close, IdCard, Pencil, User } from '../../ui/icons.jsx'
import { ArrowUpRight, Camera, Check, Share } from '../../../components/ui/Icons.jsx'

/* ---------------------------------------------------------------------------
   EditProfileModal — sectioned editor. It replaces the old full-page form so
   the profile itself stays a profile: you open the section you want, change
   it, and you are back on the view.
--------------------------------------------------------------------------- */

const DEGREES = [
  'B.Tech / B.E.', 'B.Sc.', 'BCA', 'BBA', 'B.A.', 'Other undergraduate',
  'M.Tech / M.E.', 'M.Sc.', 'MBA', 'MCA', 'Postgraduate', 'Diploma', 'Other',
]
const YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Graduated', 'Other']
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() + 1 + i))
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const SKILL_CATALOG = [
  'Python', 'Java', 'JavaScript', 'React', 'AI', 'Machine Learning', 'Data Science',
  'Data Analysis', 'UI/UX Design', 'Cloud', 'Cybersecurity', 'Web Development',
  'App Development', 'Content Creation', 'Research', 'Business', 'Entrepreneurship',
  'Communication', 'Leadership',
]

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

const TABS = [
  { key: 'identity', label: 'Identity', Icon: User },
  { key: 'about', label: 'About', Icon: Pencil },
  { key: 'education', label: 'Education', Icon: IdCard },
  { key: 'skills', label: 'Skills & interests', Icon: Check },
  { key: 'links', label: 'Links', Icon: ArrowUpRight },
  { key: 'privacy', label: 'Privacy', Icon: Share },
]

function union(base, extra = []) {
  return [...base, ...extra.filter(item => item && !base.includes(item))]
}

function draftFrom(profile) {
  return {
    full_name: profile.full_name || '',
    headline: profile.headline || '',
    bio: profile.bio || '',
    location: profile.location || '',
    college: profile.college || '',
    course: profile.course || '',
    department: profile.department || '',
    study_year: profile.study_year || '',
    graduation_year: profile.graduation_year ? String(profile.graduation_year) : '',
    building: profile.building || '',
    learning: profile.learning || '',
    exploring: profile.exploring || '',
    looking_for: profile.looking_for || '',
    open_to: profile.open_to || '',
    github_url: profile.github_url || '',
    portfolio_url: profile.portfolio_url || '',
    linkedin_url: profile.linkedin_url || '',
    skills: profile.skills || [],
    skill_levels: profile.skill_levels || {},
    interests: profile.interests || [],
    goals: profile.goals || [],
    roles: profile.roles || [],
    collab_prefs: profile.collab_prefs || [],
    is_public: profile.is_public !== false,
  }
}

export default function EditProfileModal({
  profile,
  initialSection = 'identity',
  onChangePhoto,
  onClose,
  onSaved,
}) {
  const { refreshProfile } = useAuth()
  const toast = useToast()

  const [tab, setTab] = useState(initialSection)
  const [draft, setDraft] = useState(() => draftFrom(profile))
  const [newSkill, setNewSkill] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  const set = (key, value) => {
    setDraft(current => ({ ...current, [key]: value }))
    setError('')
  }

  function toggle(key, value) {
    setDraft(current => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter(item => item !== value)
        : [...current[key], value],
    }))
  }

  function setLevel(skill, level) {
    setDraft(current => ({
      ...current,
      skill_levels: { ...current.skill_levels, [skill]: level },
    }))
  }

  function addSkill() {
    const value = newSkill.trim()
    if (!value) return
    if (draft.skills.includes(value)) { setNewSkill(''); return }
    setDraft(current => ({
      ...current,
      skills: [...current.skills, value],
      skill_levels: { ...current.skill_levels, [value]: current.skill_levels?.[value] || 'Beginner' },
    }))
    setNewSkill('')
  }

  function removeSkill(skill) {
    setDraft(current => {
      const levels = { ...current.skill_levels }
      delete levels[skill]
      return { ...current, skills: current.skills.filter(item => item !== skill), skill_levels: levels }
    })
  }

  async function handleSave() {
    if (saving) return
    setError('')
    const errs = {}
    if (draft.full_name.trim().length < 2) errs.full_name = 'Enter your full name.'
    for (const [key, label] of [
      ['github_url', 'GitHub'], ['portfolio_url', 'Portfolio'], ['linkedin_url', 'LinkedIn'],
    ]) {
      if (draft[key].trim() && !/^https?:\/\/\S+$/i.test(draft[key].trim())) {
        errs[key] = `${label} must start with http(s)://`
      }
    }
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      if (errs.full_name) setTab('identity')
      else setTab('links')
      return
    }

    setSaving(true)
    const { error: saveError } = await updateMyProfile(profile.id, {
      ...draft,
      graduation_year: draft.graduation_year || null,
    })
    setSaving(false)

    if (saveError) {
      setError(saveError.message || 'Could not save your profile.')
      return
    }

    await refreshProfile()
    toast.success('Profile updated.')
    onSaved?.()
    onClose()
  }

  const skillChoices = union(draft.skills, SKILL_CATALOG)
  const interestChoices = union(INTEREST_CATALOG, draft.interests)
  const goalChoices = union(GOAL_OPTIONS, draft.goals)
  const roleChoices = union(ROLE_OPTIONS, draft.roles)
  const collabChoices = union(COLLAB_PREFS, draft.collab_prefs)

  return (
    <div
      className="lp-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="lp-modal__panel">
        <div className="lp-modal__head">
          <div>
            <h2 className="lp-modal__title">Edit profile</h2>
            <p className="lp-modal__sub">Pick a section, make your changes, save once.</p>
          </div>
          <button type="button" className="lp-edit-btn" onClick={onClose} aria-label="Close editor">
            <Close size={18} />
          </button>
        </div>

        <div className="lp-modal__body">
          <nav className="lp-modal__tabs" aria-label="Profile sections">
            {TABS.map(({ key, label, Icon }) => (
              <button
                type="button"
                key={key}
                className={`lp-modal__tab${tab === key ? ' is-active' : ''}`}
                onClick={() => setTab(key)}
                aria-current={tab === key ? 'true' : undefined}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="lp-modal__content">
            {tab === 'identity' && (
              <div className="lp-form-stack">
                <div className="lp-media-row">
                  <Camera size={22} />
                  <div className="lp-media-row__text">
                    <p className="lp-media-row__title">Profile photo</p>
                    <p className="lp-media-row__sub">Crop it so your face stays centred.</p>
                  </div>
                  <button
                    type="button"
                    className="p-btn p-btn--secondary p-btn--sm"
                    onClick={() => { onClose(); onChangePhoto?.() }}
                  >
                    Change
                  </button>
                </div>

                <Field label="Full name" required error={fieldErrors.full_name}>
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={draft.full_name}
                      onChange={event => set('full_name', event.target.value)}
                      maxLength={120}
                      error={fieldErrors.full_name}
                    />
                  )}
                </Field>

                <Field
                  label="Headline"
                  hint="The one line people read first — what you do or are learning."
                >
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={draft.headline}
                      onChange={event => set('headline', event.target.value)}
                      placeholder="e.g. Data Science student building AI tools"
                      maxLength={160}
                    />
                  )}
                </Field>

                <Field label="City / location">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={draft.location}
                      onChange={event => set('location', event.target.value)}
                      placeholder="e.g. Pileru, Andhra Pradesh"
                      maxLength={120}
                    />
                  )}
                </Field>
              </div>
            )}

            {tab === 'about' && (
              <div className="lp-form-stack">
                <Field label="About you" hint="Up to 500 characters.">
                  {({ id }) => (
                    <TextArea
                      id={id}
                      rows={6}
                      value={draft.bio}
                      onChange={event => set('bio', event.target.value)}
                      placeholder="A few lines about what you are building, learning and looking for…"
                      maxLength={500}
                    />
                  )}
                </Field>

                <div className="lp-form-row">
                  <Field label="Currently building">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        value={draft.building}
                        onChange={event => set('building', event.target.value)}
                        placeholder="e.g. an AI study assistant"
                        maxLength={160}
                      />
                    )}
                  </Field>
                  <Field label="Currently learning">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        value={draft.learning}
                        onChange={event => set('learning', event.target.value)}
                        placeholder="e.g. computer vision"
                        maxLength={160}
                      />
                    )}
                  </Field>
                </div>

                <Field label="Currently exploring">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={draft.exploring}
                      onChange={event => set('exploring', event.target.value)}
                      placeholder="e.g. open-source contribution"
                      maxLength={160}
                    />
                  )}
                </Field>

                <div className="lp-form-row">
                  <Field label="Looking for">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        value={draft.looking_for}
                        onChange={event => set('looking_for', event.target.value)}
                        placeholder="e.g. a frontend teammate"
                        maxLength={160}
                      />
                    )}
                  </Field>
                  <Field label="Open to">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        value={draft.open_to}
                        onChange={event => set('open_to', event.target.value)}
                        placeholder="e.g. internships and hackathons"
                        maxLength={160}
                      />
                    )}
                  </Field>
                </div>
              </div>
            )}

            {tab === 'education' && (
              <div className="lp-form-stack">
                <Field label="College or institution">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={draft.college}
                      onChange={event => set('college', event.target.value)}
                      placeholder="e.g. MADANAPALLE INSTITUTE OF TECHNOLOGY & SCIENCE"
                      maxLength={160}
                    />
                  )}
                </Field>

                <div className="lp-form-row">
                  <Field label="Degree or qualification">
                    {({ id }) => (
                      <Select
                        id={id}
                        value={draft.course}
                        onChange={event => set('course', event.target.value)}
                        placeholder="Choose qualification"
                        options={union(DEGREES, draft.course ? [draft.course] : []).map(value => ({ value, label: value }))}
                      />
                    )}
                  </Field>
                  <Field label="Department or branch">
                    {({ id }) => (
                      <TextInput
                        id={id}
                        value={draft.department}
                        onChange={event => set('department', event.target.value)}
                        placeholder="e.g. Data Science"
                        maxLength={160}
                      />
                    )}
                  </Field>
                </div>

                <div className="lp-form-row">
                  <Field label="Current academic year">
                    {({ id }) => (
                      <Select
                        id={id}
                        value={draft.study_year}
                        onChange={event => set('study_year', event.target.value)}
                        placeholder="Choose year"
                        options={union(YEARS, draft.study_year ? [draft.study_year] : []).map(value => ({ value, label: value }))}
                      />
                    )}
                  </Field>
                  <Field label="Expected graduation year">
                    {({ id }) => (
                      <Select
                        id={id}
                        value={draft.graduation_year}
                        onChange={event => set('graduation_year', event.target.value)}
                        placeholder="Choose year"
                        options={union(GRAD_YEARS, draft.graduation_year ? [draft.graduation_year] : []).map(value => ({ value, label: value }))}
                      />
                    )}
                  </Field>
                </div>
              </div>
            )}

            {tab === 'skills' && (
              <div className="lp-form-stack">
                <div>
                  <p className="p-field__label">Your skills</p>
                  {draft.skills.length === 0 ? (
                    <p className="lp-modal__note" style={{ marginTop: 8 }}>
                      No skills added yet. Add a few so teammates can find you.
                    </p>
                  ) : (
                    <div className="lp-form-stack" style={{ marginTop: 10, gap: 8 }}>
                      {draft.skills.map(skill => (
                        <div className="lp-skill-row" key={skill}>
                          <span className="lp-skill-row__name">{skill}</span>
                          <Select
                            value={draft.skill_levels?.[skill] || 'Beginner'}
                            onChange={event => setLevel(skill, event.target.value)}
                            options={SKILL_LEVELS.map(level => ({ value: level, label: level }))}
                            aria-label={`Level for ${skill}`}
                          />
                          <button
                            type="button"
                            className="p-iconbtn"
                            aria-label={`Remove ${skill}`}
                            onClick={() => removeSkill(skill)}
                          >
                            <Close size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <TextInput
                      value={newSkill}
                      onChange={event => setNewSkill(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') { event.preventDefault(); addSkill() }
                      }}
                      placeholder="Add a skill and press Enter"
                      maxLength={80}
                      style={{ flex: 1 }}
                    />
                    <Button variant="secondary" size="sm" onClick={addSkill}>Add</Button>
                  </div>
                </div>

                <div>
                  <p className="lp-subhead">Suggested skills</p>
                  <div className="lp-chips">
                    {skillChoices.filter(skill => !draft.skills.includes(skill)).map(skill => (
                      <Chip
                        key={skill}
                        label={skill}
                        selected={false}
                        onToggle={() => {
                          setDraft(current => ({
                            ...current,
                            skills: [...current.skills, skill],
                            skill_levels: { ...current.skill_levels, [skill]: current.skill_levels?.[skill] || 'Beginner' },
                          }))
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="lp-subhead">Interests</p>
                  <div className="lp-chips">
                    {interestChoices.map(item => (
                      <Chip
                        key={item}
                        label={item}
                        selected={draft.interests.includes(item)}
                        onToggle={() => toggle('interests', item)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="lp-subhead">Goals</p>
                  <div className="lp-chips">
                    {goalChoices.map(item => (
                      <Chip
                        key={item}
                        label={item}
                        selected={draft.goals.includes(item)}
                        onToggle={() => toggle('goals', item)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="lp-subhead">Roles you enjoy</p>
                  <div className="lp-chips">
                    {roleChoices.map(item => (
                      <Chip
                        key={item}
                        label={item}
                        selected={draft.roles.includes(item)}
                        onToggle={() => toggle('roles', item)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="lp-subhead">Open to collaborating on</p>
                  <div className="lp-chips">
                    {collabChoices.map(item => (
                      <Chip
                        key={item}
                        label={item}
                        selected={draft.collab_prefs.includes(item)}
                        onToggle={() => toggle('collab_prefs', item)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'links' && (
              <div className="lp-form-stack">
                <Field label="GitHub" error={fieldErrors.github_url}>
                  {({ id }) => (
                    <TextInput
                      id={id}
                      type="url"
                      value={draft.github_url}
                      onChange={event => set('github_url', event.target.value)}
                      placeholder="https://github.com/yourname"
                      error={fieldErrors.github_url}
                    />
                  )}
                </Field>
                <Field label="Portfolio website" error={fieldErrors.portfolio_url}>
                  {({ id }) => (
                    <TextInput
                      id={id}
                      type="url"
                      value={draft.portfolio_url}
                      onChange={event => set('portfolio_url', event.target.value)}
                      placeholder="https://yourname.dev"
                      error={fieldErrors.portfolio_url}
                    />
                  )}
                </Field>
                <Field label="LinkedIn" error={fieldErrors.linkedin_url}>
                  {({ id }) => (
                    <TextInput
                      id={id}
                      type="url"
                      value={draft.linkedin_url}
                      onChange={event => set('linkedin_url', event.target.value)}
                      placeholder="https://linkedin.com/in/yourname"
                      error={fieldErrors.linkedin_url}
                    />
                  )}
                </Field>
              </div>
            )}

            {tab === 'privacy' && (
              <div className="lp-form-stack">
                <div>
                  <p className="p-field__label">Who can view your profile</p>
                  <div className="lp-chips" style={{ marginTop: 10 }}>
                    <Chip
                      label="Public — anyone with my link"
                      selected={draft.is_public}
                      onToggle={() => set('is_public', true)}
                    />
                    <Chip
                      label="Restricted — signed-in students"
                      selected={!draft.is_public}
                      onToggle={() => set('is_public', false)}
                    />
                  </div>
                </div>
                <p className="lp-modal__note">
                  Your email is never shown. A public profile is what powers your shareable
                  AADI link at /u/{profile.aadi_id}.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lp-modal__foot">
          <span className={`lp-modal__status${error ? ' lp-modal__status--error' : ''}`}>
            {error || 'Changes appear on your profile after you save.'}
          </span>
          <div className="lp-modal__actions">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" loading={saving} onClick={handleSave}>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
