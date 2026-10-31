import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ProductLogo, Button, Field, TextInput, Select, Chip, InlineError, InlineSuccess, Spinner,
} from '../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Founding-community waitlist (Formspree).
   Same endpoint and payload as the original form. Reports failure honestly —
   if the endpoint is missing or the request fails, nothing is claimed.
--------------------------------------------------------------------------- */

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || ''
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_COMMUNITY_URL || ''

const INTERESTS = ['AI', 'Technology', 'Data', 'Design', 'Content', 'Startups', 'Business', 'Gaming', 'Creative', 'Other']
const GOALS = ['BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE']
const AGE_RANGES = ['Under 15', '15-18', '18-24', '25+']

const INVOLVEMENT_OPTIONS = [
  { value: 'Work with the Founding Team', desc: 'Help build AADI HUB and contribute to its development.' },
  { value: 'Founding Community Member', desc: 'Be among the early members and help shape the ecosystem.' },
  { value: 'AADI User / Member', desc: 'Explore AADI, connect with people and use the ecosystem.' },
  { value: 'Open to Future Opportunities', desc: 'Interested in contributing, collaborating or exploring opportunities as AADI grows.' },
]

const REFERRAL_OPTIONS = ['Instagram', 'LinkedIn', 'WhatsApp', 'Friend', 'College / Campus', 'GitHub', 'Other']

const emptyForm = { name: '', email: '', age: '', college: '', whatsapp: '', location: '' }

export default function WaitlistPage() {
  const [form, setForm] = useState(emptyForm)
  const [interests, setInterests] = useState([])
  const [goals, setGoals] = useState([])
  const [involvement, setInvolvement] = useState('')
  const [referral, setReferral] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const setField = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(er => ({ ...er, [key]: undefined }))
    setSubmitError('')
  }

  const toggle = (list, setList, item) =>
    setList(prev => (prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]))

  function validate() {
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

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    if (!FORMSPREE_ENDPOINT) {
      setSubmitError('Early access is not connected yet. Please configure the form endpoint.')
      return
    }

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
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
      setDone(true)
    } catch {
      setSubmitting(false)
      setSubmitError('Something went wrong. Please try again in a moment.')
    }
  }

  function reset() {
    setForm(emptyForm)
    setInterests([]); setGoals([]); setInvolvement(''); setReferral('')
    setErrors({}); setSubmitError(''); setSubmitting(false); setDone(false)
  }

  return (
    <div className="form-page-wrap">
      <nav className="form-page-wrap__nav">
        <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={26} size={17} /></Link>
        <Link to="/" className="auth-page__bar-link">← Back to AADI HUB</Link>
      </nav>

      <div className="form-page-wrap__body">
        <div className="form-page">
          <p className="form-page__eyebrow">Early access · Founding community</p>
          <h1 className="form-page__title">Join the Founding Community</h1>
          <p className="form-page__sub">
            Tell us a little about yourself and become part of the early AADI HUB community.
            Already have an account? <Link to="/login" style={{ color: 'var(--kiwi-400)', fontWeight: 600 }}>Sign in</Link>.
          </p>

          {done ? (
            <div className="join-success" role="status">
              <span className="join-success__icon" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </span>
              <h3>You're in.</h3>
              <p className="join-success__lead">Thanks for joining the AADI founding community.</p>
              <p className="join-form__note" style={{ marginBottom: 20 }}>
                Your journey with AADI starts here. We'll keep you updated as AADI grows.
              </p>

              {WHATSAPP_URL && (
                <div className="join-success__whatsapp">
                  <p className="join-success__wa-label">Stay connected</p>
                  <p className="join-success__wa-sub">Want to stay closer to AADI?</p>
                  <p className="join-success__wa-desc">
                    Join the official AADI HUB WhatsApp Community for announcements, early updates,
                    community activities, challenges, opportunities, and founding-member discussions.
                  </p>
                  <a className="join-success__whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--kiwi-400)', fontWeight: 600 }}>
                    Join AADI WhatsApp Community ↗
                  </a>
                </div>
              )}

              <div className="btn-row">
                <Link to="/" className="p-btn p-btn--primary p-btn--md">Explore AADI</Link>
                <button type="button" className="p-btn p-btn--ghost p-btn--md" onClick={reset}>
                  Submit another response
                </button>
              </div>
            </div>
          ) : (
            <form className="join-form" onSubmit={onSubmit} aria-label="Become an AADI founding member" noValidate>
              {submitError && <div className="join-form__error" role="alert"><p>{submitError}</p></div>}

              <div className="form-grid--2">
                <Field label="Full name" required error={errors.name}>
                  {({ id }) => (
                    <TextInput id={id} value={form.name} onChange={setField('name')}
                      placeholder="Your name" autoComplete="name" error={errors.name} />
                  )}
                </Field>
                <Field label="Email" required error={errors.email}>
                  {({ id }) => (
                    <TextInput id={id} type="email" value={form.email} onChange={setField('email')}
                      placeholder="you@example.com" autoComplete="email" error={errors.email} />
                  )}
                </Field>
              </div>

              <div className="form-grid--2">
                <Field label="Age range" required error={errors.age}>
                  {({ id }) => (
                    <Select id={id} value={form.age} onChange={setField('age')}
                      placeholder="Select…" options={AGE_RANGES.map(a => ({ value: a, label: a }))}
                      error={errors.age} />
                  )}
                </Field>
                <Field label="College / School" required error={errors.college}>
                  {({ id }) => (
                    <TextInput id={id} value={form.college} onChange={setField('college')}
                      placeholder="Where do you study?" autoComplete="organization" error={errors.college} />
                  )}
                </Field>
              </div>

              <div className="form-grid--2">
                <Field label="City / Location" hint="Optional">
                  {({ id }) => (
                    <TextInput id={id} value={form.location} onChange={setField('location')} placeholder="e.g. Madanapalle" />
                  )}
                </Field>
                <Field label="WhatsApp number" hint="Optional — for community updates.">
                  {({ id }) => (
                    <TextInput id={id} type="tel" value={form.whatsapp} onChange={setField('whatsapp')}
                      placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
                  )}
                </Field>
              </div>

              <Field label="What are you interested in?" required error={errors.interests}
                hint="Choose everything you're interested in.">
                <div className="join-chips">
                  {INTERESTS.map(i => (
                    <Chip key={i} label={i} selected={interests.includes(i)}
                      onToggle={() => { toggle(interests, setInterests, i); setErrors(er => ({ ...er, interests: undefined })) }} />
                  ))}
                </div>
              </Field>

              <Field label="What do you want to do on AADI?" required error={errors.goals}
                hint="Choose everything that fits you.">
                <div className="join-chips">
                  {GOALS.map(g => (
                    <Chip key={g} label={g} selected={goals.includes(g)}
                      onToggle={() => { toggle(goals, setGoals, g); setErrors(er => ({ ...er, goals: undefined })) }} />
                  ))}
                </div>
              </Field>

              <Field label="How would you like to be involved with AADI HUB?" required error={errors.involvement}
                hint="Tell us how you'd like to participate in the AADI journey.">
                <div className="join-chips" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  {INVOLVEMENT_OPTIONS.map(opt => (
                    <label key={opt.value}
                      className={`p-card${involvement === opt.value ? '' : ''}`}
                      style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: 14,
                        borderColor: involvement === opt.value ? 'var(--kiwi-500)' : undefined,
                      }}>
                      <input type="radio" name="involvement" value={opt.value}
                        checked={involvement === opt.value}
                        onChange={() => { setInvolvement(opt.value); setErrors(er => ({ ...er, involvement: undefined })) }}
                        style={{ marginTop: 3, accentColor: 'var(--kiwi-500)' }} />
                      <span>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{opt.value}</span>
                        <span style={{ display: 'block', fontSize: 13, color: 'var(--muted-on-dark)', marginTop: 3 }}>{opt.desc}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="How did you hear about AADI HUB?">
                {({ id }) => (
                  <Select id={id} value={referral} onChange={e => { setReferral(e.target.value); setSubmitError('') }}
                    placeholder="Select one…" options={REFERRAL_OPTIONS.map(r => ({ value: r, label: r }))} />
                )}
              </Field>

              <Button type="submit" size="lg" full loading={submitting}>Become a founding member</Button>

              <p className="join-form__note">
                Your information is used only for AADI early access and product updates. By joining, you agree to
                receive occasional AADI updates.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
