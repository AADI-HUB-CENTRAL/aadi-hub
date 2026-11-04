import { Link } from 'react-router-dom'
import Reveal from './ui/Reveal.jsx'
import { ArrowUpRight } from './ui/Icons.jsx'
import MEMBERS from '../data/teamMembers.js'
import '../styles/team-page.css'

function TeamCard({ member }) {
  return (
    <article
      className={`crew-card crew-card--${member.variant}${member.founding ? ' crew-card--founding' : ''}`}
    >
      <span
        className="crew-card__blur"
        style={{ backgroundImage: `url(${member.img})` }}
        aria-hidden="true"
      />
      <img
        className="crew-card__img"
        src={member.img}
        alt={member.alt}
        width={member.imgWidth}
        height={member.imgHeight}
        loading="lazy"
        draggable="false"
      />
      <span className="crew-card__scrim" aria-hidden="true" />

      <div className="crew-card__top">
        <span className="crew-card__role">
          <span className="crew-card__num" aria-hidden="true">
            {member.num}
          </span>
          {member.role}
        </span>
        {member.founding && (
          <span className="crew-card__flag">
            <i aria-hidden="true" />
            Founding
          </span>
        )}
      </div>

      <div className="crew-card__body">
        <h4 className="crew-card__name">{member.name}</h4>
        <div className="crew-card__chips">
          {member.chips.map((chip, i) => (
            <span className="crew-card__chip" key={chip}>
              {i === 0 && <i aria-hidden="true" />}
              {chip}
            </span>
          ))}
        </div>
        <Link
          to={`/team/${member.slug}`}
          className="team-card__view"
          aria-label={`View profile for ${member.name}`}
        >
          View profile
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  )
}

export default function TeamPage() {
  return (
    <section className="sec sec--deep sec--line team-page" id="team">
      <div className="team-page__aura" aria-hidden="true" />

      <div className="container">
        <div className="team-page__back">
          <Link to="/">Back to home</Link>
        </div>

        <Reveal delay={80}>
          <div className="team-page__row">
            {MEMBERS.map((member) => (
              <TeamCard member={member} key={member.name} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
