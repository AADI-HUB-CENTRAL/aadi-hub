import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import { X, Check } from './ui/Icons.jsx'

const TRADITIONAL = [
  'Classes',
  'Exams',
  'Certificates',
  'Scattered communities',
  'Limited collaboration',
  'Separate platforms',
]

const AADI = [
  'Identity',
  'Community',
  'Projects',
  'Challenges',
  'Opportunities',
  'Recognition',
  'Leadership',
]

export default function WhyAadi() {
  return (
    <section className="sec sec--paper sec--line" id="why">
      <div className="container">
        <SectionHeader
          kicker="Why AADI"
          center
          title={
            <>
              The classroom is only
              <span className="line">the <em>beginning.</em></span>
            </>
          }
          lead="School teaches you what to learn. AADI is where the rest of the journey happens — the people, the projects, the opportunities and the growth."
        />

        <div className="why__grid">
          <Reveal delay={100}>
            <div className="why-col why-col--traditional">
              <h3>
                <X size={18} />
                The traditional path
              </h3>
              {TRADITIONAL.map((t) => (
                <div className="why-item why-item--bad" key={t}>
                  <span className="why-item__icon"><X size={15} /></span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="why-col why-col--aadi">
              <h3>
                <Check size={18} />
                The AADI path
              </h3>
              {AADI.map((a) => (
                <div className="why-item why-item--good" key={a}>
                  <span className="why-item__icon"><Check size={15} /></span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
