import { useEffect, useState } from 'react'
import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'
import { BrandSymbol } from './Logo.jsx'
import { Shield, Flag, Users, Globe, Code, Target, Compass } from './ui/Icons.jsx'

const ORB_CARDS = [
  { icon: Shield, title: 'AADI ID', sub: 'One identity', pos: [16, 25] },
  { icon: Flag, title: 'Passport', sub: 'Your story', pos: [84, 22] },
  { icon: Users, title: 'Profile', sub: 'Your journey', pos: [93, 48] },
  { icon: Globe, title: 'Community', sub: 'Your people', pos: [84, 76] },
  { icon: Code, title: 'Project', sub: 'Build together', pos: [16, 76] },
  { icon: Target, title: 'Challenge', sub: 'Do something', pos: [4, 50] },
  { icon: Compass, title: 'Opportunity', sub: 'What’s next', pos: [50, 11] },
]

const MINI = [
  { icon: Shield, title: 'AADI ID', sub: 'One identity' },
  { icon: Flag, title: 'Passport', sub: 'Your story' },
  { icon: Users, title: 'Profile', sub: 'Your journey' },
  { icon: Globe, title: 'Community', sub: 'Your people' },
  { icon: Code, title: 'Project', sub: 'Build together' },
  { icon: Target, title: 'Challenge', sub: 'Do something' },
  { icon: Compass, title: 'Opportunity', sub: 'What’s next' },
]

function OrbVisual() {
  return (
    <div className="orb" aria-hidden="true">
      <div className="orb__dots" />
      <div className="orb__ring" />
      <div className="orb__ring orb__ring--2" />

      <svg className="orb__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {ORB_CARDS.map((c, i) => {
          const [x, y] = c.pos
          const cx = 50
          const cy = 50
          const mx = (x + cx) / 2
          const my = (y + cy) / 2 - 4
          return (
            <path
              key={i}
              d={`M ${x} ${y} C ${mx} ${my}, ${mx + 2} ${cy - 2}, ${cx} ${cy}`}
              pathLength="1"
            />
          )
        })}
      </svg>

      <div className="orb__pulse" />

      <div className="orb__cards">
        {ORB_CARDS.map((c, i) => {
          const Icon = c.icon
          return (
            <div key={c.title} className={`orb__card orb__card--${i + 1}`}>
              <span className="orb__card__icon">
                <Icon size={18} />
              </span>
              <div className="orb__card__title">{c.title}</div>
              <div className="orb__card__sub">{c.sub}</div>
            </div>
          )
        })}
      </div>

      <div className="orb__hub">
        <BrandSymbol size={56} />
        <span className="orb__hub__label">AADI Ecosystem</span>
      </div>

      <div className="orb__minis">
        {MINI.map((c) => {
          const Icon = c.icon
          return (
            <div key={c.title} className="orb__mini">
              <span className="orb__mini__icon">
                <Icon size={17} />
              </span>
              <div className="orb__mini__title">{c.title}</div>
              <div className="orb__mini__sub">{c.sub}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setLoaded(true)
    })
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section className={`hero${loaded ? ' is-loaded' : ''}`} id="top">
      <div className="grid-bg grid-bg--masked" aria-hidden="true" />
      <div className="glow-kiwi" style={{ top: '-12%', right: '-8%', width: '52vw', height: '52vw', maxWidth: 720, maxHeight: 720 }} aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__content">
          <Reveal variant="fade" delay={120}>
            <span className="hero__tagline">
              <span className="dot" />
              A digital ecosystem for the next generation
            </span>
          </Reveal>

          <h1 className="hero__title">
            <span className="line">
              <span className="in">The next generation</span>
            </span>
            <span className="line">
              <span className="in text-outline">needs a place</span>
            </span>
            <span className="line">
              <span className="in line--kiwi">of its own.</span>
            </span>
          </h1>

          <Reveal delay={420}>
            <p className="hero__sub">
              <b>Your people. Your journey. Your next.</b>
              <br />
              AADI HUB brings identity, community, projects, challenges and opportunities
              into one ecosystem built around how young people actually grow.
            </p>
          </Reveal>

          <Reveal delay={540}>
            <div className="btn-row">
              <Button href="#join" variant="primary" size="lg">
                Join the Movement
              </Button>
              <Button href="#ecosystem" variant="secondary" size="lg" arrow>
                Explore the Ecosystem
              </Button>
            </div>
          </Reveal>

          <Reveal delay={660}>
            <div className="hero__trust">
              <span className="chip chip--kiwi">
                <span className="hero__status-dot" aria-hidden="true" />
                Early access · Building in public
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={300}>
          <OrbVisual />
        </Reveal>
      </div>
    </section>
  )
}
