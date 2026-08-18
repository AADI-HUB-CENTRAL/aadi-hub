import { Fragment } from 'react'
import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import EarlyAccessForm from './EarlyAccessForm.jsx'
import { ArrowRight, ArrowDown, Target, Layers, Users } from './ui/Icons.jsx'

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
            <EarlyAccessForm embedded />
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
