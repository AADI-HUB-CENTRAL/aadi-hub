import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Rangoli } from './DiwaliHeroDecorations.jsx'
import teamMembers from '../../data/teamMembers.js'

const FOUNDING_ROLES = ['Founder', 'Co-Founder', 'CEO', 'CTO']
const FOUNDING_TEAM = teamMembers.filter((member) => FOUNDING_ROLES.includes(member.role))
const MOBILE_TEAM_SPEED = 22

const PARTICLES = [
  { left: '4%', bottom: '22%', size: 4, duration: 17, delay: 1, drift: 18 },
  { left: '12%', bottom: '58%', size: 3, duration: 14, delay: 6, drift: -14 },
  { left: '23%', bottom: '34%', size: 5, duration: 19, delay: 3, drift: 20 },
  { left: '37%', bottom: '72%', size: 3, duration: 15, delay: 9, drift: -18 },
  { left: '52%', bottom: '18%', size: 4, duration: 16, delay: 2, drift: 16 },
  { left: '66%', bottom: '62%', size: 3, duration: 13, delay: 7, drift: -20 },
  { left: '78%', bottom: '28%', size: 5, duration: 18, delay: 4, drift: 18 },
  { left: '89%', bottom: '54%', size: 3, duration: 15, delay: 10, drift: -16 },
]

const SPARKLES = [
  { left: '7%', top: '20%', size: 8, duration: 5.4, delay: 0.4 },
  { left: '18%', top: '68%', size: 6, duration: 4.6, delay: 2.1 },
  { left: '31%', top: '16%', size: 5, duration: 6.2, delay: 1.2 },
  { left: '48%', top: '74%', size: 7, duration: 5.1, delay: 3.4 },
  { left: '62%', top: '12%', size: 6, duration: 4.4, delay: 0.8 },
  { left: '74%', top: '64%', size: 8, duration: 6.6, delay: 2.8 },
  { left: '87%', top: '26%', size: 5, duration: 5.8, delay: 1.7 },
  { left: '94%', top: '76%', size: 6, duration: 4.9, delay: 3.9 },
]

const FIREWORKS = [
  { left: '8%', top: '26%', color: 'rgba(255, 205, 120, 0.75)', delay: 0 },
  { left: '84%', top: '18%', color: 'rgba(255, 176, 92, 0.7)', delay: 3.6 },
  { left: '70%', top: '70%', color: 'rgba(255, 222, 156, 0.55)', delay: 7.2 },
]

function TeamCard({ member, pass }) {
  const nameId = `dw-team-name-${pass}-${member.slug}`

  return (
    <article
      className={`dw-team-card dw-team-card--${member.variant}`}
      aria-labelledby={nameId}
    >
      <span className="dw-team-card__aura" aria-hidden="true" />
      <span className="dw-team-card__pattern" aria-hidden="true" />

      <div className="dw-team-card__portrait">
        <img
          className="dw-team-card__img"
          src={member.img}
          alt={member.alt}
          width={member.imgWidth}
          height={member.imgHeight}
          loading="lazy"
          draggable="false"
        />
        <span className="dw-team-card__portrait-light" aria-hidden="true" />
        <span className="dw-team-card__frame" aria-hidden="true" />
      </div>

      <div className="dw-team-card__body">
        <span className="dw-team-card__role">
          <i aria-hidden="true">{member.num}</i>
          {member.role}
        </span>

        <h3 className="dw-team-card__name" id={nameId}>
          {member.name}
        </h3>

        <span className="dw-team-card__dept">{member.department}</span>
        <p className="dw-team-card__desc">{member.desc}</p>

        <div className="dw-team-card__chips">
          {member.chips.map((chip, index) => (
            <span className="dw-team-card__chip" key={chip}>
              {index === 0 && <i aria-hidden="true" />}
              {chip}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function DiwaliFoundingTeamSection() {
  const trackRef = useRef(null)
  const groupRef = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group) return undefined

    const mobileQuery = window.matchMedia('(max-width: 760px)')

    const syncLoop = () => {
      if (!mobileQuery.matches) {
        track.style.removeProperty('--dw-team-duration')
        return
      }

      const measuredGroupWidth = group.getBoundingClientRect().width
      const fallbackWidth = (track.scrollWidth || 0) / 2
      const singleGroupWidth = measuredGroupWidth > 0 ? measuredGroupWidth : fallbackWidth
      const exactShift = Math.max(1, singleGroupWidth)
      const durationSeconds = Math.max(12, (exactShift / MOBILE_TEAM_SPEED).toFixed(2))

      track.style.setProperty('--dw-team-duration', `${durationSeconds}s`)
    }

    syncLoop()

    const observer = new ResizeObserver(syncLoop)
    observer.observe(group)
    mobileQuery.addEventListener('change', syncLoop)

    return () => {
      observer.disconnect()
      mobileQuery.removeEventListener('change', syncLoop)
    }
  }, [])

  return (
    <section className="dw-team" aria-labelledby="dw-team-title">
      <div className="dw-team__ambient" aria-hidden="true">
        <div className="dw-team__glow dw-team__glow--gold" />
        <div className="dw-team__glow dw-team__glow--violet" />

        <div className="dw-team__rangoli dw-team__rangoli--left">
          <Rangoli className="dw-team__rangoli-svg" />
        </div>
        <div className="dw-team__rangoli dw-team__rangoli--right">
          <Rangoli className="dw-team__rangoli-svg" />
        </div>

        <div className="dw-team__particles">
          {PARTICLES.map((particle, index) => (
            <span
              key={index}
              className="dw-team__particle"
              style={{
                left: particle.left,
                bottom: particle.bottom,
                '--s': `${particle.size}px`,
                '--dur': `${particle.duration}s`,
                '--delay': `-${particle.delay}s`,
                '--drift': `${particle.drift}px`,
              }}
            />
          ))}
        </div>

        <div className="dw-team__sparkles">
          {SPARKLES.map((sparkle, index) => (
            <span
              key={index}
              className="dw-team__sparkle"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                '--s': `${sparkle.size}px`,
                '--dur': `${sparkle.duration}s`,
                '--delay': `${sparkle.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="dw-team__fireworks">
          {FIREWORKS.map((firework, index) => (
            <span
              key={index}
              className="dw-team__firework"
              style={{
                left: firework.left,
                top: firework.top,
                '--burst-color': firework.color,
                '--delay': `${firework.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="dw-team__inner">
        <header className="dw-team__head">
          <span className="dw-team__eyebrow">AADI HUB &middot; Founding Team</span>
          <h2 className="dw-team__title" id="dw-team-title">
            The People Behind AADI
          </h2>
          <p className="dw-team__subtitle">
            Celebrating the Festival of Lights, Together.
          </p>
          <p className="dw-team__lead">
            Behind every idea is a team, behind every vision is a shared belief.
            This Diwali, the AADI HUB founding team celebrates the spirit of
            togetherness, creativity and building something meaningful.
          </p>
        </header>

        <div
          className="dw-team__marquee"
          role="group"
          aria-label="AADI HUB founding team"
        >
          <div className="dw-team__track" ref={trackRef}>
            {[0, 1].map((pass) => (
              <div
                className="dw-team__group"
                key={pass}
                ref={pass === 0 ? groupRef : undefined}
                aria-hidden={pass === 0 ? undefined : 'true'}
                inert={pass === 0 ? undefined : true}
              >
                {FOUNDING_TEAM.map((member) => (
                  <TeamCard member={member} pass={pass} key={`${pass}-${member.slug}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="dw-team__closing">
          <span className="dw-team__closing-rule" aria-hidden="true" />
          <p className="dw-team__closing-line">One Vision. One Team. One AADI.</p>
          <p className="dw-team__closing-text">
            May this festival bring new ideas, stronger bonds and brighter
            beginnings.
          </p>
          <div className="dw-team__cta-wrap">
            <Link className="dw-btn dw-btn--outline dw-team__cta" to="/team">
              See All Team Members
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
