import { Link } from 'react-router-dom'
import { ProductLogo, Button } from '../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Landing — a single, purposeful page: who this is for, what you can do,
   and how to get in. No showcase sections, no fake stats, no dead links.
--------------------------------------------------------------------------- */

const PILLARS = [
  {
    title: 'Connect',
    body: 'Find students who build what you build. Message through projects, not cold DMs.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>,
  },
  {
    title: 'Build',
    body: 'Create projects, declare the roles you need, and approve teammates who ask to join.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M15 9l-6 6" /><path d="M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z" /></svg>,
  },
  {
    title: 'Learn',
    body: 'Track real skills and levels on a profile you own — shareable as one permanent AADI ID.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l10-3 10 3-10 3z" /><path d="M6 8.5V14c0 1.7 2.7 3 6 3s6-1.3 6-3V8.5" /></svg>,
  },
  {
    title: 'Compete',
    body: 'Discover internships, hackathons and events — reviewed before they appear on the hub.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6" /><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" /></svg>,
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Create your AADI identity',
    body: 'Sign up and complete a guided setup — education, skills, interests and how you want to collaborate.',
  },
  {
    n: '02',
    title: 'Start or join projects',
    body: 'Post what you are building with the roles you need. Students request to join; you approve.',
  },
  {
    n: '03',
    title: 'Find real opportunities',
    body: 'Browse verified internships, hackathons and events. Save the ones that matter to you.',
  },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="p-container landing__nav-inner">
          <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={26} size={18} /></Link>
          <nav className="landing__nav-links" aria-label="Primary">
            <a href="#pillars">What you get</a>
            <a href="#how">How it works</a>
            <Link to="/form">Early access</Link>
          </nav>
          <div className="landing__nav-actions">
            <Link to="/login" className="p-btn p-btn--ghost p-btn--sm">Log in</Link>
            <Link to="/register" className="p-btn p-btn--primary p-btn--sm">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="landing__hero">
          <div className="p-container">
            <p className="landing__eyebrow">Connect &bull; Build &bull; Learn &bull; Compete</p>
            <h1 className="landing__title">
              The student startup platform where <em>ideas become teams</em>.
            </h1>
            <p className="landing__lead">
              AADI HUB gives every student a permanent identity, a place to build projects with
              real teammates, and a hub of reviewed opportunities — all in one account.
            </p>
            <div className="landing__cta">
              <Link to="/register"><Button size="lg">Create your free account</Button></Link>
              <Link to="/login"><Button size="lg" variant="secondary">I already have an account</Button></Link>
            </div>
          </div>
        </section>

        <section id="pillars">
          <div className="p-container">
            <div className="landing__pillars">
              {PILLARS.map(p => (
                <article className="landing__pillar" key={p.title}>
                  <div className="landing__pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="landing__section">
          <div className="p-container">
            <div className="landing__section-head">
              <h2>How it works</h2>
              <p>Three steps from sign-up to your first collaboration.</p>
            </div>
            <div className="landing__steps">
              {STEPS.map(s => (
                <article className="landing__step" key={s.n}>
                  <div className="landing__step-num">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing__final">
          <div className="p-container">
            <h2>Built for students who ship.</h2>
            <p>Claim your permanent AADI ID and set up your student profile in minutes.</p>
            <Link to="/register"><Button size="lg">Get started</Button></Link>
          </div>
        </section>
      </main>

      <footer className="landing__footer">
        <div className="p-container landing__footer-inner">
          <div>
            <ProductLogo symbol={22} size={15} />
            <p className="landing__footer-copy" style={{ marginTop: 10 }}>
              &copy; {new Date().getFullYear()} AADI HUB. Built for Indian students.
            </p>
          </div>
          <div className="landing__footer-links">
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
            <Link to="/form">Early access</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
