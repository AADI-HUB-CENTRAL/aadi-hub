import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'

const STEPS = [
  { n: '01', t: 'Join', d: 'Create your identity. Everything else builds on top of it.' },
  { n: '02', t: 'Build', d: 'Turn participation, projects and helping others into visible progress.' },
  { n: '03', t: 'Get recognized', d: 'Earn reputation through what you actually do.' },
  { n: '04', t: 'Lead', d: 'Give back, grow the ecosystem, and open doors for the next person.' },
]

export default function Vision() {
  return (
    <section className="sec vision" id="vision">
      <div className="container vision__grid">
        <div className="vision__copy">
          <SectionHeader
            kicker="The AADI Vision"
            title={
              <>
                What if everything
                <span className="line">a student does</span>
                <span className="line">
                  could build their <em>identity?</em>
                </span>
              </>
            }
            lead="AADI is designed around participation, contribution, creation and growth — not certificates or follower counts."
          />
          <Reveal delay={200}>
            <blockquote className="vision__quote">
              “Every challenge you complete, every project you build, every person you help —
              it all adds to <b>one identity that moves with you.</b>”
            </blockquote>
          </Reveal>
        </div>

        <Reveal delay={120} className="vision__path-wrap">
          <div className="vision__path">
            <div className="vision__line" aria-hidden="true">
              <span className="vision__line--fill" />
            </div>
            {STEPS.map((s) => (
              <div className="vision__step" key={s.n}>
                <span className="vision__node" aria-hidden="true" />
                <p className="n">{s.n}</p>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
