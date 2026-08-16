import Reveal from './ui/Reveal.jsx'

const ITEMS = [
  { title: 'Not just learning.', sub: 'A space to build, not just absorb.' },
  { title: 'Not just networking.', sub: 'Relationships grounded in real activity.' },
  { title: 'Not just social media.', sub: 'A feed built around what you make.' },
]

export default function TrustStrip() {
  return (
    <section className="strip" aria-label="Positioning">
      <div className="container">
        <Reveal>
          <span className="strip__kicker">Not another student portal</span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="strip__title">
            Not another
            <br />
            <span className="outline">student portal.</span>
          </h2>
        </Reveal>

        <div className="strip__row">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={180 + i * 120}>
              <div className="strip__item">
                {item.title}
                <span>{item.sub}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <p className="strip__final">
            AADI brings the <b>pieces</b> together.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
