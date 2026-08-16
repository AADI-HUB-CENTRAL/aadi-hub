import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { BrandSymbol } from './Logo.jsx'
import {
  Layers,
  Star,
  Target,
  Rocket,
  Code,
  Award,
  Users,
  Heart,
  Lightbulb,
  MapPin,
  Briefcase,
  Trophy,
  Check,
} from './ui/Icons.jsx'

const TABS = ['Overview', 'Activity', 'Projects', 'Goals']

const SKILLS = [
  { name: 'AI', level: 8 },
  { name: 'Python', level: 9 },
  { name: 'SQL', level: 8 },
  { name: 'Data', level: 8 },
  { name: 'React', level: 6 },
  { name: 'Community', level: 7 },
]

const PULSE = [
  { icon: Briefcase, label: 'Projects', value: '12', tip: "Things you've built." },
  { icon: Trophy, label: 'Challenges', value: '27', tip: "Things you've completed." },
  { icon: Users, label: 'Communities', value: '6', tip: "Places you've contributed." },
  { icon: Award, label: 'Achievements', value: '8', tip: 'Milestones you’ve reached.' },
]

const ACTIVITY = [
  { icon: Code, title: 'Published a project', desc: 'AI Study Assistant', time: '2h' },
  { icon: Trophy, title: 'Completed a challenge', desc: '30-Day Python Challenge', time: '1d' },
  { icon: Users, title: 'Joined a community', desc: 'Data Science', time: '2d' },
  { icon: Heart, title: 'Helped a member', desc: 'Code review', time: '3d' },
]

const GOALS = ['Ship my first ML project', 'Lead the campus AI community', 'Mentor 5 juniors']
const OPEN_TO = ['Collaboration', 'Projects', 'Hackathons', 'Mentorship']

const COMPLETE = [
  { label: 'Skills', done: true },
  { label: 'Bio', done: true },
  { label: 'Goals', done: true },
  { label: 'Projects', done: false },
]

const POINTS = [
  {
    icon: Layers,
    title: 'Every activity, captured',
    text: 'Your projects, challenges, contributions and communities become part of one evolving profile.',
  },
  {
    icon: Star,
    title: 'Reputation that reflects you',
    text: 'Build recognition through what you actually do — not follower counts.',
  },
  {
    icon: Target,
    title: 'Goals keep you moving',
    text: 'Set goals, track progress and keep your next step visible.',
  },
  {
    icon: Rocket,
    title: 'Show what you’re building',
    text: 'Projects, experiments and ideas give people a reason to discover and connect with you.',
  },
]

const PROOFS = [
  { n: '01', icon: Code, title: 'What you built', text: 'Projects, mini-builds and experiments.' },
  { n: '02', icon: Heart, title: 'Who you helped', text: 'Mentoring, collaboration and contributions.' },
  { n: '03', icon: Lightbulb, title: 'What you learned', text: 'Challenges completed and skills developed.' },
  { n: '04', icon: MapPin, title: 'Where you contributed', text: 'Communities, events and initiatives.' },
]

function Dashboard() {
  return (
    <div className="pdash">
      <div className="pdash__topbar">
        <span className="pdash__brand">
          <BrandSymbol size={16} />
          AADI Profile
        </span>
        <span className="pdash__badge">Example profile</span>
      </div>

      <div className="pdash__nav" role="tablist" aria-label="Profile sections — concept">
        {TABS.map((t, i) =>
          i === 0 ? (
            <button key={t} className="pdash__tab is-active" role="tab" aria-selected="true" type="button">
              {t}
            </button>
          ) : (
            <span key={t} className="pdash__tab" aria-disabled="true" title="Concept only">
              {t}
            </span>
          )
        )}
      </div>

      <div className="pdash__body">
        <section className="pdash__block pdash__head" style={{ '--i': 0 }}>
          <span className="pdash__avatar">
            NN<i className="pdash__dot" aria-hidden="true" />
          </span>
          <div className="pdash__who">
            <div className="pdash__name">
              Naga Neeraj
              <span className="pdash__status">
                <i aria-hidden="true" />
                Building
              </span>
            </div>
            <p className="pdash__role">Data Science · Builder</p>
            <div className="pdash__idline">
              <b>AADI-000281</b>
              <span>Level 14</span>
            </div>
          </div>
        </section>

        <section className="pdash__block" style={{ '--i': 1 }}>
          <h3 className="pdash__micro">Currently building</h3>
          <div className="pdash__building">
            <div className="pdash__building-text">
              <b>AI tools for students</b>
              <span>Exploring AI, data and collaborative learning.</span>
            </div>
            <span className="pdash__state">In progress</span>
          </div>
        </section>

        <section className="pdash__block" style={{ '--i': 2 }}>
          <h3 className="pdash__micro">Open to</h3>
          <div className="pdash__open">
            {OPEN_TO.map((o) => (
              <span key={o}>{o}</span>
            ))}
          </div>
        </section>

        <section className="pdash__block" style={{ '--i': 3 }}>
          <div className="pdash__blockhead">
            <h3 className="pdash__micro">Profile pulse</h3>
            <span className="pdash__note">Concept</span>
          </div>
          <div className="pdash__pulse">
            {PULSE.map((p) => {
              const Icon = p.icon
              return (
                <div className="pdash__stat" key={p.label}>
                  <span className="ico"><Icon size={15} /></span>
                  <b>{p.value}</b>
                  <span>{p.label}</span>
                  <span className="pdash__stat-tip">{p.tip}</span>
                </div>
              )
            })}
          </div>
          <div className="pdash__activity">
            <svg
              className="pdash__activity-svg"
              viewBox="0 0 220 40"
              role="img"
              aria-label="Conceptual activity over the last 30 days"
            >
              <line x1="0" y1="34" x2="220" y2="34" className="pdash__activity-base" />
              <polyline
                points="0,28 18,30 36,22 54,25 72,16 90,19 108,11 126,15 144,8 162,11 180,5 198,7 219,3"
                className="pdash__activity-line"
              />
              <circle cx="72" cy="16" r="3" />
              <circle cx="144" cy="8" r="3" />
              <circle cx="219" cy="3" r="4" />
            </svg>
            <span className="pdash__activity-caption">
              Activity · last 30 days <small>concept</small>
            </span>
          </div>
        </section>

        <section className="pdash__block" style={{ '--i': 4 }}>
          <div className="pdash__blockhead">
            <h3 className="pdash__micro">Skills</h3>
            <span className="pdash__note">Skill activity · example progress</span>
          </div>
          <ul className="pdash__skills">
            {SKILLS.map((s) => (
              <li className="pdash__skill" key={s.name}>
                <span className="pdash__skill-name">{s.name}</span>
                <span className="pdash__skill-bar" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <i key={i} className={i < s.level ? 'on' : ''} />
                  ))}
                </span>
                <span className="pdash__skill-pct">{s.level * 10}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pdash__block" style={{ '--i': 5 }}>
          <h3 className="pdash__micro">Recent activity</h3>
          <ul className="pdash__activity-list">
            {ACTIVITY.map((a) => {
              const Icon = a.icon
              return (
                <li className="pdash__activity-item" key={a.title}>
                  <span className="pdash__activity-ico"><Icon size={15} /></span>
                  <span className="pdash__activity-txt">
                    <b>{a.title}</b>
                    <span>{a.desc}</span>
                  </span>
                  <span className="pdash__activity-time">{a.time}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="pdash__block" style={{ '--i': 6 }}>
          <div className="pdash__blockhead">
            <h3 className="pdash__micro">Current goals</h3>
            <span className="pdash__note">Concept</span>
          </div>
          <ol className="pdash__goals">
            {GOALS.map((g, i) => (
              <li className="pdash__goal" key={g}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{g}</span>
              </li>
            ))}
          </ol>
          <div className="pdash__progress">
            <div className="pdash__progress-row">
              <span className="pdash__progress-label">Journey progress</span>
              <span className="pdash__progress-label">
                80% <small>concept</small>
              </span>
            </div>
            <div className="pdash__progress-track">
              <span className="pdash__progress-fill" />
            </div>
          </div>
        </section>

        <section className="pdash__block pdash__complete" style={{ '--i': 7 }}>
          <div className="pdash__complete-head">
            <span>Profile completeness</span>
            <b>82%</b>
          </div>
          <div className="pdash__complete-track">
            <span className="pdash__complete-fill" />
          </div>
          <ul className="pdash__complete-list">
            {COMPLETE.map((c) => (
              <li key={c.label} className={c.done ? 'on' : 'off'}>
                {c.done ? <Check size={11} /> : <i className="pdash__circle" aria-hidden="true" />}
                {c.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default function Profile() {
  return (
    <section className="sec sec--paper sec--line" id="profile">
      <div className="container profile__grid">
        <div className="profile__copy">
          <SectionHeader
            kicker="The profile experience"
            tag="Concept"
            title={
              <>
                More than a profile.
                <span className="line">A record of your <em>journey.</em></span>
              </>
            }
            lead="Your AADI profile is a living snapshot of what you're building, learning, contributing and working toward."
          />
          <Reveal delay={160}>
            <div className="profile__copy__list">
              {POINTS.map((p) => {
                const Icon = p.icon
                return (
                  <div className="profile__copy__item" key={p.title}>
                    <span className="ico"><Icon size={20} /></span>
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="profile__cta">
              <p className="profile__cta-note">
                Your profile shows where you are. <b>Your Passport</b> shows how you got here.
              </p>
              <div className="btn-row">
                <Button href="#passport" variant="light" size="lg" arrow>
                  See the Passport
                </Button>
                <Button href="#join" variant="ghost" size="lg">
                  Build yours
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={120}>
          <Dashboard />
        </Reveal>
      </div>

      <div className="container profile__proofs">
        <Reveal>
          <div className="profile__proofs-head">
            <p className="sec-kicker">Proof of participation</p>
            <h3>Your profile tells more than your bio.</h3>
          </div>
        </Reveal>
        <div className="proof-grid">
          {PROOFS.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal key={p.title} delay={i * 90} className="proof-cell">
                <article className="proof-card">
                  <span className="proof-card__num">{p.n}</span>
                  <span className="proof-card__icon"><Icon size={19} /></span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
