import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import { BrandSymbol } from './Logo.jsx'
import {
  Shield,
  Code,
  Users,
  Briefcase,
  Trophy,
  Award,
  Star,
  Target,
  Globe,
  Heart,
} from './ui/Icons.jsx'

const CONTENTS = [
  { title: 'Identity', desc: 'Who you are.', icon: Shield },
  { title: 'Skills', desc: 'What you can do.', icon: Code },
  { title: 'Communities', desc: 'Where you belong.', icon: Users },
  { title: 'Projects', desc: 'What you build.', icon: Briefcase },
  { title: 'Challenges', desc: 'What you complete.', icon: Trophy },
  { title: 'Achievements', desc: 'What you earn.', icon: Award },
  { title: 'Reputation', desc: 'What you contribute.', icon: Star },
  { title: 'Goals', desc: 'Where you’re going.', icon: Target },
  { title: 'Events', desc: 'Where you participate.', icon: Globe },
  { title: 'Contributions', desc: 'How you help.', icon: Heart },
]

const STATS = [
  { n: '12', l: 'Projects' },
  { n: '27', l: 'Challenges' },
  { n: '6', l: 'Communities' },
  { n: '18', l: 'Collaborations' },
]

const MILESTONES = [
  { title: 'Joined AADI', desc: 'Digital identity created', month: 'Jan' },
  { title: 'First Challenge', desc: '30-Day Python Challenge', month: 'Feb' },
  { title: 'First Project', desc: 'AI Study Assistant', month: 'Apr' },
  { title: 'Community Contributor', desc: 'Data Science Community', month: 'Jun' },
  { title: 'Collaboration', desc: 'Built with 4 members', month: 'Aug' },
  { title: 'Leadership', desc: 'Campus Build Battle', month: 'Now', active: true },
]

const STAMPS = ['First Build', 'First Challenge', 'Collaborator', 'Leader']

const MILESTONE_CHIPS = [
  'First Project',
  '10 Challenges',
  'First Collaboration',
  '1,000 Rep',
  'First Community',
  'First Leadership',
]

function JourneyPanel() {
  return (
    <div className="journey">
      <BrandSymbol className="journey__watermark" size={240} />

      <span className="journey__band" aria-hidden="true">
        <span>AADI Passport</span>
      </span>

      <div className="journey__body">
        <div className="journey__head">
          <span className="journey__title">
            <BrandSymbol size={18} />
            AADI Passport
          </span>
          <span className="journey__year">Journey · 2026</span>
          <span className="journey__badge">Concept preview</span>
        </div>

        <div className="journey__member">
          <h3 className="journey__name">Naga Neeraj</h3>
          <span className="journey__role">Data Science</span>
        </div>

        <div className="journey__glance">
          <span className="journey__micro">Journey at a glance</span>
          <div className="journey__stats">
            {STATS.map((s) => (
              <div className="journey__stat" key={s.l}>
                <b>{s.n}</b>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="journey__tl-head">
          <span className="journey__micro">2026</span>
          <span className="journey__legend" aria-hidden="true">
            <span>
              <i className="journey__dot-marker is-complete" /> Completed
            </span>
            <span>
              <i className="journey__dot-marker is-active" /> Active
            </span>
          </span>
        </div>

        <ol className="journey__timeline">
          {MILESTONES.map((m, i) => (
            <li
              key={m.title}
              className={`journey__milestone${m.active ? ' is-active' : ''}`}
              style={{ '--i': i }}
            >
              <span className="journey__dot" aria-hidden="true" />
              <div className="journey__ms">
                <div className="journey__ms-top">
                  <span className="journey__ms-title">
                    {m.title}
                    {m.active && <span className="journey__active">Active</span>}
                  </span>
                  {m.month && <span className="journey__ms-month">{m.month}</span>}
                </div>
                <p className="journey__ms-desc">{m.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="journey__next">
          <span className="journey__micro">Next destination</span>
          <div className="journey__next-row">
            <b className="journey__next-title">Lead your first community</b>
            <span className="journey__next-count">4 / 5</span>
          </div>
          <div
            className="journey__progress"
            role="progressbar"
            aria-label="Progress toward next destination"
            aria-valuenow={80}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="journey__progress-fill" style={{ width: '80%' }} />
          </div>
        </div>

        <div className="journey__stamps">
          <span className="journey__micro">Passport stamps</span>
          <div className="journey__stamps-row">
            {STAMPS.map((s) => (
              <span className="journey__stamp" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="journey__foot">
          <div className="journey__chips">
            {MILESTONE_CHIPS.map((c) => (
              <span className="journey__chip" key={c}>
                {c}
              </span>
            ))}
          </div>
          <span className="journey__sig">Your journey across AADI · Concept journey</span>
        </div>
      </div>
    </div>
  )
}

export default function Passport() {
  return (
    <section className="sec sec--paper sec--line" id="passport">
      <div className="container passport__grid">
        <div className="passport__copy">
          <SectionHeader
            kicker="AADI Passport"
            tag="Concept preview"
            title={
              <>
                Your digital passport
                <span className="line">for the journey <em>ahead.</em></span>
              </>
            }
            lead="AADI Passport turns everything you do across the ecosystem into one evolving journey."
          />
          <Reveal delay={160}>
            <blockquote className="passport__quote">
              “Your AADI ID identifies you.
              <br />
              Your AADI Passport <b>tells your story.</b>”
            </blockquote>
          </Reveal>
          <Reveal delay={240}>
            <div>
              <p className="sec-kicker" style={{ marginBottom: 14, fontSize: '0.68rem' }}>
                What a passport can carry
              </p>
              <ul className="passport__cats">
                {CONTENTS.map((c) => {
                  const Icon = c.icon
                  return (
                    <li className="passport__cat" key={c.title}>
                      <span className="passport__cat-icon">
                        <Icon size={17} />
                      </span>
                      <span className="passport__cat-text">
                        <b>{c.title}</b>
                        <small>{c.desc}</small>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={180}>
          <JourneyPanel />
        </Reveal>
      </div>
    </section>
  )
}
