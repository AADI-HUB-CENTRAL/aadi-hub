import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { Plus, Spark } from './ui/Icons.jsx'

const LEADERS = [
  {
    num: '01',
    role: 'Founder',
    name: 'Naga Neeraj Pasupuleti',
    founding: true,
    img: '/founder-card.webp',
    alt: 'Portrait of Naga Neeraj Pasupuleti, Founder of AADI HUB',
    imgWidth: 620,
    imgHeight: 1102,
    label: 'Founding Leadership',
    desc: 'Building the ecosystem for the next generation to connect, build and grow.',
    chips: ['Founder · AADI HUB', 'AADI-70001'],
    variant: 'founder',
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
    variant: 'cofounder',
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
    variant: 'ceo',
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
    variant: 'cto',
  },
  {
    num: '05',
    role: 'Social Media and Event Lead',
    name: 'Sandeep Vanise',
    img: '/director.jpeg',
    alt: 'Portrait of Sandeep Vanise, Social Media and Event Lead at AADI HUB',
    imgWidth: 1086,
    imgHeight: 1448,
    label: 'Director',
    desc: 'Leading social media, events and community storytelling that keep AADI HUB connected and visible.',
    chips: ['Director · AADI HUB', 'AADI-70005'],
    variant: 'director',
    vip: true,
  },
]

function CrewCard({ lead }) {
  const hasProfile = Boolean(lead.name)
  const hasImage = Boolean(lead.img)

  return (
    <article
      className={`crew-card crew-card--${lead.variant}${lead.founding ? ' crew-card--founding' : ''}${lead.hiring ? ' crew-card--open' : ''}`}
    >
      {hasImage ? (
        <>
          <span
            className="crew-card__blur"
            style={{ backgroundImage: `url(${lead.img})` }}
            aria-hidden="true"
          />
          <img
            className="crew-card__img"
            src={lead.img}
            alt={lead.alt}
            width={lead.imgWidth}
            height={lead.imgHeight}
            loading="lazy"
            draggable="false"
          />
          <span className="crew-card__scrim" aria-hidden="true" />
        </>
      ) : (
        <span className="crew-card__open-bg" aria-hidden="true">
          <i />
        </span>
      )}

      {lead.vip && (
        <span className="crew-card__vip">
          <span>VIP</span>
        </span>
      )}

      <div className="crew-card__top">
        <span className="crew-card__role">
          <span className="crew-card__num" aria-hidden="true">
            {lead.num}
          </span>
          {lead.role}
        </span>
        {lead.founding && (
          <span className="crew-card__flag">
            <i aria-hidden="true" />
            Founding
          </span>
        )}
        {lead.hiring && (
          <span className="crew-card__flag crew-card__flag--open">
            <i aria-hidden="true" />
            Open role
          </span>
        )}
      </div>

      <div className="crew-card__body">
        {lead.label && <span className="crew-card__label">{lead.label}</span>}

        {hasProfile ? (
          <>
            <h4 className="crew-card__name">{lead.name}</h4>
            {lead.desc && <p className="crew-card__desc">{lead.desc}</p>}
            {lead.chips?.length > 0 && (
              <div className="crew-card__chips">
                {lead.chips.map((chip, i) => (
                  <span className="crew-card__chip" key={chip}>
                    {i === 0 && <i aria-hidden="true" />}
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h4 className="crew-card__name">{lead.status}</h4>
            <p className="crew-card__desc">{lead.desc}</p>
            <span className="crew-card__open-icon" aria-hidden="true">
              <Plus size={18} />
            </span>
            <Button href="#join" variant="secondary" size="sm" arrow>
              Apply for Director
            </Button>
          </>
        )}
      </div>
    </article>
  )
}

export default function Team() {
  return (
    <section className="sec sec--deep sec--line team" id="team">
      <div className="team__aura" aria-hidden="true" />

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

        <Reveal delay={80}>
          <div className="crew__meta">
            <span className="crew__meta-item">
              <i aria-hidden="true" />
              Founding team
            </span>
            <span className="crew__meta-item">5 seats · one direction</span>
            <span className="crew__meta-item">
              <Spark size={13} />
              Building in public
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="crew-marquee" aria-label="AADI HUB founding team">
          <div className="crew-marquee__track">
            {[0, 1, 2].map((pass) => (
              <div
                className="crew-marquee__group"
                key={pass}
                aria-hidden={pass === 0 ? undefined : 'true'}
                inert={pass === 0 ? undefined : true}
              >
                {LEADERS.map((lead) => (
                  <CrewCard lead={lead} key={`${pass}-${lead.role}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
