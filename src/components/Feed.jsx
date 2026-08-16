import { useState, useEffect, useRef, useCallback } from 'react'
import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Avatar from './ui/Avatar.jsx'
import FeedArt from './FeedArt.jsx'
import { Heart, Message, Share, Bookmark, Zap, TrendingUp, LinkIcon, Rocket } from './ui/Icons.jsx'

const FEED_POSTS = [
  {
    id: 'aarav',
    type: 'PROJECT',
    name: 'Aarav Mehta',
    role: 'AI Builder',
    level: 'Level 14',
    time: '2h ago',
    title: 'AI Study Assistant',
    body: 'I just launched my first AI project. It turns messy study notes into summaries, quizzes and revision cards.',
    tags: ['#AI', '#BuildInPublic', '#StudentProject'],
  },
  {
    id: 'sanya',
    type: 'LOOKING FOR',
    name: 'Sanya Rao',
    role: 'Founder · Engineering',
    level: 'Level 9',
    time: '4h ago',
    title: 'UI Designer',
    body: 'Three developers, one student startup idea. Looking for someone who loves clean interfaces and wants to build with us.',
    tags: ['#LookingFor', '#Startup', '#Team'],
  },
  {
    id: 'diya',
    type: 'CHALLENGE',
    name: 'Diya Sharma',
    role: 'Python',
    level: 'Level 12',
    time: '1d ago',
    title: '30-Day Python Challenge',
    body: '30 days. 30 small projects. Zero skipped days.',
    tags: ['#Challenge', '#Python', '#30Days'],
  },
  {
    id: 'kunal',
    type: 'ACHIEVEMENT',
    name: 'Kunal Gupta',
    role: 'Campus Crew',
    level: 'Level 10',
    time: '1d ago',
    title: 'Campus Build Battle',
    body: 'Built an AR campus tour in 90 minutes with my team.',
    tags: ['#CampusBattle', '#Winner', '#BuildTogether'],
  },
  {
    id: 'riya',
    type: 'LEARNING',
    name: 'Riya Verma',
    role: 'Hacker',
    level: 'Level 9',
    time: '2d ago',
    title: 'Hackathon Lesson',
    body: 'Scope small. Ask questions. Find teammates who challenge your thinking.',
    tags: ['#Hackathon', '#Lessons', '#Growth'],
  },
]

const FLOW = [
  { icon: Zap, num: '01', title: 'Build', text: 'Do the work that matters.' },
  { icon: TrendingUp, num: '02', title: 'Share', text: 'Show progress, not just status.' },
  { icon: LinkIcon, num: '03', title: 'Connect', text: 'Find people building with you.' },
  { icon: Rocket, num: '04', title: 'Grow', text: 'Turn activity into a living portfolio.' },
]

const ACTIONS = [
  { icon: Heart, label: 'Like' },
  { icon: Message, label: 'Comment' },
  { icon: Share, label: 'Share' },
  { icon: Bookmark, label: 'Save' },
]

const AUTOPLAY_MS = 2000
const SWIPE_THRESHOLD = 45

function ArrowIcon({ dir }) {
  return (
    <svg
      className={`feed-arrow__svg feed-arrow__svg--${dir}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function FeedCard({ post, role }) {
  const isActive = role === 'active'
  const cls = `feed-card${isActive ? ' is-active' : ''}${role === 'prev' ? ' is-prev' : ''}${role === 'next' ? ' is-next' : ''}`

  return (
    <article
      className={cls}
      inert={isActive ? undefined : true}
      aria-label={`${post.type} — ${post.title}`}
    >
      <header className="feed-card__head">
        <Avatar name={post.name} size={44} />
        <div className="feed-card__who">
          <div className="feed-card__name">{post.name}</div>
          <div className="feed-card__meta">
            {post.role} · {post.level} · {post.time}
          </div>
        </div>
        <span className="feed-card__hub">AADI HUB</span>
      </header>

      <div className="feed-card__art">
        <FeedArt id={post.id} />
      </div>

      <span className="feed-card__type">{post.type}</span>
      <h3 className="feed-card__title">{post.title}</h3>
      <p className="feed-card__body">{post.body}</p>

      <div className="feed-card__tags">
        {post.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <footer className="feed-card__actions">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <button type="button" className="feed-card__action" aria-label={a.label} key={a.label}>
              <Icon size={15} />
              <span>{a.label}</span>
            </button>
          )
        })}
      </footer>
    </article>
  )
}

function FeedCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const startX = useRef(null)

  const go = useCallback((dir) => {
    setIndex((i) => (i + dir + FEED_POSTS.length) % FEED_POSTS.length)
  }, [])

  useEffect(() => {
    if (paused || reduced) return
    const id = setInterval(() => go(1), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, reduced, go, index])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const onPointerDown = (e) => {
    startX.current = e.clientX
  }

  const onPointerUp = (e) => {
    if (startX.current == null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1)
  }

  const onPointerCancel = () => {
    startX.current = null
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  const onBlurCapture = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
  }

  const count = FEED_POSTS.length

  return (
    <div
      className="feed-car"
      role="region"
      aria-roledescription="carousel"
      aria-label="Concept feed preview"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={onBlurCapture}
      onKeyDown={onKeyDown}
    >
      <div
        className="feed-car__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {FEED_POSTS.map((p, i) => {
          const diff = (i - index + count) % count
          const role =
            diff === 0 ? 'active' : diff === 1 ? 'next' : diff === count - 1 ? 'prev' : 'hidden'
          return <FeedCard key={p.id} post={p} role={role} />
        })}
      </div>

      <span className="sr-only" aria-live="polite">
        Post {index + 1} of {count}
      </span>

      <div className="feed-car__controls">
        <button type="button" className="feed-arrow" aria-label="Previous post" onClick={() => go(-1)}>
          <ArrowIcon dir="prev" />
        </button>
        <div className="feed-dots">
          {FEED_POSTS.map((p, i) => (
            <button
              type="button"
              key={p.id}
              className={`feed-dot${i === index ? ' is-active' : ''}`}
              aria-label={`Show post ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className="feed-arrow" aria-label="Next post" onClick={() => go(1)}>
          <ArrowIcon dir="next" />
        </button>
      </div>
    </div>
  )
}

export default function Feed() {
  return (
    <section className="sec sec--night sec--line sec--compact" id="feed">
      <div className="container feed__grid">
        <div className="feed__copy">
          <SectionHeader
            kicker="The social feed"
            tag="Concept preview"
            title={
              <>
                Share what you’re <em>building.</em>
              </>
            }
            lead="A social feed designed around meaningful student activity — projects, challenges, learnings, collaborations and ideas."
          />
          <Reveal delay={140}>
            <p className="feed__note">
              Your feed becomes a record of <b>what you actually do.</b>
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="feed__flow">
              {FLOW.map((f) => {
                const Icon = f.icon
                return (
                  <div className="feed__step" key={f.num}>
                    <span className="feed__step__num">{f.num}</span>
                    <b>
                      <span className="feed__step__icon">
                        <Icon size={14} />
                      </span>
                      {f.title}
                    </b>
                    <span className="feed__step__text">{f.text}</span>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={160}>
          <FeedCarousel />
        </Reveal>
      </div>
    </section>
  )
}
