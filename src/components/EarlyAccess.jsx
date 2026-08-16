import { Fragment, useRef, useState } from 'react'
import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { Check, ArrowRight, ArrowDown, Target, Layers, Users } from './ui/Icons.jsx'

const INTERESTS = ['AI', 'Technology', 'Data', 'Design', 'Content', 'Startups', 'Business', 'Gaming', 'Creative', 'Other']

const GOALS = ['BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE']

const AGE_RANGES = ['Under 15', '15–17', '18–20', '21–24', '25+']

const BENEFITS = [
  { n: '01', icon: Target, title: 'Shape the product', text: "Help influence the communities, features and experiences AADI builds." },
  { n: '02', icon: Layers, title: 'Build your identity', text: 'Create your AADI identity and start building a profile around what you actually do.' },
  { n: '03', icon: Users, title: 'Grow with the ecosystem', text: 'Meet builders, creators, thinkers and future teammates from the beginning.' },
]

const WHY = ['Help shape the product', 'Meet your people', 'Discover communities', 'Build your identity', 'Find opportunities']

const STEPS = [
  { n: '01', t: 'Join', d: "Tell us what you're interested in." },
  { n: '02', t: 'Explore', d: 'Discover the AADI ecosystem as it develops.' },
  { n: '03', t: 'Shape', d: 'Help influence what we build next.' },
]

const ECOSYSTEM = ['AADI ID', 'AADI Profile', 'Communities', 'Challenges', 'Projects', 'Opportunities', 'Founding Community']

export default function EarlyAccess() {
  const [form, setForm] = useState({ name: '', email: '', age: '', college: '' })
  const [interests, setInterests] = useState([])
  const [goals, setGoals] = useState([])
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const formRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const collegeRef = useRef(null)
  const ageRef = useRef(null)

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
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
    return e
  }

  const focusError = (errs) => {
    const target =
      errs.name ? nameRef.current :
      errs.email ? emailRef.current :
      errs.college ? collegeRef.current :
      errs.age ? ageRef.current :
      errs.interests ? formRef.current?.querySelector('#join-interests .join-chip') :
      errs.goals ? formRef.current?.querySelector('#join-goals .join-chip') : null
    if (target) {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' })
      target.focus({ preventScroll: true })
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusError(errs)
      return
    }
    setStatus('submitting')
    window.setTimeout(() => setStatus('done'), 1100)
  }

  const reset = () => {
    setStatus('idle')
    setForm({ name: '', email: '', age: '', college: '' })
    setInterests([])
    setGoals([])
    setErrors({})
  }

  const scrollToForm = (e) => {
    e.preventDefault()
    document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="sec sec--night sec--line" id="join">
      <div className="container join__grid">
        <div className="join__story">
          <p className="join-status">
            <span className="join-status__dot" aria-hidden="true"></span>
            Early access open
          </p>

          <SectionHeader
            kicker="Early access · Founding community"
            title={
              <>
                Be there
                <span className="line">from <em>day one.</em></span>
              </>
            }
            lead="AADI is being built with the people it's built for. Join the founding community, shape what we build, and help define what the next generation's ecosystem becomes."
          />

          <Reveal delay={120}>
            <div className="join__benefits">
              {BENEFITS.map((b) => {
                const Icon = b.icon
                return (
                  <div className="join__benefit" key={b.title}>
                    <span className="join__benefit-n">{b.n}</span>
                    <span className="join__benefit-ico">
                      <Icon size={18} />
                    </span>
                    <div>
                      <h4>{b.title}</h4>
                      <p>{b.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="join-why">
              <span className="join-why__label">Join early</span>
              <div className="join-why__row">
                {WHY.map((w, i) => (
                  <Fragment key={w}>
                    {i > 0 && <ArrowRight size={14} className="join-why__arrow" aria-hidden="true" />}
                    <span className="join-why__item">{w}</span>
                  </Fragment>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className="join-membercard">
              <div className="join-membercard__top">
                <span className="join-membercard__brand">AADI HUB</span>
                <span className="tag tag--kiwi">Concept preview</span>
              </div>
              <p className="join-membercard__kicker">AADI Founding Member</p>
              <h3 className="join-membercard__title">
                Your journey
                <span className="line"><em>starts here.</em></span>
              </h3>
              <p className="join-membercard__tags">BUILD · CONNECT · CREATE</p>
              <dl className="join-membercard__meta">
                <div>
                  <dt>Status</dt>
                  <dd>Early access</dd>
                </div>
                <div>
                  <dt>Identity</dt>
                  <dd>AADI Member</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>Founding community</dd>
                </div>
              </dl>
              <div className="join-membercard__foot">
                <span className="join-membercard__dot" aria-hidden="true"></span>
                <span>Early access</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="join-ecosystem">
              <p className="join-ecosystem__line">One ecosystem. One identity. A journey that grows with you.</p>
              <div className="join-ecosystem__chips">
                {ECOSYSTEM.map((x) => (
                  <span className="chip" key={x}>{x}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="join__card">
          <Reveal variant="right" delay={140}>
            <div className="join-form" id="join-form">
              {status === 'done' ? (
                <div className="join-success" role="status">
                  <span className="join-success__icon">
                    <Check size={30} />
                  </span>
                  <h3>You're in.</h3>
                  <p className="join-success__lead">Welcome to the beginning of AADI.</p>
                  <div className="join-success__tags">
                    <span className="tag tag--kiwi">Founding community</span>
                    <span className="tag tag--dark">Early access</span>
                  </div>
                  <p className="join-success__msg">Thanks for joining early. We'll keep you updated as AADI takes shape.</p>
                  <div className="btn-row">
                    <Button href="#top" variant="light" size="md" arrow>
                      Explore AADI
                    </Button>
                    <Button onClick={reset} variant="ghost" size="md">
                      Submit another response
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} aria-label="Become an AADI founding member" noValidate>
                  <div className="join-form__head">
                    <h3 className="join-form__title">Join the founding community</h3>
                    <p className="join-form__sub">Tell us a little about yourself.</p>
                  </div>

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
          </Reveal>

          <Reveal delay={220}>
            <div className="join-next">
              <h4 className="join-next__title">What happens next?</h4>
              <ol className="join-next__list">
                {STEPS.map((s, i) => (
                  <li key={s.n}>
                    <div className="join-next__item">
                      <span className="join-next__num">{s.n}</span>
                      <div>
                        <strong>{s.t}</strong>
                        <p>{s.d}</p>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span className="join-next__arrow" aria-hidden="true">
                        <ArrowDown size={16} />
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <Reveal>
          <div className="join-final">
            <div>
              <h3 className="join-final__title">
                You don't have to wait
                <span className="line">for the future. You can help <em>build it.</em></span>
              </h3>
              <p className="join-final__line">AADI starts with the people who choose to build it together.</p>
            </div>
            <Button href="#join-form" onClick={scrollToForm} variant="primary" size="lg" arrow>
              Become a founding member
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
