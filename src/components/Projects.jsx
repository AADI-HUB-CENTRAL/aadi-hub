import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import {
  ArrowRight,
  ArrowDown,
  Check,
  Spark,
  MapPin,
  TrendingUp,
  Target,
  Users,
  Award,
  Lightbulb,
  Search,
  Code,
  Share,
} from './ui/Icons.jsx'

const PROJECTS = [
  {
    name: 'AI Study Assistant',
    cat: 'AI · Education',
    desc: 'Turns lecture notes into summaries, quizzes and spaced-repetition reviews.',
    tags: ['AI', 'Python', 'React', 'Education'],
    roles: [
      { n: 'Frontend Developer', s: 'React · UI', open: true },
      { n: 'UI Designer', s: 'Product · Figma', open: true },
      { n: 'Data / ML', s: 'AI · Python', open: false },
    ],
    you: 'AI · Python',
    filled: 3,
    total: 5,
    pct: 60,
    activity: 'Updated 2h ago',
    visual: 'study',
  },
  {
    name: 'Campus Navigation AI',
    cat: 'AI · Campus',
    desc: 'Helps students discover classrooms, events and useful places across campus.',
    tags: ['AI', 'Maps', 'Flutter'],
    roles: [
      { n: 'Flutter Developer', s: 'Mobile · UI', open: true },
      { n: 'Map / Data', s: 'GIS · Data', open: true },
    ],
    you: 'Maps · Flutter',
    filled: 2,
    total: 4,
    pct: 35,
    activity: 'Updated 1d ago',
    visual: 'campus',
  },
  {
    name: 'Student Finance Tracker',
    cat: 'FinTech · Student Life',
    desc: 'A simple way for students to understand spending, saving and everyday money.',
    tags: ['FinTech', 'React', 'UX'],
    roles: [
      { n: 'React Developer', s: 'Web · UI', open: true },
      { n: 'Data Analyst', s: 'Finance · Data', open: true },
      { n: 'Product Designer', s: 'Product · Figma', open: true },
    ],
    you: 'React · UX',
    filled: 1,
    total: 4,
    pct: 20,
    activity: 'Updated 3d ago',
    visual: 'finance',
  },
  {
    name: 'Sustainability Tracker',
    cat: 'Climate · Campus',
    desc: 'Track everyday campus sustainability challenges and collective progress.',
    tags: ['Climate', 'Data', 'Design'],
    roles: [
      { n: 'Data Lead', s: 'Climate · Data', open: true },
      { n: 'Brand Designer', s: 'Design · Content', open: false },
    ],
    you: 'Data · Design',
    filled: 2,
    total: 3,
    pct: 55,
    activity: 'Updated 5d ago',
    visual: 'green',
  },
  {
    name: 'SkillSwap',
    cat: 'Community · Skills',
    desc: 'Students exchange skills, mentorship and practical knowledge with each other.',
    tags: ['Community', 'Mobile', 'UX'],
    roles: [
      { n: 'Mobile Developer', s: 'React Native', open: true },
      { n: 'UX Researcher', s: 'Research · UX', open: false },
    ],
    you: 'Mobile · UX',
    filled: 4,
    total: 5,
    pct: 80,
    activity: 'Updated 1d ago',
    visual: 'swap',
  },
]

const STEPS = [
  { n: '01', icon: Lightbulb, t: 'Idea', d: 'Turn a thought into something worth building.' },
  { n: '02', icon: Search, t: 'Find', d: 'Discover people with complementary skills.' },
  { n: '03', icon: Code, t: 'Build', d: 'Work together and turn the idea into a project.' },
  { n: '04', icon: Share, t: 'Share', d: 'Show your progress and what you learned.' },
  { n: '05', icon: TrendingUp, t: 'Grow', d: 'Turn the work into experience, reputation and future opportunities.' },
]

const DIFFS = [
  { n: '01', icon: Target, t: 'Match by ability', d: 'Find teammates based on skills, interests and goals — not follower counts.' },
  { n: '02', icon: Users, t: 'Build together', d: 'Turn conversations and ideas into structured projects.' },
  { n: '03', icon: Award, t: 'Turn work into proof', d: 'Projects, contributions and collaboration become part of your evolving AADI identity.' },
]

const CARD_GAP = 20

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function ProjVisual({ kind }) {
  if (kind === 'campus') {
    return (
      <div className="pv pv--campus" aria-hidden="true">
        <span className="pv__map">
          <i className="pv__path" />
          <MapPin size={14} />
        </span>
        <span className="pv__tag">Room 214 · Library · Lab</span>
      </div>
    )
  }
  if (kind === 'finance') {
    return (
      <div className="pv pv--finance" aria-hidden="true">
        <span className="pv__bars">
          <i />
          <i className="is-hi" />
          <i />
        </span>
        <span className="pv__donut" />
        <span className="pv__tag">Save 12% this month</span>
      </div>
    )
  }
  if (kind === 'green') {
    return (
      <div className="pv pv--green" aria-hidden="true">
        <span className="pv__ring is-a" />
        <span className="pv__ring is-b" />
        <span className="pv__ring is-c" />
        <span className="pv__tag">Campus challenge · Week 3</span>
      </div>
    )
  }
  if (kind === 'swap') {
    return (
      <div className="pv pv--swap" aria-hidden="true">
        <span className="pv__node">A</span>
        <span className="pv__swap">
          <ArrowRight size={13} />
          <ArrowRight size={13} />
        </span>
        <span className="pv__node">B</span>
        <span className="pv__tag">Skill ↔ Mentor</span>
      </div>
    )
  }
  return (
    <div className="pv pv--study" aria-hidden="true">
      <span className="pv__note">
        <i />
        <i />
        <i />
      </span>
      <span className="pv__flow">
        <Spark size={13} />
        <ArrowRight size={13} />
      </span>
      <span className="pv__card pv__card--a">
        <i />
        <i />
        <Check size={11} />
      </span>
      <span className="pv__card pv__card--b">
        <i />
        <i />
        <span className="pv__pulse" />
      </span>
    </div>
  )
}

function ProjCard({ p, active }) {
  return (
    <article className={`proj-card${active ? ' is-active' : ''}`}>
      <div className="proj-card__top">
        <span className="proj-card__badge">Concept Preview</span>
        <span className="proj-card__cat">{p.cat}</span>
      </div>
      <h4 className="proj-card__title">{p.name}</h4>
      <p className="proj-card__desc">{p.desc}</p>

      <ProjVisual kind={p.visual} />

      <div className="proj-card__tags">
        {p.tags.map((t) => (
          <span key={t} className="proj-card__tag">{t}</span>
        ))}
      </div>

      <div className="proj-card__progress">
        <span className="proj-card__team">Team · {p.filled}/{p.total} filled</span>
        <span className="proj-card__bar"><i style={{ width: `${p.pct}%` }} /></span>
        <span className="proj-card__pct">{p.pct}%</span>
      </div>

      <div className="proj-card__roles">
        <span className="proj-card__roles-label">Looking for</span>
        {p.roles.map((r) => (
          <span key={r.n} className="proj-card__role">
            <span className="proj-card__role-name">{r.n}</span>
            <span className={`proj-card__role-state${r.open ? ' is-open' : ''}`}>
              {r.open ? 'Open' : 'Matched'}
            </span>
          </span>
        ))}
      </div>

      <div className="proj-card__foot">
        <span className="proj-card__activity">{p.activity}</span>
        <span className="proj-card__cta">
          <Button href="#join" variant="secondary" size="sm">View Project</Button>
          <Button href="#join" variant="primary" size="sm">Join Team</Button>
        </span>
      </div>
    </article>
  )
}

function CrewPanel({ p }) {
  return (
    <aside className="card crew-panel" aria-label={`Team formation for ${p.name}`}>
      <div className="crew-panel__head">
        <span className="crew-panel__title">Find Your Crew</span>
        <span className="chip chip--kiwi">Concept Preview</span>
      </div>
      <p className="crew-panel__sub">
        <b>{p.name}</b> · team needed
      </p>

      <div className="crew-panel__rows">
        <div className="crew-panel__row is-you">
          <span className="crew-panel__avatar crew-panel__avatar--you">You</span>
          <span className="crew-panel__role">
            <b>You</b>
            <i>{p.you}</i>
          </span>
          <span className="crew-panel__state is-open">In</span>
        </div>
        {p.roles.map((r) => (
          <div className="crew-panel__row" key={r.n}>
            <span className="crew-panel__avatar">{initials(r.n)}</span>
            <span className="crew-panel__role">
              <b>{r.n}</b>
              <i>{r.s}</i>
            </span>
            <span className={`crew-panel__state${r.open ? ' is-open' : ''}`}>
              {r.open ? 'Open' : 'Matched'}
            </span>
          </div>
        ))}
      </div>

      <div className="crew-panel__foot">
        <span className="crew-panel__match">
          <i className="crew-panel__pulse" aria-hidden="true" />
          3 potential matches
        </span>
        <span className="crew-panel__note">Matched by skills, interests &amp; goals</span>
      </div>
    </aside>
  )
}

export default function Projects() {
  const scrollerRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [atEnd, setAtEnd] = useState(false)

  const cardStep = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return 0
    const card = el.querySelector('.proj-card')
    return card ? card.getBoundingClientRect().width + CARD_GAP : 0
  }, [])

  const update = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const step = cardStep()
    if (!step) return
    const i = Math.round(el.scrollLeft / step)
    setIndex(Math.max(0, Math.min(i, PROJECTS.length - 1)))
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8)
  }, [cardStep])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const padAndUpdate = () => {
      const step = cardStep()
      const card = el.querySelector('.proj-card')
      if (step && card) {
        el.style.paddingRight = `${Math.max(0, el.clientWidth - card.getBoundingClientRect().width)}px`
      }
      update()
    }
    padAndUpdate()
    window.addEventListener('resize', padAndUpdate)
    return () => window.removeEventListener('resize', padAndUpdate)
  }, [update, cardStep])

  const scrollTo = useCallback((left) => {
    const el = scrollerRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' })
  }, [])

  const go = useCallback(
    (dir) => {
      const el = scrollerRef.current
      const step = cardStep()
      if (!el || !step) return
      const max = el.scrollWidth - el.clientWidth
      scrollTo(Math.max(0, Math.min(el.scrollLeft + dir * step, max)))
    },
    [cardStep, scrollTo]
  )

  const goToDot = useCallback(
    (i) => {
      const el = scrollerRef.current
      const step = cardStep()
      if (!el || !step) return
      scrollTo(Math.min(i * step, el.scrollWidth - el.clientWidth))
    },
    [cardStep, scrollTo]
  )

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      }
    },
    [go]
  )

  return (
    <section className="sec sec--paper sec--line projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="proj-head">
          <div className="proj-head__copy">
            <p className="sec-kicker">
              Projects <span className="chip chip--light">Concept Preview</span>
            </p>
            <h2 className="sec-title proj-head__title" id="projects-title">
              Build something that <em>matters.</em>
            </h2>
            <p className="sec-lead proj-head__lead">
              Ideas become projects when the right people find each other.
            </p>
          </div>
          <div className="show-toolbar">
            <span className="show-toolbar__label">Concept showcase</span>
            <span className="show-toolbar__count" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="show-toolbar__btn show-toolbar__btn--prev"
              aria-label="Previous project"
              disabled={index === 0}
              onClick={() => go(-1)}
            >
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="show-toolbar__btn"
              aria-label="Next project"
              disabled={atEnd}
              onClick={() => go(1)}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <Reveal delay={80}>
          <div className="show-grid">
            <div className="show-stage">
              <div
                className="proj-carousel"
                ref={scrollerRef}
                tabIndex={0}
                role="region"
                aria-label="Concept project carousel"
                onScroll={update}
                onKeyDown={onKeyDown}
              >
                {PROJECTS.map((p, i) => (
                  <ProjCard key={p.name} p={p} active={i === index} />
                ))}
              </div>

              <div className="show-dots" role="group" aria-label="Carousel pagination">
                {PROJECTS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`show-dot${i === index ? ' is-active' : ''}`}
                    aria-label={`Go to project ${i + 1} of ${PROJECTS.length}`}
                    aria-current={i === index ? 'true' : undefined}
                    onClick={() => goToDot(i)}
                  />
                ))}
              </div>
            </div>

            <CrewPanel p={PROJECTS[index]} />
          </div>
        </Reveal>

        <div className="build-sep" aria-hidden="true" />

        <header className="build-head">
          <p className="sec-kicker">
            Build with people <span className="chip chip--light">Concept</span>
          </p>
          <h2 className="sec-title build-head__title">
            The next great project might start with <em>the right person.</em>
          </h2>
          <p className="sec-lead build-head__lead">
            AADI connects ideas with people who have the skills, interests and ambition to build
            them together.
          </p>
        </header>

        <Reveal delay={100}>
          <ol className="build-steps" aria-label="The AADI journey">
            {STEPS.map((s) => {
              const Icon = s.icon
              return (
                <li className="build-step" key={s.n}>
                  <span className="build-step__head">
                    <span className="build-step__num" aria-hidden="true">{s.n}</span>
                    <span className="build-step__icon"><Icon size={17} /></span>
                    <h4>{s.t}</h4>
                  </span>
                  <p>{s.d}</p>
                </li>
              )
            })}
          </ol>
        </Reveal>

        <Reveal delay={140}>
          <div className="diff-grid">
            {DIFFS.map((d) => {
              const Icon = d.icon
              return (
                <div className="card card--light diff-card" key={d.n}>
                  <span className="diff-card__head">
                    <span className="diff-card__num" aria-hidden="true">{d.n}</span>
                    <span className="diff-card__icon"><Icon size={17} /></span>
                    <h4>{d.t}</h4>
                  </span>
                  <p>{d.d}</p>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="id-link" role="figure" aria-label="How projects connect to your AADI profile">
            <div className="id-link__box">
              <span className="id-link__kicker">Project</span>
              <b>AI Study Assistant</b>
            </div>
            <span className="id-link__arrow" aria-hidden="true"><ArrowDown size={16} /></span>
            <div className="id-link__box is-accent">
              <span className="id-link__kicker">AADI Profile</span>
              <b className="id-link__gains">
                + Project <i>·</i> + Collaboration <i>·</i> + Skills <i>·</i> + Contribution
              </b>
            </div>
            <p className="id-link__caption">
              Everything you build can become part of your journey.
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="idea-cta">
            <span className="idea-cta__kicker">Have an idea?</span>
            <h3 className="idea-cta__title">
              Start with the idea. <em>Find the people.</em> Build what comes next.
            </h3>
            <div className="idea-cta__row">
              <Button href="#join" variant="primary" size="lg" arrow>
                Start a project
              </Button>
            </div>
            <p className="idea-cta__note">Concept preview · AADI is currently in early access.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
