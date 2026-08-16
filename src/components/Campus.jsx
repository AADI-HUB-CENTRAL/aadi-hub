import { useRef, useState, useCallback, useEffect } from 'react'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { BrandSymbol } from './Logo.jsx'
import {
  Users,
  Trophy,
  Code,
  Search,
  ArrowRight,
  Layers,
  MapPin,
  Zap,
  Graduation,
} from './ui/Icons.jsx'

const CARD_GAP = 16

const TABS = ['Overview', 'Communities', 'Projects', 'Events', 'Challenges']

const ACTIVITY = [
  { icon: Code, title: 'A student started a new project', cat: 'AI Study Assistant', time: 'Just now' },
  { icon: Users, title: 'Data Science community posted a meetup', cat: 'Community', time: 'Today' },
  { icon: Trophy, title: 'Campus Build Battle opens', cat: 'Challenge', time: 'Tomorrow' },
  { icon: Search, title: 'New project looking for a designer', cat: 'Project', time: 'Today' },
]

const UPNEXT = [
  { n: 'Data Science Sprint', d: 'Fri · Campus' },
  { n: '30-Minute Build', d: 'Sat · Online' },
  { n: 'AI Community Meetup', d: 'Next week' },
]

const CONTRIBUTORS = [
  { r: '01', n: 'Aarav Mehta', l: 'Project Builder' },
  { r: '02', n: 'Diya Sharma', l: 'Community Contributor' },
  { r: '03', n: 'Kunal Gupta', l: 'Challenge Builder' },
  { r: '04', n: 'Sanya Rao', l: 'Project Collaborator' },
  { r: '05', n: 'Riya Verma', l: 'Community Contributor' },
]

const CAMPUSES = [
  { mono: 'MH', name: 'MITS Hub', note: 'Concept campus' },
  { mono: 'SM', name: "St. Martin's", note: 'Concept campus' },
  { mono: 'CT', name: 'Central Tech', note: 'Concept campus' },
  { mono: 'NV', name: 'Northview', note: 'Concept campus' },
]

const ECOSYSTEM = [
  { icon: Users, t: 'Communities' },
  { icon: Code, t: 'Projects' },
  { icon: MapPin, t: 'Events' },
  { icon: Trophy, t: 'Challenges' },
]

function CampusHub() {
  return (
    <div className="campus-window">
      <div className="campus-chrome">
        <span className="campus-chrome__dot campus-chrome__dot--kiwi" aria-hidden="true" />
        <span className="campus-chrome__dot" aria-hidden="true" />
        <span className="campus-chrome__dot" aria-hidden="true" />
        <span className="campus-chrome__tab">
          <Users size={13} />
          <b>mitshub</b>.aadi <span className="campus-chrome__sep" aria-hidden="true">—</span> Campus Hub
        </span>
        <span className="chip chip--kiwi campus-chrome__chip">Concept Preview</span>
        <span className="campus-chrome__note">Illustrative preview · not live data</span>
      </div>

      <div className="campus-hub">
        <div className="campus-hub__head">
          <span className="campus-mono campus-mono--lg" aria-hidden="true">
            MH
          </span>
          <div className="campus-hub__name">
            <b>MITS HUB</b>
            <span>Madanapalle Institute of Technology &amp; Science</span>
          </div>
          <div className="campus-hub__tags">
            <span className="tag tag--kiwi">Campus Hub</span>
            <span className="chip chip--light">Concept Campus</span>
          </div>
        </div>

        <div className="campus-tabs" role="tablist" aria-label="Campus hub sections (concept preview)">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={`campus-tab${i === 0 ? ' is-active' : ''}`}
              role="tab"
              aria-selected={i === 0}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="campus-hub__body">
          <div className="campus-main">
            <div className="campus-block">
              <h4 className="campus-block__title">
                Recent campus activity
                <span className="campus-block__note">Concept activity</span>
              </h4>
              {ACTIVITY.map((a) => {
                const Icon = a.icon
                return (
                  <div className="act-row" key={a.title}>
                    <span className="act-row__ico" aria-hidden="true">
                      <Icon size={14} />
                    </span>
                    <span className="act-row__txt">
                      <b>{a.title}</b>
                      <i>{a.cat}</i>
                    </span>
                    <span className="act-row__time">{a.time}</span>
                  </div>
                )
              })}
            </div>

            <div className="campus-block">
              <h4 className="campus-block__title">Up next</h4>
              <div className="upnext">
                {UPNEXT.map((u) => (
                  <div className="upnext__row" key={u.n}>
                    <span className="upnext__dot" aria-hidden="true" />
                    <b>{u.n}</b>
                    <span className="upnext__day">{u.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="campus-rail">
            <div className="rail-card rail-card--project">
              <div className="rail-card__head">
                <h4>Featured project</h4>
                <span className="chip chip--light">Concept</span>
              </div>
              <div className="rail-card__title">AI Study Assistant</div>
              <p className="rail-card__sub">Student-built project</p>
              <div className="rail-card__cats">
                <span className="tag tag--kiwi">AI · Education</span>
              </div>
              <p className="rail-card__looking">
                Looking for: <b>Frontend · UI</b>
              </p>
              <Button href="#join" variant="secondary" size="sm">
                View project
              </Button>
            </div>

            <div className="rail-card rail-card--challenge">
              <div className="rail-card__head">
                <h4>Campus challenge</h4>
                <span className="chip chip--light">Concept</span>
              </div>
              <p className="rail-card__quote">
                Build something useful for student life.
              </p>
              <p className="rail-card__sub">Weekend build sprint</p>
              <Button href="#challenges" variant="ghost" size="sm" className="rail-card__btn">
                Explore <ArrowRight size={14} />
              </Button>
            </div>

            <div className="rail-card rail-card--contributors">
              <div className="rail-card__head">
                <h4>Campus contributors</h4>
                <span className="chip chip--light">Concept model</span>
              </div>
              {CONTRIBUTORS.map((c) => (
                <div className="contrib-row" key={c.r}>
                  <span className="contrib-row__rank">{c.r}</span>
                  <b>{c.n}</b>
                  <span className="contrib-row__label">{c.l}</span>
                </div>
              ))}
              <p className="contrib-note">Recognition based on contribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampusFlow() {
  return (
    <div className="campus-flow" role="img" aria-label="Your campus connects to your campus ecosystem and the wider AADI ecosystem">
      <div className="flow-node">
        <div className="flow-node__card">
          <span className="flow-node__tag">Your campus</span>
          <div className="flow-node__body">
            <span className="campus-mono campus-mono--md" aria-hidden="true">
              MH
            </span>
            <span className="flow-node__name">
              <b>MITS HUB</b>
              <i>Concept campus</i>
            </span>
          </div>
        </div>
      </div>

      <span className="flow-arrow" aria-hidden="true">
        <span className="flow-arrow__icon">
          <ArrowRight size={15} />
        </span>
      </span>

      <div className="flow-node">
        <div className="flow-node__card flow-node__card--grid">
          <span className="flow-node__tag">Your campus ecosystem</span>
          <div className="flow-node__grid">
            {ECOSYSTEM.map((e) => {
              const Icon = e.icon
              return (
                <span className="flow-node__cell" key={e.t}>
                  <Icon size={14} />
                  {e.t}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <span className="flow-arrow" aria-hidden="true">
        <span className="flow-arrow__icon">
          <ArrowRight size={15} />
        </span>
      </span>

      <div className="flow-node">
        <div className="flow-node__card">
          <span className="flow-node__tag">Aadi hub</span>
          <div className="flow-node__body">
            <span className="flow-node__symbol" aria-hidden="true">
              <BrandSymbol size={30} />
            </span>
            <span className="flow-node__name">
              <b>AADI HUB</b>
              <i>Global youth ecosystem</i>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampusSelector() {
  const scrollerRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [atEnd, setAtEnd] = useState(false)

  const cardStep = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return 0
    const card = el.querySelector('.campus-card')
    return card ? card.getBoundingClientRect().width + CARD_GAP : 0
  }, [])

  const update = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const step = cardStep()
    if (!step) return
    const i = Math.round(el.scrollLeft / step)
    setIndex(Math.max(0, Math.min(i, CAMPUSES.length - 1)))
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8)
  }, [cardStep])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const padAndUpdate = () => {
      const step = cardStep()
      const card = el.querySelector('.campus-card')
      if (step && card) {
        el.style.paddingRight = `${Math.max(0, el.clientWidth - card.getBoundingClientRect().width)}px`
      }
      update()
    }
    padAndUpdate()
    window.addEventListener('resize', padAndUpdate)
    return () => window.removeEventListener('resize', padAndUpdate)
  }, [update, cardStep])

  const go = useCallback(
    (dir) => {
      const el = scrollerRef.current
      const step = cardStep()
      if (!el || !step) return
      const max = el.scrollWidth - el.clientWidth
      const target = Math.max(0, Math.min(el.scrollLeft + dir * step, max))
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' })
    },
    [cardStep]
  )

  return (
    <div className="campus-selector">
      <div className="campus-selector__head">
        <h3 className="campus-selector__title">Explore campus hubs</h3>
        <div className="campus-selector__controls">
          <button
            type="button"
            className="campus-selector__btn"
            aria-label="Previous campus"
            disabled={index === 0}
            onClick={() => go(-1)}
          >
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="campus-selector__btn campus-selector__btn--next"
            aria-label="Next campus"
            disabled={atEnd}
            onClick={() => go(1)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="campus-scroll"
        ref={scrollerRef}
        onScroll={update}
      >
        {CAMPUSES.map((c) => (
          <div className="card card--light card--hover campus-card" key={c.mono}>
            <span className="campus-card__mono" aria-hidden="true">
              {c.mono}
            </span>
            <span className="campus-card__name">
              <b>{c.name}</b>
              <i>{c.note}</i>
            </span>
          </div>
        ))}
      </div>

      <p className="campus-selector__note">Illustrative campus examples · not current partnerships</p>
    </div>
  )
}

export default function Campus() {
  return (
    <section className="sec sec--paper sec--line campus" id="campus">
      <div className="container">
        <Reveal>
          <header className="campus-head">
            <div className="campus-head__copy">
              <p className="sec-kicker">
                Campus ecosystem <span className="chip chip--light">Concept</span>
              </p>
              <h2 className="sec-title campus-head__title" id="campus-title">
                Your college. Your community.
                <span className="line">
                  Your <em>campus.</em>
                </span>
              </h2>
              <p className="sec-lead campus-head__lead">
                Every campus gets its own space inside AADI — connecting students, communities,
                projects, events and challenges to the wider ecosystem.
              </p>
            </div>
            <span className="campus-head__status">
              <span className="campus-head__dot" aria-hidden="true" />
              Concept Preview
            </span>
          </header>
        </Reveal>

        <Reveal delay={120}>
          <CampusHub />
        </Reveal>

        <Reveal delay={160}>
          <div className="campus-flow-wrap">
            <p className="campus-flow__kicker">
              <Graduation size={15} />
              From your campus to the ecosystem
            </p>
            <CampusFlow />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <CampusSelector />
        </Reveal>

        <Reveal delay={240}>
          <div className="campus-cta">
            <p className="campus-cta__kicker">Join the ecosystem</p>
            <h3 className="campus-cta__title">
              Bring AADI to <em>your campus.</em>
            </h3>
            <p className="campus-cta__lead">
              Start building your campus community, projects and activities inside the wider AADI
              ecosystem.
            </p>
            <div className="btn-row campus-cta__row">
              <Button href="#join" variant="primary" size="lg">
                Join AADI
              </Button>
              <Button href="#vision" variant="light" size="lg" arrow>
                Explore the Vision
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
