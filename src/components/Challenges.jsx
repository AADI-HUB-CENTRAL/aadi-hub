import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { Clock, Users, Spark, ArrowRight, Zap, Trophy, Code, Palette, MapPin } from './ui/Icons.jsx'

const CHALLENGES = [
  { name: '30-Minute Build', category: 'Quick Build', desc: 'Ship something tiny, on the clock.', meta: '30 MIN · SOLO', status: 'Concept' },
  { name: 'Design Battle', category: 'Creative', desc: 'One brief. One hour. Go.', meta: '1 HOUR · BATTLE', status: 'Concept' },
  { name: 'AI Challenge', category: 'AI', desc: 'From prompt to product.', meta: 'AI · BUILD', status: 'Coming Soon' },
  { name: 'Coding Sprint', category: 'Coding', desc: 'Speed with quality.', meta: 'SPRINT · SOLO', status: 'Concept' },
  { name: 'Creator Challenge', category: 'Creative', desc: 'Make it, share it, grow.', meta: 'CREATIVE · SOLO', status: 'Concept' },
  { name: 'Campus Challenge', category: 'Campus', desc: 'Your campus vs the rest.', meta: 'CAMPUS · TEAM', status: 'Coming Soon' },
]

const TYPES = [
  { label: 'Quick Builds', icon: Zap },
  { label: 'Battles', icon: Trophy },
  { label: 'Coding', icon: Code },
  { label: 'Creative', icon: Palette },
  { label: 'Campus', icon: MapPin },
]

const STEPS = ['Brief', 'Build', 'Submit', 'Showcase']
const FLOW = ['Discover', 'Join', 'Build', 'Submit', 'Get recognized']
const CARD_GAP = 16

function ChallengeCard({ c, active }) {
  return (
    <a className={`challenge-card${active ? ' is-active' : ''}`} href="#join">
      <div className="challenge-card__top">
        <span className="challenge-card__cat">{c.category}</span>
        <span className="challenge-card__status">{c.status}</span>
      </div>
      <h4 className="challenge-card__name">{c.name}</h4>
      <p className="challenge-card__desc">{c.desc}</p>
      <div className="challenge-card__foot">
        <span className="challenge-card__meta">{c.meta}</span>
        <span className="challenge-card__explore">
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </a>
  )
}

export default function Challenges() {
  const scrollerRef = useRef(null)
  const pausedRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [atEnd, setAtEnd] = useState(false)

  const cardStep = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return 0
    const card = el.querySelector('.challenge-card')
    return card ? card.getBoundingClientRect().width + CARD_GAP : 0
  }, [])

  const update = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const step = cardStep()
    if (!step) return
    const i = Math.round(el.scrollLeft / step)
    setIndex(Math.max(0, Math.min(i, CHALLENGES.length - 1)))
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8)
  }, [cardStep])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scrollTo = useCallback(
    (left) => {
      const el = scrollerRef.current
      if (!el) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' })
    },
    []
  )

  const go = useCallback(
    (dir) => {
      const el = scrollerRef.current
      const step = cardStep()
      if (!el || !step) return
      const max = el.scrollWidth - el.clientWidth
      const left = Math.max(0, Math.min(el.scrollLeft + dir * step, max))
      scrollTo(left)
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

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let visible = true
    let lastInteract = Date.now()
    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
      }, { threshold: 0.25 })
      io.observe(el)
    }

    const onInteract = () => {
      lastInteract = Date.now()
    }
    el.addEventListener('scroll', onInteract, { passive: true })
    el.addEventListener('touchstart', onInteract, { passive: true })

    const id = setInterval(() => {
      if (!visible || pausedRef.current) return
      if (Date.now() - lastInteract < 4500) return
      const step = cardStep()
      if (!step) return
      const max = el.scrollWidth - el.clientWidth
      const next = el.scrollLeft + step > max - 8 ? 0 : el.scrollLeft + step
      el.scrollTo({ left: next, behavior: 'smooth' })
    }, 6500)

    return () => {
      clearInterval(id)
      io?.disconnect()
      el.removeEventListener('scroll', onInteract)
      el.removeEventListener('touchstart', onInteract)
    }
  }, [cardStep])

  const pause = () => {
    pausedRef.current = true
  }
  const resume = () => {
    pausedRef.current = false
  }

  return (
    <section
      className="sec sec--night sec--line challenges"
      id="challenges"
      aria-labelledby="challenges-title"
    >
      <div className="container">
        <header className="challenges__head">
          <p className="sec-kicker">
            Challenges <span className="chip">Concept</span>
          </p>
          <h2 className="sec-title challenges__title" id="challenges-title">
            Turn your time into <em>something.</em>
          </h2>
          <p className="sec-lead">Challenges built to make you build, create, compete and grow.</p>
          <p className="challenges__sub">
            Short sprints. Creative battles. Coding challenges. Campus competitions. Every
            challenge gives you something to work toward — and something to show for it.
          </p>
        </header>

        <Reveal delay={100}>
          <div className="card challenge-feature">
            <div className="challenge-feature__top">
              <span className="challenge__kicker">Featured Challenge</span>
              <span className="chip chip--kiwi">Concept Challenge</span>
            </div>
            <div className="challenge-feature__body">
              <div className="challenge-feature__main">
                <h3 className="challenge__title">AI Build Battle</h3>
                <p className="challenge__desc">
                  Build an AI-powered idea from brief to working prototype.
                </p>
              </div>
              <div className="challenge-feature__side">
                <div className="challenge__meta" aria-label="Challenge format">
                  <span>
                    <Clock size={15} /> 48 Hours
                  </span>
                  <span>
                    <Users size={15} /> Team
                  </span>
                  <span>
                    <Spark size={15} /> AI / Build
                  </span>
                </div>
                <div className="challenge__steps" aria-label="Challenge progression">
                  {STEPS.map((s, i) => (
                    <span key={s} className="challenge__step">
                      {i > 0 && (
                        <i className="challenge__step-sep" aria-hidden="true">
                          →
                        </i>
                      )}
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="challenge-feature__cta-row">
              <Button href="#join" variant="primary" size="md" arrow>
                Explore Challenge
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ol className="challenge__flow" aria-label="Challenge journey">
            {FLOW.map((f, i) => (
              <li key={f} className="challenge__flow-step">
                <span className="challenge__flow-num" aria-hidden="true">
                  0{i + 1}
                </span>{' '}
                {f}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={150}>
          <div className="challenge-toolbar">
            <div className="challenge__types" role="group" aria-label="Challenge types">
              {TYPES.map((t) => {
                const Icon = t.icon
                return (
                  <span key={t.label} className="challenge__type">
                    <Icon size={14} /> {t.label}
                  </span>
                )
              })}
            </div>
            <div className="challenge-car__controls">
              <span className="challenge-car__counter" aria-live="polite">
                {String(index + 1).padStart(2, '0')} / {String(CHALLENGES.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="challenge-car__btn challenge-car__btn--prev"
                aria-label="Previous challenge"
                disabled={index === 0}
                onClick={() => go(-1)}
              >
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="challenge-car__btn"
                aria-label="Next challenge"
                disabled={atEnd}
                onClick={() => go(1)}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div
            className="challenge-carousel"
            ref={scrollerRef}
            tabIndex={0}
            role="region"
            aria-label="Challenge carousel"
            onScroll={update}
            onKeyDown={onKeyDown}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocus={pause}
            onBlur={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
          >
            {CHALLENGES.map((c, i) => (
              <ChallengeCard key={c.name} c={c} active={i === index} />
            ))}
          </div>

          <div className="challenge-car__dots" role="group" aria-label="Carousel pagination">
            {CHALLENGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`challenge-car__dot${i === index ? ' is-active' : ''}`}
                aria-label={`Go to challenge ${i + 1} of ${CHALLENGES.length}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goToDot(i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
