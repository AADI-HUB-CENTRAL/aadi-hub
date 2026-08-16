import { useRef, useState } from 'react'
import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { Plus, Search } from './ui/Icons.jsx'

const CATEGORIES = [
  { key: 'about', n: '01', name: 'About AADI' },
  { key: 'identity', n: '02', name: 'Identity' },
  { key: 'community', n: '03', name: 'Community' },
  { key: 'building', n: '04', name: 'Building' },
  { key: 'opportunities', n: '05', name: 'Opportunities' },
  { key: 'access', n: '06', name: 'Early access' },
]

const FAQS = [
  {
    cat: 'about',
    q: 'What is AADI HUB?',
    a: 'AADI HUB is a digital ecosystem being built for the next generation — a place where young people can create an identity, find communities, build projects, take on challenges, connect with others and discover opportunities. Instead of keeping these experiences scattered across different platforms, AADI is designed to bring them together around one evolving identity.',
    status: 'CORE VISION',
  },
  {
    cat: 'about',
    q: 'Who can join AADI?',
    a: 'AADI is designed primarily for students and young people who want to learn, build, create, collaborate and discover opportunities. As the ecosystem grows, AADI is designed to connect students with creators, developers, mentors, communities, organizations and other people who can contribute to the journey.',
    status: 'EARLY ACCESS',
  },
  {
    cat: 'about',
    q: 'Is AADI only for college students?',
    a: 'No. AADI starts with students because that is where the need is strongest, but the long-term vision is broader. The ecosystem is being designed to support young people across schools, colleges, campuses, communities and different stages of their journey.',
    status: 'CORE VISION',
    rows: { today: 'Students', future: 'Broader youth ecosystem' },
  },
  {
    cat: 'identity',
    q: 'What is the AADI digital ID?',
    a: 'Your AADI ID is designed to become your identity inside the ecosystem. Instead of being just a username, it can connect your profile, skills, projects, communities, challenges, achievements, contributions and reputation in one place. Think of it as an identity that grows with what you do.',
    note: 'AADI ID is a platform identity, not a government-issued identification document.',
    status: 'IN DEVELOPMENT',
  },
  {
    cat: 'identity',
    q: 'How does the QR profile work?',
    a: 'Each member can have a QR connected to their public AADI profile. When someone scans it, they can discover the member’s public profile and the work they choose to showcase. The goal is to make your AADI identity easy to share in real-world situations — events, projects, campuses and collaborations.',
    status: 'IN DEVELOPMENT',
  },
  {
    cat: 'identity',
    q: 'What is the AADI Passport?',
    a: 'AADI Passport is the concept of a deeper record of your journey across AADI. While your AADI ID identifies you, the Passport is designed to tell your story — the communities you’ve joined, projects you’ve built, challenges you’ve completed, contributions you’ve made and experiences you’ve collected.',
    note: 'Passport features will evolve as the platform develops.',
    status: 'COMING NEXT',
  },
  {
    cat: 'community',
    q: 'Can I create communities?',
    a: 'Yes — community creation is part of the AADI vision. Members will be able to create or contribute to communities around interests, skills, campuses, cultures and goals. During early access, community features may be introduced progressively as AADI develops.',
    status: 'IN DEVELOPMENT',
  },
  {
    cat: 'building',
    q: 'Can I build projects with other members?',
    a: 'That’s one of the core ideas behind AADI. Members should be able to discover people based on skills, interests and goals, form teams, find open roles and build projects together. The goal is to turn “I have an idea” into “we built it.”',
    status: 'CORE VISION',
  },
  {
    cat: 'opportunities',
    q: 'How does AADI reputation work?',
    a: 'AADI reputation is designed around contribution rather than follower counts. Building projects, completing challenges, helping others, mentoring, collaborating, contributing to communities and leading initiatives can all become part of your reputation. The exact reputation system will evolve as AADI is tested with real members.',
    status: 'IN DEVELOPMENT',
  },
  {
    cat: 'opportunities',
    q: 'Will AADI have internships and opportunities?',
    a: 'Opportunities are part of the long-term AADI vision. These may include internships, hackathons, scholarships, mentorships, competitions, freelance projects, startup opportunities and other experiences. AADI will make these opportunities easier to discover, but it will not guarantee placements or selection.',
    status: 'COMING NEXT',
  },
  {
    cat: 'access',
    q: 'Is AADI free?',
    a: 'Joining the AADI community is intended to be free. Some future features, programs or services may evolve as the ecosystem grows, but the core goal is to keep participation accessible to young people.',
    status: 'EARLY ACCESS',
  },
  {
    cat: 'access',
    q: 'When is AADI launching?',
    a: 'AADI is currently being developed and shaped through its early-access phase. Features will be introduced progressively rather than pretending everything is already live. Early members will have the opportunity to experience the ecosystem as it develops and help influence what gets built next.',
    status: 'EARLY ACCESS',
    cta: { label: 'Join early', href: '#join' },
  },
]

const QUICK_CHIPS = [
  { label: 'What is AADI?', index: 0 },
  { label: 'Who can join?', index: 1 },
  { label: 'AADI ID', index: 3 },
  { label: 'Communities', index: 6 },
  { label: 'Projects', index: 7 },
  { label: 'Opportunities', index: 9 },
]

const IS_LIST = [
  'A youth ecosystem',
  'A place to build',
  'A community layer',
  'A growing digital identity',
  'A way to discover opportunities',
]

const ISNT_LIST = [
  'Just another social feed',
  'Just a certificate platform',
  'A replacement for college',
  'A follower-count competition',
  'A guaranteed placement service',
]

export default function Faq() {
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')
  const listRef = useRef(null)
  const itemRefs = useRef([])

  const catName = (key) => CATEGORIES.find((c) => c.key === key).name.toLowerCase()

  const q = query.trim().toLowerCase()
  const visible = FAQS.map((f, i) => ({ ...f, i })).filter((f) => {
    if (!q) return true
    return (
      f.q.toLowerCase().includes(q) ||
      f.a.toLowerCase().includes(q) ||
      catName(f.cat).includes(q) ||
      (f.note || '').toLowerCase().includes(q) ||
      (f.status || '').toLowerCase().includes(q)
    )
  })

  const toggle = (i) => setOpen((cur) => (cur === i ? null : i))

  const openItem = (i) => {
    setQuery('')
    setOpen(i)
    requestAnimationFrame(() => {
      itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const scrollToCategory = (key) => {
    const idx = FAQS.findIndex((f) => f.cat === key)
    if (idx >= 0) openItem(idx)
  }

  const onAccordionKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const btns = Array.from(listRef.current.querySelectorAll('.faq-q'))
    const cur = btns.findIndex((b) => b === document.activeElement)
    if (cur < 0) return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? (cur + 1) % btns.length : (cur - 1 + btns.length) % btns.length
    btns[next].focus()
  }

  return (
    <section className="sec sec--night sec--line" id="faq">
      <div className="container">
        <div className="faq__grid">
          <div className="faq__intro">
            <p className="faq-status-line">
              <span className="faq-status-line__dot" aria-hidden="true"></span>
              Building in public
            </p>

            <SectionHeader
              kicker="FAQ · AADI HUB"
              title={
                <>
                  Questions. Answers.
                  <span className="line"><em>No fluff.</em></span>
                </>
              }
              lead="Everything you probably want to know before joining AADI — what it is, who it's for, what's being built, and what comes next."
            />

            <div className="faq-search">
              <label className="faq-search__label" htmlFor="faq-search">Search your question</label>
              <div className="faq-search__box">
                <Search size={17} className="faq-search__icon" aria-hidden="true" />
                <input
                  id="faq-search"
                  className="faq-search__input"
                  type="search"
                  placeholder="Search your question…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="faq-chips">
              <span className="faq-chips__label">Common questions</span>
              <div className="faq-chips__row">
                {QUICK_CHIPS.map((c) => (
                  <button key={c.label} type="button" className="faq-chip" onClick={() => openItem(c.index)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <Reveal delay={160}>
              <nav className="faq-nav" aria-label="FAQ categories">
                <div className="faq-nav__head">
                  <span className="faq-nav__brand">AADI HUB</span>
                  <p className="faq-nav__line">
                    Your questions,<br />
                    clear answers.
                  </p>
                </div>
                <ul className="faq-nav__cats">
                  {CATEGORIES.map((c) => (
                    <li key={c.key}>
                      <button type="button" className="faq-nav__cat" onClick={() => scrollToCategory(c.key)}>
                        <span className="faq-nav__num">{c.n}</span>
                        <span className="faq-nav__name">{c.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          </div>

          <div className="faq__panel" ref={listRef} onKeyDown={onAccordionKeyDown}>
            {visible.length === 0 ? (
              <div className="faq-empty" role="status">
                <p className="faq-empty__title">No answer found for that yet.</p>
                <p className="faq-empty__sub">Try another question.</p>
              </div>
            ) : (
              visible.map((f) => {
                const isOpen = open === f.i
                const cat = CATEGORIES.find((c) => c.key === f.cat)
                return (
                  <div key={f.q} data-cat={f.cat} className={`faq-item${isOpen ? ' is-open' : ''}`} ref={(el) => (itemRefs.current[f.i] = el)}>
                    <h3>
                      <button
                        className="faq-q"
                        onClick={() => toggle(f.i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${f.i}`}
                        id={`faq-q-${f.i}`}
                      >
                        <span className="faq-q__num">{cat.n}</span>
                        <span className="faq-q__text">{f.q}</span>
                        <span className="faq-q__icon" aria-hidden="true">
                          <Plus size={15} />
                        </span>
                      </button>
                    </h3>
                    <div className="faq-a" id={`faq-a-${f.i}`} role="region" aria-labelledby={`faq-q-${f.i}`}>
                      <div className="faq-a__wrap">
                        <div className="faq-a__in">
                        <span className={`faq-status${f.status === 'CORE VISION' || f.status === 'IN DEVELOPMENT' ? ' faq-status--kiwi' : ''}`}>
                          {f.status}
                        </span>
                        <p>{f.a}</p>
                        {f.rows && (
                          <div className="faq-rows">
                            <div className="faq-row">
                              <span className="faq-row__k">Today</span>
                              <span>{f.rows.today}</span>
                            </div>
                            <div className="faq-row">
                              <span className="faq-row__k">Future</span>
                              <span>{f.rows.future}</span>
                            </div>
                          </div>
                        )}
                        {f.note && <p className="faq-note">{f.note}</p>}
                        {f.cta && (
                          <div className="faq-cta">
                            <Button href={f.cta.href} variant="primary" size="sm" arrow>
                              {f.cta.label}
                            </Button>
                          </div>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <Reveal>
          <div className="faq-compare">
            <div className="faq-compare__col">
              <h4 className="faq-compare__title faq-compare__title--is">What AADI is</h4>
              <ul>
                {IS_LIST.map((x) => (
                  <li key={x}>
                    <span className="faq-compare__mark faq-compare__mark--yes" aria-hidden="true">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="faq-compare__col">
              <h4 className="faq-compare__title faq-compare__title--isnt">What AADI isn’t</h4>
              <ul>
                {ISNT_LIST.map((x) => (
                  <li key={x}>
                    <span className="faq-compare__mark faq-compare__mark--no" aria-hidden="true">×</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="faq-curious">
            <div>
              <h3 className="faq-curious__title">Still curious?</h3>
              <p className="faq-curious__text">
                AADI is being built in the open. If your question isn’t here, come talk to us.
              </p>
            </div>
            <div className="btn-row faq-curious__btns">
              <Button href="#join" variant="primary" size="md" arrow>
                Join AADI
              </Button>
              <Button href="#vision" variant="secondary" size="md" arrow>
                Explore the vision
              </Button>
            </div>
          </div>
        </Reveal>

        <p className="faq-trust">
          Some AADI features shown across this website are product concepts currently being developed.
          <br />
          <span>We’d rather show you where we’re going than pretend everything is already live.</span>
        </p>
      </div>
    </section>
  )
}
