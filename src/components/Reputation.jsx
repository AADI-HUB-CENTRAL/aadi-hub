import { Fragment } from 'react'
import Reveal from './ui/Reveal.jsx'
import { Code, Heart, Users, Graduation, Flag, Shield, Target, Layers, ArrowRight } from './ui/Icons.jsx'

const DIMENSIONS = [
  { icon: Code, name: 'Build', desc: 'Create projects, prototypes and experiments.' },
  { icon: Heart, name: 'Contribute', desc: 'Help communities, events and initiatives.' },
  { icon: Users, name: 'Collaborate', desc: 'Work with other members and teams.' },
  { icon: Graduation, name: 'Teach', desc: 'Mentor, explain and help others grow.' },
  { icon: Flag, name: 'Lead', desc: 'Organize communities, challenges and activities.' },
]

const PROFILE_DIMS = [
  { name: 'Build', w: 100 },
  { name: 'Collaborate', w: 80 },
  { name: 'Teach', w: 60 },
  { name: 'Contribute', w: 90 },
  { name: 'Lead', w: 70 },
]

const STORY = [
  'Joined AADI',
  'Completed first challenge',
  'Built first project',
  'Collaborated with a team',
  'Helped another member',
  'Mentored a junior',
  'Led a community activity',
]

const FEED = [
  { icon: Code, action: 'Built', context: 'AI Study Assistant', cat: 'Project contribution' },
  { icon: Heart, action: 'Helped', context: "Reviewed a teammate's project", cat: 'Community contribution' },
  { icon: Target, action: 'Completed', context: '30-Minute Build', cat: 'Challenge contribution' },
  { icon: Graduation, action: 'Mentored', context: 'Helped a junior with Python', cat: 'Mentorship contribution' },
]

const LEVELS = [
  { n: '01', icon: Shield, name: 'Member', desc: 'Participating in the ecosystem.' },
  { n: '02', icon: Heart, name: 'Contributor', desc: 'Helping and sharing.' },
  { n: '03', icon: Code, name: 'Builder', desc: 'Creating projects and solving problems.' },
  { n: '04', icon: Graduation, name: 'Mentor', desc: 'Helping others grow.' },
  { n: '05', icon: Flag, name: 'Leader', desc: 'Creating communities and leading initiatives.' },
]

const SOCIAL = ['Followers', 'Likes', 'Views', 'Engagement']

const AADI_ITEMS = ['Projects', 'Contributions', 'Collaboration', 'Mentorship', 'Leadership']

const BADGES = ['Project Builder', 'Community Contributor', 'Mentor', 'Challenge Finisher', 'Collaborator', 'Campus Leader']

const ACTIVITY = ['Project', 'Challenge', 'Community', 'Mentorship', 'Event', 'Collaboration']

function RepProfile() {
  return (
    <div className="rep-profile" role="img" aria-label="Illustrative AADI reputation profile">
      <div className="rep-profile__chrome">
        <span className="rep-profile__dot rep-profile__dot--kiwi" aria-hidden="true" />
        <span className="rep-profile__dot" aria-hidden="true" />
        <span className="rep-profile__dot" aria-hidden="true" />
        <span className="rep-profile__tab">
          <Layers size={13} />
          <b>aadi</b>.reputation — Contribution
        </span>
        <span className="chip chip--kiwi rep-profile__chip">Concept Profile</span>
      </div>

      <div className="rep-profile__body">
        <div className="rep-profile__id">
          <span className="rep-profile__avatar" aria-hidden="true">
            NN
          </span>
          <span className="rep-profile__who">
            <b>Naga Neeraj</b>
            <i>Data Science · Builder</i>
          </span>
        </div>

        <div className="rep-profile__level">
          <span className="rep-profile__levelname">
            <b>Level 14</b>
            <i>Contribution Reputation</i>
          </span>
        </div>

        <ul className="rep-profile__dims">
          {PROFILE_DIMS.map((d) => (
            <li key={d.name}>
              <span className="rep-profile__dname">{d.name}</span>
              <span className="rep-profile__dbar" aria-hidden="true">
                <i style={{ '--w': `${d.w}%` }} />
              </span>
              <span className="rep-profile__dval">{d.w}%</span>
            </li>
          ))}
        </ul>

        <div className="rep-profile__focus">
          <span>
            <b>12 Projects</b>
            <i>Builder</i>
          </span>
          <span>
            <b>27 Challenges</b>
            <i>Contributor</i>
          </span>
          <span>
            <b>42 Helps</b>
            <i>Mentor</i>
          </span>
        </div>

        <p className="rep-profile__note">Illustrative contribution profile</p>      </div>
    </div>
  )
}

function RepStory() {
  return (
    <div className="rep-card rep-card--story">
      <div className="rep-card__head">
        <h3>Your reputation story</h3>
        <span className="chip">Concept</span>
      </div>
      <ol className="rep-story">
        {STORY.map((s, i) => (
          <li className="rep-story__step" key={s}>
            <span className="rep-story__dot" aria-hidden="true" />
            <span className="rep-story__txt">{s}</span>
          </li>
        ))}
      </ol>
      <p className="rep-card__note">Reputation grows with the journey — not overnight.</p>
    </div>
  )
}

function RepFeed() {
  return (
    <div className="rep-card rep-card--feed">
      <div className="rep-card__head">
        <h3>Recent contributions</h3>
        <span className="chip">Concept</span>
      </div>
      {FEED.map((f) => {
        const Icon = f.icon
        return (
          <div className="rep-feed__row" key={f.action}>
            <span className="rep-feed__ico" aria-hidden="true">
              <Icon size={15} />
            </span>
            <span className="rep-feed__txt">
              <b>{f.action}</b>
              <i>{f.context}</i>
            </span>
            <span className="rep-feed__cat">{f.cat}</span>
          </div>
        )
      })}
      <p className="rep-card__note">What you did matters — illustrative activity.</p>
    </div>
  )
}

function RepLevels() {
  return (
    <div className="rep-levels-wrap">
      <div className="rep-block__title">
        <h3>Reputation levels</h3>
        <span className="rep-block__sub">Behaviour-based progression</span>
      </div>
      <div className="rep-levels" role="img" aria-label="AADI reputation levels: Member, Contributor, Builder, Mentor, Leader">
        {LEVELS.map((l, i) => {
          const Icon = l.icon
          return (
            <Fragment key={l.name}>
              <div className="rep-stage">
                <span className="rep-stage__n">{l.n}</span>
                <span className="rep-stage__icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <b className="rep-stage__name">{l.name}</b>
                <p className="rep-stage__desc">{l.desc}</p>
              </div>
              {i < LEVELS.length - 1 && (
                <span className="rep-stage__arrow" aria-hidden="true">
                  <ArrowRight size={15} />
                </span>
              )}
            </Fragment>
          )
        })}
      </div>
      <div className="rep-badges">
        {BADGES.map((b) => (
          <span className="rep-badge" key={b}>
            {b}
          </span>
        ))}
      </div>
      <p className="rep-card__note rep-badges__note">Contribution markers — illustrative model</p>
    </div>
  )
}

function RepCompare() {
  return (
    <div className="rep-compare-wrap">
      <div className="rep-block__title">
        <h3>Attention vs contribution</h3>
        <span className="rep-block__sub">
          Different platforms measure attention. <b className="text-kiwi">AADI measures participation.</b>
        </span>
      </div>
      <p className="rep-compare__ask">
        AADI doesn&rsquo;t ask <span className="text-kiwi">how many people follow you.</span>
        <br />
        AADI asks <b className="text-kiwi">what have you contributed.</b>
      </p>
      <div className="rep-compare">
        <div className="rep-compare__panel rep-compare__panel--social">
          <span className="rep-compare__tag">Traditional social</span>
          <ul>
            {SOCIAL.map((s) => (
              <li key={s}>
                <span className="rep-compare__x" aria-hidden="true">
                  ×
                </span>
                {s}
              </li>
            ))}
          </ul>
          <p className="rep-compare__sub">Measures attention</p>
        </div>
        <span className="rep-compare__arrow" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
        <div className="rep-compare__panel rep-compare__panel--aadi">
          <span className="rep-compare__tag">AADI</span>
          <ul>
            {AADI_ITEMS.map((s) => (
              <li key={s}>
                <span className="rep-compare__check" aria-hidden="true">
                  ✓
                </span>
                {s}
              </li>
            ))}
          </ul>
          <p className="rep-compare__sub">Measures participation</p>
        </div>
      </div>
    </div>
  )
}

function RepIdentity() {
  return (
    <div className="rep-identity-wrap">
      <div className="rep-block__title">
        <h3>From activity to identity</h3>
        <span className="rep-block__sub">Every contribution becomes part of your story</span>
      </div>
      <div
        className="rep-identity"
        role="img"
        aria-label="Your activity builds your AADI reputation, which strengthens your AADI ID and passport"
      >
        <div className="rep-ident__node">
          <span className="rep-ident__tag">Your activity</span>
          <div className="rep-ident__chips">
            {ACTIVITY.map((a) => (
              <span className="rep-ident__chip" key={a}>
                {a}
              </span>
            ))}
          </div>
        </div>
        <span className="rep-ident__arrow" aria-hidden="true">
          <ArrowRight size={16} />
        </span>
        <div className="rep-ident__node">
          <span className="rep-ident__tag">AADI reputation</span>
          <b className="rep-ident__main">Contribution record</b>
        </div>
        <span className="rep-ident__arrow" aria-hidden="true">
          <ArrowRight size={16} />
        </span>
        <div className="rep-ident__node rep-ident__node--accent">
          <span className="rep-ident__tag">AADI ID / Passport</span>
          <b className="rep-ident__main">Your evolving identity</b>
        </div>
      </div>
      <p className="rep-card__note rep-identity__note">
        Every meaningful contribution becomes part of your story.
      </p>
    </div>
  )
}

export default function Reputation() {
  return (
    <section className="sec sec--night sec--line reputation" id="reputation">
      <div className="container">
        <div className="rep-intro">
          <Reveal>
            <header className="rep-head">
              <p className="sec-kicker">
                Reputation <span className="chip chip--kiwi">Concept</span>
              </p>
              <h2 className="rep-title" id="reputation-title">
                Followers show attention.
                <span className="line">Reputation shows <em>what you do.</em></span>
              </h2>
              <p className="sec-lead rep-lead">
                Your reputation grows from meaningful contribution — projects, challenges,
                collaboration, mentoring, community and the things you help move forward.
              </p>
            </header>
          </Reveal>
          <Reveal delay={120}>
            <RepProfile />
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="rep-dims-wrap">
            <div className="rep-block__title">
              <h3>Contribution dimensions</h3>
              <span className="rep-block__sub">How reputation is built</span>
            </div>
            <div className="rep-dims">
              {DIMENSIONS.map((d) => {
                const Icon = d.icon
                return (
                  <div className="rep-dim" key={d.name}>
                    <span className="rep-dim__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <b className="rep-dim__name">{d.name}</b>
                    <p className="rep-dim__desc">{d.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        <div className="rep-journey">
          <Reveal delay={140}>
            <RepStory />
          </Reveal>
          <Reveal delay={200}>
            <RepFeed />
          </Reveal>
        </div>

        <Reveal delay={140}>
          <RepLevels />
        </Reveal>

        <Reveal delay={160}>
          <RepCompare />
        </Reveal>

        <Reveal delay={160}>
          <RepIdentity />
        </Reveal>

        <div className="rep-close">
          <Reveal delay={160}>
            <div className="rep-evolve">
              <span className="chip chip--kiwi rep-evolve__chip">Concept</span>
              <h3>Your reputation evolves.</h3>
              <p>
                You don&rsquo;t earn one reputation and stop. Every project, collaboration,
                contribution and new skill can change the story.
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <blockquote className="rep-quote">
              Don&rsquo;t build a follower count.
              <span className="line">Build a <em>body of work.</em></span>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
