import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { ArrowUpRight, Briefcase, Trophy, Graduation, Code, Users, Award, Clock, Rocket } from './ui/Icons.jsx'

const OPPORTUNITIES = [
  { icon: Briefcase, name: 'Internship', meta: 'Apply with your AADI profile' },
  { icon: Trophy, name: 'Hackathon', meta: 'Campus & national editions' },
  { icon: Graduation, name: 'Scholarship', meta: 'By participation and merit' },
  { icon: Code, name: 'Freelance Project', meta: 'Student-first opportunities' },
  { icon: Users, name: 'Mentorship', meta: 'Learn from people ahead of you' },
  { icon: Award, name: 'Competition', meta: 'Community and campus battles' },
  { icon: Clock, name: 'Event', meta: 'Workshops, meetups, launches' },
  { icon: Rocket, name: 'Startup Opportunity', meta: 'Early teams scouting talent' },
]

export default function Opportunities() {
  return (
    <section className="sec sec--night sec--line" id="opportunities">
      <div className="container">
        <SectionHeader
          kicker="Opportunities"
          tag="Coming soon"
          title={
            <>
              Your next opportunity
              <span className="line">shouldn’t be hard to <em>find.</em></span>
            </>
          }
          lead="AADI connects participation with real-world opportunities — so the work you already do starts working for you."
        />

        <div className="grid grid--4">
          {OPPORTUNITIES.map((o, i) => {
            const Icon = o.icon
            return (
              <Reveal key={o.name} delay={(i % 4) * 90}>
                <div className="card card--hover opp-card">
                  <span className="opp-card__arrow"><ArrowUpRight size={18} /></span>
                  <span className="opp-card__icon"><Icon size={21} /></span>
                  <div className="opp-card__name">{o.name}</div>
                  <div className="opp-card__meta">{o.meta}</div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={240}>
          <p className="opp-note">
            Opportunities are shared by the community and partners as the ecosystem grows.
            AADI does not guarantee placements — but it makes the path to them visible.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
