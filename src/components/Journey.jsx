import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'

const STEPS = [
  { num: '01', title: 'Join', text: 'Create your identity.' },
  { num: '02', title: 'Connect', text: 'Find your people.' },
  { num: '03', title: 'Participate', text: 'Take on challenges.' },
  { num: '04', title: 'Build', text: 'Create projects together.' },
  { num: '05', title: 'Grow', text: 'Develop real skills.' },
  { num: '06', title: 'Get recognized', text: 'Build your reputation.' },
  { num: '07', title: 'Discover', text: 'Find opportunities.' },
  { num: '08', title: 'Lead', text: 'Give back to the ecosystem.' },
]

export default function Journey() {
  return (
    <section className="sec journey" id="journey">
      <div className="container">
        <SectionHeader
          kicker="How it works"
          center
          title={
            <>
              The <em>AADI</em> journey.
            </>
          }
          lead="Eight steps, one path — from your first login to leading the ecosystem. Everyone starts somewhere, and AADI is designed to carry you forward."
        />

        <div className="journey__wrap">
          <div className="journey__line" aria-hidden="true">
            <Reveal variant="fade" style={{ position: 'absolute', inset: 0 }}>
              <span className="journey__line--fill" />
            </Reveal>
          </div>

          {STEPS.map((s, i) => (
            <Reveal key={s.num} className="journey__step" delay={(i % 2) * 120}>
              <span className="journey__ghost" aria-hidden="true">
                {s.num}
              </span>
              <span className="journey__node">{s.num}</span>
              <div className="journey__card card card--hover">
                <span className="journey__num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
