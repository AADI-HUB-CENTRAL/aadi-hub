import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import { BrandSymbol } from './Logo.jsx'

const NODES = [
  { label: 'Students', pos: [38, 7], today: true },
  { label: 'Developers', pos: [66, 7] },
  { label: 'Communities', pos: [13, 22] },
  { label: 'Colleges', pos: [88, 22] },
  { label: 'Creators', pos: [5, 50] },
  { label: 'Companies', pos: [95, 50] },
  { label: 'Designers', pos: [16, 79] },
  { label: 'Mentors', pos: [85, 78] },
  { label: 'Founders', pos: [50, 93] },
  { label: 'Organizations', pos: [50, 32] },
]

const HUB = [50, 55]

export default function Future() {
  return (
    <section className="sec sec--night sec--line" id="future">
      <div className="container">
        <SectionHeader
          kicker="Future vision"
          center
          title={
            <>
              Built for the next <em>generation.</em>
            </>
          }
          lead="AADI is designed to grow beyond a single campus or country — into a connected ecosystem where every role has a place."
        />

        <Reveal delay={120} variant="scale">
          <div className="future__map">
            <svg className="future__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {NODES.map((n, i) => {
                const [x, y] = n.pos
                const mx = (x + HUB[0]) / 2
                const my = (y + HUB[1]) / 2
                return (
                  <path
                    key={i}
                    d={`M ${x} ${y} C ${mx} ${my}, ${mx} ${my}, ${HUB[0]} ${HUB[1]}`}
                    pathLength="1"
                  />
                )
              })}
            </svg>

            <div className="future__hub">
              <BrandSymbol size={56} />
            </div>

            {NODES.map((n) => (
              <span
                key={n.label}
                className={`future__node${n.today ? ' future__node--today' : ''}`}
                style={{ left: `${n.pos[0]}%`, top: `${n.pos[1]}%` }}
              >
                <i aria-hidden="true" />
                {n.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="future__legend">
            <span className="chip chip--kiwi">AADI starts here · Today</span>
            <span className="chip">Future ecosystem</span>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="future__outro">
            Today, AADI starts with <b>students</b>.
            <br />
            Tomorrow, it becomes a larger ecosystem for the people shaping what’s next —
            <br className="hide-mobile" />
            without pretending that future is already here.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
