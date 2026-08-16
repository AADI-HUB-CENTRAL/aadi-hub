import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import { BrandSymbol } from './Logo.jsx'
import { ArrowDown, Camera, Briefcase, Message, Code, Trophy, Graduation, Award } from './ui/Icons.jsx'

const TODAY = [
  { name: 'Instagram', val: 'social', icon: Camera },
  { name: 'LinkedIn', val: 'professional identity', icon: Briefcase },
  { name: 'Discord', val: 'communities', icon: Message },
  { name: 'GitHub', val: 'projects', icon: Code },
  { name: 'Hackathon platforms', val: 'competitions', icon: Trophy },
  { name: 'College portals', val: 'information', icon: Graduation },
  { name: 'Certificates', val: 'proof of learning', icon: Award },
]

const RING_POINTS = [
  [10, 20], [30, 8], [70, 8], [90, 20],
  [97, 50], [90, 80], [70, 92], [50, 95],
  [30, 92], [10, 80], [3, 50],
]

const CENTER = [50, 50]

function HubPanel() {
  return (
    <Reveal delay={160}>
      <div className="problem__panel">
        <svg className="problem__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {RING_POINTS.map(([x, y], i) => {
            const mx = (x + CENTER[0]) / 2
            const my = (y + CENTER[1]) / 2
            return (
              <path
                key={i}
                d={`M ${x} ${y} C ${mx} ${my}, ${mx} ${my}, ${CENTER[0]} ${CENTER[1]}`}
                pathLength="1"
              />
            )
          })}
        </svg>
        <div className="problem__hub problem__hub--center">
          <BrandSymbol size={84} />
          <div className="problem__hub__title">AADI HUB</div>
          <div className="problem__hub__lines">
            <span className="one">One identity.</span>
            <span className="two">One community.</span>
            <span className="two">One ecosystem.</span>
          </div>
          <p className="problem__connect">
            Each platform solves one piece.
            <br />
            <b>AADI connects the journey.</b>
          </p>
        </div>
      </div>
    </Reveal>
  )
}

export default function Problem() {
  return (
    <section className="sec sec--night sec--line" id="ecosystem">
      <div className="container">
        <SectionHeader
          kicker="The problem"
          title={
            <>
              Students have platforms.
              <span className="line">They don’t have an <em>ecosystem.</em></span>
            </>
          }
          lead="Every platform below is useful on its own. But the student journey is split across all of them — identity here, community there, projects somewhere else."
        />

        <Reveal delay={100}>
          <p className="sec-kicker problem__chips-head">Today</p>
        </Reveal>
        <Reveal delay={140}>
          <div className="problem__today">
            {TODAY.map((t) => {
              const Icon = t.icon
              return (
                <div className="problem__chip" key={t.name}>
                  <span className="problem__chip__name">
                    <span className="problem__chip__icon">
                      <Icon size={17} />
                    </span>
                    {t.name}
                  </span>
                  <span className="problem__chip__val">→ {t.val}</span>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="problem__scattered">
            Everything is <span className="text-kiwi">scattered.</span>
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="problem__fall" aria-hidden="true">
            <ArrowDown size={26} />
          </div>
        </Reveal>

        <HubPanel />
      </div>
    </section>
  )
}
