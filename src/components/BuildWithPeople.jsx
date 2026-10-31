import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import {
  ArrowDown,
  TrendingUp,
  Target,
  Users,
  Award,
  Lightbulb,
  Search,
  Code,
  Share,
} from './ui/Icons.jsx'

const STEPS = [
  { n: '01', icon: Lightbulb, t: 'Idea', d: 'Turn a thought into something worth building.' },
  { n: '02', icon: Search, t: 'Find', d: 'Discover people with complementary skills.' },
  { n: '03', icon: Code, t: 'Build', d: 'Work together and turn the idea into a project.' },
  { n: '04', icon: Share, t: 'Share', d: 'Show your progress and what you learned.' },
  { n: '05', icon: TrendingUp, t: 'Grow', d: 'Turn the work into experience, reputation and future opportunities.' },
]

const DIFFS = [
  { n: '01', icon: Target, t: 'Match by ability', d: 'Find teammates based on skills, interests and goals - not follower counts.' },
  { n: '02', icon: Users, t: 'Build together', d: 'Turn conversations and ideas into structured projects.' },
  { n: '03', icon: Award, t: 'Turn work into proof', d: 'Projects, contributions and collaboration become part of your evolving AADI identity.' },
]

export default function BuildWithPeople() {
  return (
    <section
      className="sec sec--paper sec--line projects"
      id="build-with-people"
      aria-labelledby="build-with-people-title"
    >
      <div className="container">
        <header className="build-head">
          <p className="sec-kicker">
            Build with people <span className="chip chip--light">Concept</span>
          </p>
          <h2 className="sec-title build-head__title" id="build-with-people-title">
            The next great project might start with <em>the right person.</em>
          </h2>
          <p className="sec-lead build-head__lead">
            AADI connects ideas with people who have the skills, interests and ambition to build
            them together.
          </p>
        </header>

        <Reveal delay={100}>
          <ol className="build-steps" aria-label="The AADI journey">
            {STEPS.map((s) => {
              const Icon = s.icon
              return (
                <li className="build-step" key={s.n}>
                  <span className="build-step__head">
                    <span className="build-step__num" aria-hidden="true">{s.n}</span>
                    <span className="build-step__icon"><Icon size={17} /></span>
                    <h4>{s.t}</h4>
                  </span>
                  <p>{s.d}</p>
                </li>
              )
            })}
          </ol>
        </Reveal>

        <Reveal delay={140}>
          <div className="diff-grid">
            {DIFFS.map((d) => {
              const Icon = d.icon
              return (
                <div className="card card--light diff-card" key={d.n}>
                  <span className="diff-card__head">
                    <span className="diff-card__num" aria-hidden="true">{d.n}</span>
                    <span className="diff-card__icon"><Icon size={17} /></span>
                    <h4>{d.t}</h4>
                  </span>
                  <p>{d.d}</p>
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="id-link" role="figure" aria-label="How projects connect to your AADI profile">
            <div className="id-link__box">
              <span className="id-link__kicker">Project</span>
              <b>AI Study Assistant</b>
            </div>
            <span className="id-link__arrow" aria-hidden="true"><ArrowDown size={16} /></span>
            <div className="id-link__box is-accent">
              <span className="id-link__kicker">AADI Profile</span>
              <b className="id-link__gains">
                + Project <i>/</i> + Collaboration <i>/</i> + Skills <i>/</i> + Contribution
              </b>
            </div>
            <p className="id-link__caption">
              Everything you build can become part of your journey.
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="idea-cta">
            <span className="idea-cta__kicker">Have an idea?</span>
            <h3 className="idea-cta__title">
              Start with the idea. <em>Find the people.</em> Build what comes next.
            </h3>
            <div className="idea-cta__row">
              <Button href="/#join" variant="primary" size="lg" arrow>
                Start a project
              </Button>
            </div>
            <p className="idea-cta__note">Concept preview - AADI is currently in early access.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
