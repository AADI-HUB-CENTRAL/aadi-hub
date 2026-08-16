import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'

const WORDS = [
  { n: '01', w: 'Aspire', d: 'Think beyond what exists today.' },
  { n: '02', w: 'Achieve', d: 'Turn goals into progress.' },
  { n: '03', w: 'Discover', d: 'Find people, skills, ideas and opportunities.' },
  { n: '04', w: 'Impact', d: 'Build something that matters and help others grow.' },
]

export default function Meaning() {
  return (
    <section className="sec meaning" aria-label="What AADI means">
      <div className="grid-bg grid-bg--masked" aria-hidden="true" />
      <div className="container">
        <SectionHeader
          kicker="The name"
          center
          title={
            <>
              What does <em>AADI</em> mean?
            </>
          }
          lead="Four ideas behind everything we build."
        />

        <div className="meaning__grid">
          {WORDS.map((w, i) => (
            <Reveal key={w.w} delay={i * 110}>
              <div className="meaning__word">
                <span className="meaning__word__num">{w.n}</span>
                <h3>{w.w}</h3>
                <p>{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <p className="meaning__foot">
            AADI HUB
            <span className="sep" aria-hidden="true" />
            <b>Aspire · Achieve · Discover · Impact</b>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
