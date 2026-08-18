import { useRef, useState } from 'react'
import Button from './ui/Button.jsx'
import { Check } from './ui/Icons.jsx'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || ''
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_COMMUNITY_URL || ''

const INTERESTS = ['AI', 'Technology', 'Data', 'Design', 'Content', 'Startups', 'Business', 'Gaming', 'Creative', 'Other']
const GOALS = ['BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE']
const AGE_RANGES = ['Under 15', '15–18', '18–24', '25+']

const INVOLVEMENT_OPTIONS = [
  { value: 'Work with the Founding Team', desc: 'Help build AADI HUB and contribute to its development.' },
  { value: 'Founding Community Member', desc: 'Be among the early members and help shape the ecosystem.' },
  { value: 'AADI User / Member', desc: 'Explore AADI, connect with people and use the ecosystem.' },
  { value: 'Open to Future Opportunities', desc: 'Interested in contributing, collaborating or exploring opportunities as AADI grows.' },
]

const REFERRAL_OPTIONS = ['Instagram', 'LinkedIn', 'WhatsApp', 'Friend', 'College / Campus', 'GitHub', 'Other']

export default function EarlyAccessForm({ embedded = false }) {
  const [form, setForm] = useState({ name: '', email: '', age: '', college: '', whatsapp: '', location: '' })
  const [interests, setInterests] = useState([])
  const [goals, setGoals] = useState([])
  const [involvement, setInvolvement] = useState('')
  const [referral, setReferral] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  const formRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const collegeRef = useRef(null)
  const ageRef = useRef(null)
  const involvementRef = useRef(null)
  const successRef = useRef(null)

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setSubmitError('')
  }

  const toggle = (list, setList, item) =>
    setList((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (!form.college.trim()) e.college = 'Please enter your college or school.'
    if (!form.age) e.age = 'Select your age range.'
    if (interests.length === 0) e.interests = 'Choose at least one interest.'
    if (goals.length === 0) e.goals = 'Choose at least one goal.'
    if (!involvement) e.involvement = "Select how you'd like to be involved."
    return e
  }

  const focusError = (errs) => {
    const prefix = embedded ? '' : ''
    const target =
      errs.name ? nameRef.current :
      errs.email ? emailRef.current :
      errs.college ? collegeRef.current :
      errs.age ? ageRef.current :
      errs.interests ? formRef.current?.querySelector(`#${prefix}join-interests .join-chip`) :
      errs.goals ? formRef.current?.querySelector(`#${prefix}join-goals .join-chip`) :
      errs.involvement ? involvementRef.current : null
    if (target) {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' })
      target.focus({ preventScroll: true })
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!FORMSPREE_ENDPOINT) {
      setSubmitError('Early access is not connected yet. Please configure the form endpoint.')
      return
    }

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusError(errs)
      return
    }

    setStatus('submitting')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          age_range: form.age,
          college: form.college.trim(),
          location: form.location.trim(),
          interests: interests.join(', '),
          aadi_goals: goals.join(', '),
          involvement,
          referral_source: referral,
        }),
      })

      if (!res.ok) throw new Error('Submission failed')

      setStatus('done')
      setTimeout(() => {
        successRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        successRef.current?.focus()
      }, 80)
    } catch {
      setStatus('idle')
      setSubmitError('Something went wrong. Please try again in a moment.')
    }
  }

  const reset = () => {
    setStatus('idle')
    setForm({ name: '', email: '', age: '', college: '', whatsapp: '', location: '' })
    setInterests([])
    setGoals([])
    setInvolvement('')
    setReferral('')
    setErrors({})
    setSubmitError('')
  }

  return (
    <div className="join-form" id="join-form">
      {status === 'done' ? (
        <div className="join-success" role="status" ref={successRef} tabIndex={-1}>
          <span className="join-success__icon">
            <Check size={30} />
          </span>
          <h3>You're in. 🚀</h3>
          <p className="join-success__lead">Thanks for joining the AADI founding community.</p>
          <div className="join-success__tags">
            <span className="tag tag--kiwi">Founding community</span>
            <span className="tag tag--dark">Early access</span>
          </div>
          <p className="join-success__msg">
            Your journey with AADI starts here.<br />
            We'll keep you updated as AADI grows.
          </p>

          {WHATSAPP_URL && (
            <div className="join-success__whatsapp">
              <div className="join-success__wa-header">
                <span className="join-success__wa-label">STAY CONNECTED</span>
                <p className="join-success__wa-sub">Want to stay closer to AADI?</p>
                <p className="join-success__wa-desc">
                  Join the official AADI HUB WhatsApp Community for announcements, early updates,
                  community activities, challenges, opportunities, and founding-member discussions.
                </p>
              </div>
              <a
                className="join-success__wa-btn"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join AADI WhatsApp Community"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join AADI WhatsApp Community
              </a>
            </div>
          )}

          <div className="btn-row">
            {embedded ? (
              <Button href="#top" variant="light" size="md" arrow>
                Explore AADI
              </Button>
            ) : (
              <Button href="/" variant="light" size="md" arrow>
                Explore AADI
              </Button>
            )}
            <Button onClick={reset} variant="ghost" size="md">
              Submit another response
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} ref={formRef} aria-label="Become an AADI founding member" noValidate>
          <div className="join-form__head">
            <h3 className="join-form__title">Join the founding community</h3>
            <p className="join-form__sub">Tell us a little about yourself.</p>
          </div>

          {submitError && (
            <div className="join-form__error" role="alert">
              <p>{submitError}</p>
            </div>
          )}

          <div className="join-field">
            <label className="join-label" htmlFor="ja-name">Full name</label>
            <input
              ref={nameRef}
              id="ja-name"
              className="join-input"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              onChange={setField('name')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'ja-name-error' : undefined}
            />
            {errors.name && <p className="join-error" id="ja-name-error">{errors.name}</p>}
          </div>

          <div className="join-field">
            <label className="join-label" htmlFor="ja-email">Email</label>
            <input
              ref={emailRef}
              id="ja-email"
              className="join-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={setField('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'ja-email-error' : undefined}
            />
            {errors.email && <p className="join-error" id="ja-email-error">{errors.email}</p>}
          </div>

          <div className="join-field">
            <label className="join-label" htmlFor="ja-whatsapp">WhatsApp number</label>
            <input
              id="ja-whatsapp"
              className="join-input"
              type="tel"
              autoComplete="tel"
              placeholder="+91 XXXXX XXXXX"
              value={form.whatsapp}
              onChange={setField('whatsapp')}
            />
            <p className="join-hint">Optional — useful for future AADI community updates.</p>
          </div>

          <div className="join-field join-field--row">
            <div className="join-field">
              <label className="join-label" htmlFor="ja-age">Age range</label>
              <span className="join-select-wrap">
                <select
                  ref={ageRef}
                  id="ja-age"
                  className="join-input"
                  value={form.age}
                  onChange={setField('age')}
                  aria-invalid={!!errors.age}
                  aria-describedby={errors.age ? 'ja-age-error' : undefined}
                >
                  <option value="" disabled>Select…</option>
                  {AGE_RANGES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </span>
              {errors.age && <p className="join-error" id="ja-age-error">{errors.age}</p>}
            </div>
            <div className="join-field">
              <label className="join-label" htmlFor="ja-college">College / School</label>
              <input
                ref={collegeRef}
                id="ja-college"
                className="join-input"
                type="text"
                autoComplete="organization"
                placeholder="Where do you study?"
                value={form.college}
                onChange={setField('college')}
                aria-invalid={!!errors.college}
                aria-describedby={errors.college ? 'ja-college-error' : undefined}
              />
              {errors.college && <p className="join-error" id="ja-college-error">{errors.college}</p>}
            </div>
          </div>

          <div className="join-field">
            <label className="join-label" htmlFor="ja-location">City / Location</label>
            <input
              id="ja-location"
              className="join-input"
              type="text"
              placeholder="e.g. Madanapalle"
              value={form.location}
              onChange={setField('location')}
            />
          </div>

          <div className="join-field" id="join-interests">
            <span className="join-label" id="ja-interests-label">What are you interested in?</span>
            <p className="join-hint">Choose everything you're interested in.</p>
            <div className="join-chips" role="group" aria-labelledby="ja-interests-label">
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`join-chip${interests.includes(i) ? ' is-on' : ''}`}
                  aria-pressed={interests.includes(i)}
                  onClick={() => {
                    toggle(interests, setInterests, i)
                    setErrors((prev) => ({ ...prev, interests: undefined }))
                    setSubmitError('')
                  }}
                >
                  <span className="join-chip__check" aria-hidden="true">
                    {interests.includes(i) && <Check size={13} />}
                  </span>
                  {i}
                </button>
              ))}
            </div>
            {errors.interests && <p className="join-error">{errors.interests}</p>}
          </div>

          <div className="join-field" id="join-goals">
            <span className="join-label" id="ja-goals-label">What do you want to do on AADI?</span>
            <p className="join-hint">Choose everything that fits you.</p>
            <div className="join-chips" role="group" aria-labelledby="ja-goals-label">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`join-chip${goals.includes(g) ? ' is-on' : ''}`}
                  aria-pressed={goals.includes(g)}
                  onClick={() => {
                    toggle(goals, setGoals, g)
                    setErrors((prev) => ({ ...prev, goals: undefined }))
                    setSubmitError('')
                  }}
                >
                  <span className="join-chip__check" aria-hidden="true">
                    {goals.includes(g) && <Check size={13} />}
                  </span>
                  {g}
                </button>
              ))}
            </div>
            {errors.goals && <p className="join-error">{errors.goals}</p>}
          </div>

          <div className="join-field" id="join-involvement" ref={involvementRef} tabIndex={-1}>
            <span className="join-label" id="ja-involvement-label">How would you like to be involved with AADI HUB?</span>
            <p className="join-hint">Tell us how you'd like to participate in the AADI journey.</p>
            <div className="join-involvement" role="radiogroup" aria-labelledby="ja-involvement-label">
              {INVOLVEMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`join-involvement__card${involvement === opt.value ? ' is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="involvement"
                    value={opt.value}
                    checked={involvement === opt.value}
                    onChange={() => {
                      setInvolvement(opt.value)
                      setErrors((prev) => ({ ...prev, involvement: undefined }))
                      setSubmitError('')
                    }}
                    className="join-involvement__radio"
                  />
                  <span className="join-involvement__check" aria-hidden="true">
                    {involvement === opt.value && <Check size={14} />}
                  </span>
                  <span className="join-involvement__text">
                    <span className="join-involvement__title">{opt.value}</span>
                    <span className="join-involvement__desc">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.involvement && <p className="join-error">{errors.involvement}</p>}
          </div>

          <div className="join-field">
            <label className="join-label" htmlFor="ja-referral">How did you hear about AADI HUB?</label>
            <span className="join-select-wrap">
              <select
                id="ja-referral"
                className="join-input"
                value={referral}
                onChange={(e) => { setReferral(e.target.value); setSubmitError('') }}
              >
                <option value="" disabled>Select one…</option>
                {REFERRAL_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="join-form__submit"
            arrow
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Joining…' : 'Become a founding member'}
          </Button>

          <p className="join-form__note">
            Your information is used only for AADI early access and product updates. By joining, you agree to
            receive occasional AADI updates.
          </p>
        </form>
      )}
    </div>
  )
}
