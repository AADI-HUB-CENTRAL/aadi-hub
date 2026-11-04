import { Link, Navigate, useParams } from 'react-router-dom'
import Reveal from './ui/Reveal.jsx'
import { ArrowRight } from './ui/Icons.jsx'
import MEMBERS from '../data/teamMembers.js'
import TeamGoldIdCard from './TeamGoldIdCard.jsx'
import '../styles/team-member.css'

export default function TeamMemberPage() {
  const { slug } = useParams()
  const member = MEMBERS.find((item) => item.slug === slug)

  if (!member) return <Navigate to="/team" replace />

  return (
    <section className="sec sec--deep sec--line member-page" id="member">
      <div className="member-page__aura" aria-hidden="true" />

      <div className="container">
        <div className="member-page__back">
          <Link to="/team">
            <ArrowRight size={14} />
            All team
          </Link>
        </div>

        <div className="member-page__hero">
          <Reveal>
            <figure className="member-page__portrait">
              <img
                src={member.img}
                alt={member.alt}
                width={member.imgWidth}
                height={member.imgHeight}
                draggable="false"
              />
              <span className="member-page__portrait-scrim" aria-hidden="true" />
              <figcaption className="member-page__portrait-tag">
                <i aria-hidden="true" />
                {member.role}
              </figcaption>
            </figure>
          </Reveal>

          <div className="member-page__details">
            <Reveal delay={80}>
              <span className="member-page__eyebrow">{member.label}</span>
              <h1 className="member-page__name">{member.name}</h1>
              <p className="member-page__role">{member.role} · AADI HUB</p>
              <p className="member-page__bio">{member.bio}</p>

              <div className="member-page__focus">
                {member.focus.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={140}>
          <div className="member-page__id">
            <div className="member-page__id-head">
              <span className="member-page__id-kicker">Digital identity</span>
              <h2 className="member-page__id-title">Premium AADI ID</h2>
              <p className="member-page__id-note">
                A gold-tier identity reserved for the people building AADI HUB.
              </p>
            </div>
            <TeamGoldIdCard member={member} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
