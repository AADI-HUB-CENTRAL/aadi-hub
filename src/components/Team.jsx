import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { Plus } from './ui/Icons.jsx'

const LEADERS = [
  {
    num: '01',
    role: 'Founder',
    name: 'Naga Neeraj Pasupuleti',
    founding: true,
    img: '/founder.png',
    alt: 'Portrait of Naga Neeraj Pasupuleti, Founder of AADI HUB',
    imgWidth: 941,
    imgHeight: 1672,
    label: 'Founding Leadership',
    desc: 'Building the ecosystem for the next generation to connect, build and grow.',
    chips: ['Founder · AADI HUB', 'AADI-70001'],
  },
  {
    num: '02',
    role: 'Co-Founder',
    name: 'Pavan Pragna',
    founding: true,
    img: '/cofounder.jpeg',
    alt: 'Portrait of Pavan Pragna, Co-Founder of AADI HUB',
    imgWidth: 900,
    imgHeight: 1600,
    label: 'Founding Leadership',
    desc: 'Building a stronger community where the next generation can connect, collaborate and grow.',
    chips: ['Co-Founder · AADI HUB', 'AADI-70002'],
  },
  {
    num: '03',
    role: 'CEO',
    name: 'Reddy Ajay',
    img: '/ceo.jpeg',
    alt: 'Portrait of Reddy Ajay, CEO of AADI HUB',
    imgWidth: 1086,
    imgHeight: 1448,
    label: 'Execution & Leadership',
    desc: 'Leading vision, strategy and execution as AADI HUB grows from concept into an ecosystem.',
    chips: ['CEO · AADI HUB', 'AADI-70003'],
  },
  {
    num: '04',
    role: 'CTO',
    name: 'Rv Ram Charan',
    img: '/cto.jpeg',
    alt: 'Portrait of Rv Ram Charan, CTO of AADI HUB',
    imgWidth: 1086,
    imgHeight: 1448,
    label: 'Technology & Engineering',
    desc: 'Building the technology and engineering foundation that powers the AADI HUB ecosystem.',
    chips: ['CTO · AADI HUB', 'AADI-70004'],
  },
  {
    num: '05',
    role: 'Director',
    status: 'Now forming',
    hiring: true,
    desc: 'Leading operations, community and execution.',
    aria: 'Director position — portrait placeholder',
  },
]

function LeaderCard({ lead }) {
  const hasProfile = Boolean(lead.name)
  const hasImage = Boolean(lead.img)
  return (
    <article className={`lead-card${lead.founding ? ' lead-card--founding' : ''}${lead.hiring ? ' lead-card--hiring' : ''}`}>
      <div className="lead-card__photo">
        {hasImage ? (
          <img
            className="lead-card__img"
            src={lead.img}
            alt={lead.alt}
            width={lead.imgWidth}
            height={lead.imgHeight}
            loading="lazy"
          />
        ) : (
          <span className="lead-card__ph" role="img" aria-label={lead.aria}>
            <Plus size={24} />
          </span>
        )}
      </div>
      <p className="lead-card__role">
        <span className="lead-card__num" aria-hidden="true">
          {lead.num} —
        </span>
        {lead.role}
      </p>
      {lead.label && <p className="lead-card__label">{lead.label}</p>}
      {hasProfile ? (
        <>
          <h4 className="lead-card__name">{lead.name}</h4>
          <div className="lead-card__chips">
            {lead.chips.map((chip, i) => (
              <span className="lead-card__chip" key={chip}>
                {i === 0 && <i aria-hidden="true" />}
                {chip}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="lead-card__status">{lead.status}</p>
      )}
      <p className="lead-card__desc">{lead.desc}</p>
    </article>
  )
}

export default function Team() {
  return (
    <section className="sec sec--deep sec--line team" id="team">
      <div className="container">
        <SectionHeader
          kicker="The people behind AADI"
          center
          title={
            <>
              Built by people who believe
              <span className="line">
                the next generation can <em>build more.</em>
              </span>
            </>
          }
          lead="AADI HUB is being built by a team focused on creating a new digital ecosystem where young people can connect, build, contribute and grow."
        />

        <div className="leadership">
          <div className="leadership__tier-wrap">
            <p className="leadership__tier">Founding vision</p>
            <div className="leadership__row leadership__row--founding">
              {LEADERS.slice(0, 2).map((l, i) => (
                <Reveal key={l.role} delay={i * 110}>
                  <LeaderCard lead={l} />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <div className="leadership__conn" aria-hidden="true">
              <i />
            </div>
          </Reveal>

          <div className="leadership__tier-wrap">
            <p className="leadership__tier">Execution & leadership</p>
            <div className="leadership__row leadership__row--core">
              {LEADERS.slice(2).map((l, i) => (
                <Reveal key={l.role} delay={i * 110}>
                  <LeaderCard lead={l} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={120}>
          <div className="leadership__statement">
            <p>
              Different roles. <em>One direction.</em>
            </p>
            <p>
              From vision and technology to execution and community, every part of AADI is being
              built toward one goal — creating a place where the next generation can connect, build
              and grow.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="team__cta">
            <h3>Want to help shape AADI?</h3>
            <Button href="#join" variant="primary" size="lg" arrow>
              Join AADI
            </Button>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="team__bridge">
            Now, meet the <b>identity</b> at the center of the ecosystem.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
