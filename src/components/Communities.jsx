import { useState } from 'react'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { ArrowUpRight } from './ui/Icons.jsx'

const COMMUNITIES = [
  {
    name: 'AI Builders',
    category: 'Tech',
    initials: 'AI',
    description: 'Build with AI, agents and open-source tools.',
    tags: ['Tech'],
    activity: [
      { label: 'Trending', value: 'Open-source fine-tuning' },
      { label: 'Next', value: '30-Minute Build' },
    ],
    featured: {
      tagline: 'Build what comes next.',
      blurb:
        'A space for students experimenting with AI, agents, automation and open-source tools.',
    },
  },
  {
    name: 'Data Science',
    category: 'Tech',
    initials: 'DS',
    description: 'Datasets, analysis, ML and real-world problems.',
    tags: ['Tech'],
    activity: [{ label: 'Discussing', value: 'Best AI tools for students' }],
  },
  {
    name: 'Developers',
    category: 'Tech',
    initials: 'DEV',
    description: 'Code, collaborate and ship useful things.',
    tags: ['Tech'],
    activity: [{ label: 'Building', value: 'Campus AI assistant' }],
  },
  {
    name: 'Designers',
    category: 'Creative',
    initials: 'UX',
    description: 'UI, UX, visual systems and creative experiments.',
    tags: ['Creative'],
    activity: [
      { label: 'Trending', value: 'Portfolio reviews' },
      { label: 'Next', value: 'Design Battle · Sat' },
    ],
  },
  {
    name: 'Creators',
    category: 'Creative',
    initials: 'CR',
    description: 'Video, storytelling, editing and digital media.',
    tags: ['Creative'],
    activity: [{ label: 'This Week', value: 'Creator challenge' }],
  },
  {
    name: 'Entrepreneurs',
    category: 'Business',
    initials: 'EN',
    description: 'Ideas, startups, pitching and building.',
    tags: ['Business'],
    activity: [{ label: 'Next', value: 'Student pitch night' }],
  },
  {
    name: 'Gaming',
    category: 'Campus',
    initials: 'GM',
    description: 'Players, creators, tournaments and campus gaming.',
    tags: ['Campus', 'Lifestyle'],
    activity: [
      { label: 'Next', value: 'Weekend campus lobby' },
      { label: 'Trending', value: 'Campus tournaments' },
    ],
  },
  {
    name: 'Photography',
    category: 'Creative',
    initials: 'PH',
    description: 'Photography, visual storytelling and creative walks.',
    tags: ['Creative', 'Lifestyle'],
    activity: [{ label: 'This Week', value: 'Golden-hour photo walk' }],
  },
  {
    name: 'Finance',
    category: 'Business',
    initials: 'FI',
    description: 'Money basics, careers, markets and financial literacy.',
    tags: ['Business'],
    activity: [{ label: 'Discussing', value: 'Money basics & careers' }],
  },
  {
    name: 'Japan Community',
    category: 'Culture',
    initials: 'JP',
    description: 'Language, culture, travel and Japan-focused learning.',
    tags: ['Culture', 'Campus'],
    activity: [
      { label: 'Next', value: 'Language exchange' },
      { label: 'Trending', value: 'Travel & culture' },
    ],
  },
  {
    name: 'Sports',
    category: 'Lifestyle',
    initials: 'SP',
    description: 'Fitness, sports communities and campus activities.',
    tags: ['Lifestyle', 'Campus'],
    activity: [{ label: 'This Week', value: 'Fitness streak' }],
  },
  {
    name: 'Music',
    category: 'Culture',
    initials: 'MU',
    description: 'Artists, listeners, production and music culture.',
    tags: ['Culture', 'Creative'],
    activity: [
      { label: 'Next', value: 'Open mic night' },
      { label: 'Trending', value: 'Fresh track drops' },
    ],
  },
]

const FILTERS = ['All', 'Tech', 'Creative', 'Business', 'Campus', 'Culture', 'Lifestyle']

function CommunityCard({ community, decorative = false }) {
  const Tag = decorative ? 'div' : 'a'
  const cardProps = decorative
    ? { 'aria-hidden': true }
    : { href: '#join', tabIndex: 0 }
  return (
    <Tag className="community-card" {...cardProps}>
      <div className="community-card__top">
        <span className="community-card__mono">{community.initials}</span>
        <span className="community-card__cat">Community · Concept</span>
        <span className="community-card__arrow" aria-hidden="true">
          <ArrowUpRight size={15} />
        </span>
      </div>
      <h3 className="community-card__title">{community.name}</h3>
      <p className="community-card__desc">{community.description}</p>
      <div className="community-card__meta">
        {community.activity.map((a) => (
          <div className="community-card__meta-row" key={a.label}>
            <span className="community-card__meta-label">{a.label}</span>
            <b className="community-card__meta-value">{a.value}</b>
          </div>
        ))}
      </div>
    </Tag>
  )
}

function CommunityRail({ communities, direction = 'left', marquee = false }) {
  const railCls = `community-rail${direction === 'right' ? ' community-rail--right' : ''}${
    marquee ? '' : ' community-rail--static'
  }`
  return (
    <div className={railCls}>
      <div className="community-rail__track">
        <div className="community-rail__group">
          {communities.map((c) => (
            <CommunityCard key={c.name} community={c} />
          ))}
        </div>
        {marquee && (
          <div className="community-rail__group">
            {communities.map((c) => (
              <CommunityCard key={`${c.name}--dup`} community={c} decorative />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FeaturedCommunity() {
  const c = COMMUNITIES[0]
  return (
    <aside className="community__featured">
      <div className="community__featured-card">
        <div>
          <span className="community__featured-kicker">Featured Community</span>
          <h3 className="community__featured-title">{c.name}</h3>
          <p className="community__featured-tagline">{c.featured.tagline}</p>
          <p className="community__featured-desc">{c.featured.blurb}</p>
        </div>
        <div>
          <div className="community__featured-meta">
            {c.activity.map((a) => (
              <div className="community__featured-meta-row" key={a.label}>
                <span className="community__featured-meta-label">{a.label}</span>
                <b className="community__featured-meta-value">{a.value}</b>
              </div>
            ))}
          </div>
          <div className="community__featured-cta">
            <Button href="#join" variant="primary" size="md" arrow>
              Explore Community
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Communities() {
  const [activeFilter, setActiveFilter] = useState('All')
  const isMarquee = activeFilter === 'All'

  let rowOne
  let rowTwo
  if (isMarquee) {
    rowOne = COMMUNITIES.slice(0, 6)
    rowTwo = COMMUNITIES.slice(6, 12)
  } else {
    const filtered = COMMUNITIES.filter((c) => c.tags.includes(activeFilter))
    rowOne = filtered.filter((_, i) => i % 2 === 0)
    rowTwo = filtered.filter((_, i) => i % 2 === 1)
  }

  return (
    <section
      className="sec sec--paper sec--line community"
      id="community"
      aria-labelledby="community-title"
    >
      <div className="container">
        <Reveal>
          <header className="community__head">
            <div>
              <p className="community__eyebrow">
                Communities <span className="community__eyebrow-div">·</span> Concept Preview
              </p>
              <h2 className="community__title" id="community-title">
                Find your <span className="community__title-accent">people.</span>
              </h2>
            </div>
            <div>
              <p className="community__lead">
                Communities built around interests, skills, campuses, cultures and goals — a place
                to learn, share and do things together.
              </p>
              <p className="community__tagline">
                Join a conversation. Find a crew.{' '}
                <span className="community__title-accent">Build something together.</span>
              </p>
            </div>
          </header>
        </Reveal>

        <Reveal delay={100}>
          <div className="community__toolbar">
            <div className="community__filters" role="group" aria-label="Filter communities by category">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`community__filter${activeFilter === f ? ' is-active' : ''}`}
                  aria-pressed={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="community__path" aria-hidden="true">
              <span className="community__path-step">Your interests</span>
              <span className="community__path-sep" aria-hidden="true">
                →
              </span>
              <span className="community__path-step">Your community</span>
              <span className="community__path-sep" aria-hidden="true">
                →
              </span>
              <span className="community__path-step community__path-step--accent">Your people</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="community__grid">
            <div className="community__rails">
              <CommunityRail communities={rowOne} direction="left" marquee={isMarquee} />
              <CommunityRail communities={rowTwo} direction="right" marquee={isMarquee} />
            </div>
            <FeaturedCommunity />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="community__cta">
            <div className="community__cta-btns">
              <Button href="#join" variant="primary" size="lg" arrow>
                Explore Communities
              </Button>
              <Button href="#join" variant="light" size="lg" arrow>
                Find My People
              </Button>
            </div>
            <p className="community__disclaimer">
              Community listings are illustrative previews, not live data.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
