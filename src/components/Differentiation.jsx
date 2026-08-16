import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import { X, Check } from './ui/Icons.jsx'

const TRAD = ['Followers', 'Likes', 'Views', 'Engagement', 'Trending content']
const AADI = ['Projects', 'Challenges', 'Contributions', 'Collaborations', 'Achievements']

export default function Differentiation() {
  return (
    <section className="sec sec--paper sec--line" id="differentiation">
      <div className="container">
        <SectionHeader
          kicker="Social, but built around progress"
          tag="Positioning"
          title={
            <>
              Don’t just share your life.
              <span className="line">Share what you’re <em>building.</em></span>
            </>
          }
          lead="Traditional social platforms optimize for attention. AADI is designed around participation, contribution and progress."
        />

        <div className="compare">
          <Reveal delay={100}>
            <div className="compare__col compare__col--trad">
              <h3>
                <X size={16} />
                Traditional social
              </h3>
              {TRAD.map((t) => (
                <div className="compare__row" key={t}>
                  <span className="compare__row__icon"><X size={15} /></span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200} variant="scale">
            <span className="compare__vs" aria-hidden="true">
              VS
            </span>
          </Reveal>

          <Reveal delay={300}>
            <div className="compare__col compare__col--aadi">
              <h3>
                <Check size={16} />
                AADI
              </h3>
              {AADI.map((a) => (
                <div className="compare__row" key={a}>
                  <span className="compare__row__icon"><Check size={15} /></span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={360}>
          <p className="compare__closing">
            No follower race. No engagement bait. No pretending to be productive.
            <br />
            Just <b>meaningful activity</b> that becomes part of your journey.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
