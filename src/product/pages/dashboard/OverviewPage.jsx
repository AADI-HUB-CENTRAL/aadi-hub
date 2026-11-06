import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { profileToIdentity } from '../../../features/profile/adapters.js'
import { getProfileCompletion } from '../../../utils/identity.js'
import { listMyProjects, listMyJoinRequests } from '../../../features/projects/projectsApi.js'
import {
  listOpportunities, listMySubmissions, listMyBookmarks, opportunityTypeLabel,
} from '../../../features/opportunities/opportunitiesApi.js'
import { Spinner } from '../../ui/kit.jsx'
import {
  ArrowRight, ArrowUpRight, Bookmark, Briefcase, Calendar, Check, Clock,
  Compass, Graduation, Layers, Lightbulb, Rocket, Target, Trophy, Users,
} from '../../ui/icons.jsx'
import WelcomeVisual from './WelcomeVisual.jsx'
import '../../styles/overview.css'

/* ---------------------------------------------------------------------------
   Overview - the student's home screen.

   Everything on this page comes from Supabase. Nothing is invented: no
   demo records, no placeholder notifications, no statistics that the
   database cannot back. Sections that have no real data render a short,
   honest empty state instead of filler.

   Information hierarchy (one purpose per section):
     1. Welcome + cinematic identity visual
     2. Workspace summary (real counts only, one compact strip)
     3. Your projects (real previews or a single first-project action)
     4. Discover opportunities (published listings, typed and tagged)
     5. Recent activity (real records, real timestamps)
     6. AADI identity preview (ID, credentials, completion, one action)
   --------------------------------------------------------------------------- */

const INTEREST_STOPWORDS = new Set(['and', 'the', 'of', 'for', 'with', 'other', 'misc'])

/** Search tokens derived from the student's stored interests. */
function interestTokens(interests) {
  const out = new Set()
  for (const raw of interests || []) {
    const full = String(raw).toLowerCase().trim()
    if (full.length >= 3) out.add(full)
    for (const word of full.split(/[^a-z0-9+#]+/)) {
      if (word.length >= 3 && !INTEREST_STOPWORDS.has(word)) out.add(word)
    }
  }
  return [...out]
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function firstName(name = '') {
  return String(name).split(/\s+/).filter(Boolean)[0] || ''
}

function fmtDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '' }
}

/** Dot-separated meta line. The separator is drawn in CSS, not with glyphs. */
function MetaRow({ items, className = '' }) {
  const parts = items.filter(Boolean)
  if (parts.length === 0) return null
  return (
    <p className={`ov-meta ${className}`.trim()}>
      {parts.map((part, i) => (
        <span key={i} className="ov-meta__item">{part}</span>
      ))}
    </p>
  )
}

/** "remote" -> "Remote" */
function label(value) {
  if (!value) return ''
  const s = String(value)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** "in_progress" -> "In progress" */
function statusLabel(value) {
  const s = String(value || 'planning').replace(/_/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** A small vector marker for each published opportunity type. */
function OpportunityTypeIcon({ type }) {
  if (type === 'internship' || type === 'job') return <Briefcase size={16} />
  if (type === 'hackathon') return <Trophy size={16} />
  if (type === 'scholarship' || type === 'research') return <Graduation size={16} />
  if (type === 'workshop') return <Target size={16} />
  if (type === 'event') return <Calendar size={16} />
  if (type === 'other') return <Lightbulb size={16} />
  return <Compass size={16} />
}

/** Activity markers, one per genuine event kind. */
function ActivityIcon({ kind }) {
  if (kind === 'project') return <Rocket size={12} />
  if (kind === 'join') return <Users size={12} />
  return <ArrowUpRight size={12} />
}

/** Compact geometric mark for the first-project empty state. */
function FirstProjectArt() {
  return (
    <svg className="ov-firstbuild__art" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect x="4" y="18" width="24" height="20" rx="4" stroke="currentColor" strokeOpacity="0.28" />
      <rect x="14" y="12" width="24" height="20" rx="4" stroke="currentColor" strokeOpacity="0.55" />
      <rect x="24" y="6" width="24" height="20" rx="4" stroke="currentColor" />
      <path d="M31 16h10" stroke="currentColor" strokeLinecap="round" />
      <circle cx="41" cy="42" r="2" fill="currentColor" />
      <path d="M9 9h6M12 6v6" stroke="currentColor" strokeOpacity="0.4" strokeLinecap="round" />
    </svg>
  )
}


export default function OverviewPage() {
  const { user, profile, profileStatus } = useAuth()
  const identity = profileToIdentity(profile)
  const { pct } = identity ? getProfileCompletion(identity) : { pct: 0 }

  const [projects, setProjects] = useState(null)
  const [opps, setOpps] = useState(null)
  const [submissions, setSubmissions] = useState(null)
  const [bookmarks, setBookmarks] = useState(null)
  const [joinRequests, setJoinRequests] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      if (!user?.id) return
      setLoadError('')
      const [p, o, s, b, j] = await Promise.all([
        listMyProjects(user.id, { limit: 100 }),
        listOpportunities({ status: 'published', limit: 12 }),
        listMySubmissions(user.id, { limit: 40 }),
        listMyBookmarks(user.id, { limit: 100 }),
        listMyJoinRequests(user.id, { limit: 40 }),
      ])
      if (!active) return
      if (p.error || o.error || s.error || b.error || j.error) {
        setLoadError('Some panels could not be loaded. The rest of this page is current.')
      }
      setProjects(p.data || [])
      setOpps(o.data || [])
      setSubmissions(s.data || [])
      setBookmarks(b.data || [])
      setJoinRequests(j.data || [])
    }
    load()
    return () => { active = false }
  }, [user?.id, reload])

  const retry = useCallback(() => setReload(n => n + 1), [])

  const pendingSubs = useMemo(
    () => (submissions || []).filter(s => s.status === 'pending'),
    [submissions]
  )

  /* --- workspace summary: counts only for data the database actually holds -- */
  const metrics = useMemo(() => {
    const value = (rows, extra = 0) => {
      if (rows === null) return null
      return loadError ? '--' : rows.length + extra
    }
    return [
      {
        key: 'projects',
        icon: <Layers size={16} />,
        value: value(projects),
        label: 'Projects',
      },
      {
        key: 'saved',
        icon: <Bookmark size={16} />,
        value: value(bookmarks),
        label: 'Saved',
      },
      {
        key: 'pending',
        icon: <Clock size={16} />,
        value: value(joinRequests, pendingSubs.length),
        label: 'Pending',
      },
    ]
  }, [projects, bookmarks, joinRequests, pendingSubs, loadError])

  /* --- recent activity: only genuine events from this user's own records --- */
  const recent = useMemo(() => {
    const activity = []
    for (const s of submissions || []) {
      activity.push({
        kind: 'submission',
        date: s.created_at,
        text: s.status === 'pending'
          ? `Submitted "${s.title}" for review`
          : s.status === 'published'
            ? `Your listing "${s.title}" was published`
            : `Submitted "${s.title}"`,
        to: `/opportunities/${s.id}`,
      })
    }
    for (const p of projects || []) {
      if (p.membership?.role === 'owner') {
        activity.push({
          kind: 'project',
          date: p.created_at,
          text: `Created project "${p.title}"`,
          to: `/projects/${p.id}`,
        })
      }
    }
    for (const r of joinRequests || []) {
      if (r.project) {
        activity.push({
          kind: 'join',
          date: r.created_at,
          text: `Requested to join "${r.project.title}"`,
          to: `/projects/${r.project.id}`,
        })
      }
    }
    activity.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    return activity.slice(0, 5)
  }, [submissions, projects, joinRequests])

  /* --- interest matches: a tag on listings already shown, never a second list --- */
  const matchedIds = useMemo(() => {
    const tokens = interestTokens(profile?.interests)
    if (!tokens.length || !opps) return new Set()
    return new Set(
      opps.filter(o => {
        const hay = [o.title, o.description, o.organization, o.type, o.eligibility]
          .filter(Boolean).join(' ').toLowerCase()
        return tokens.some(t => hay.includes(t))
      }).map(o => o.id)
    )
  }, [opps, profile?.interests])

  const name = firstName(profile?.full_name)
  const profileReady = profileStatus === 'ready' || profileStatus === 'missing'
  const welcomeMeta = [profile?.aadi_id]
  const identityMeta = [profile?.course, profile?.college]

  return (
    <div className="ov">
      {/* ---------------------------- 1. welcome ---------------------------- */}
      <section className="ov-welcome">
        <div className="ov-welcome__body">
          <h1 className="ov-welcome__title">
            {greeting()}{name && <>, <span className="ov-welcome__name">{name}</span></>}
          </h1>
          <p className="ov-welcome__tagline">Your next big idea could start here.</p>
          <MetaRow items={welcomeMeta} className="ov-welcome__meta" />
        </div>

        <div className="ov-welcome__visual">
          <WelcomeVisual />
        </div>
      </section>

      {loadError && (
        <div className="p-inline-error ov-error">
          <span>{loadError}</span>
          <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={retry}>Retry</button>
        </div>
      )}

      {/* -------------------------- 2. workspace summary --------------------- */}
      <section
        className="ov-summary"
        aria-label="Workspace summary"
        aria-busy={metrics.some(m => m.value === null)}
      >
        <p className="ov-summary__title">Workspace</p>
        <ul className="ov-summary__stats">
          {metrics.map(m => (
            <li key={m.key} className="ov-stat">
              <span className="ov-stat__icon" aria-hidden="true">{m.icon}</span>
              <span className="ov-stat__body">
                {m.value === null ? (
                  <span className="ov-stat__value ov-stat__value--loading" aria-hidden="true" />
                ) : (
                  <span className="ov-stat__value">{m.value}</span>
                )}
                <span className="ov-stat__label">{m.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------- 3. your projects ------------------------ */}
      <section className="ov-block" aria-labelledby="ov-projects-title">
        <div className="ov-block__head">
          <h2 id="ov-projects-title" className="ov-block__title">Your projects</h2>
          <Link to="/projects" className="ov-block__link">
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {projects === null ? (
          <Spinner label="Loading your projects..." />
        ) : projects.length === 0 ? (
          <div className="ov-firstbuild">
            <FirstProjectArt />
            <div className="ov-firstbuild__copy">
              <p className="ov-firstbuild__title">Your workspace is ready</p>
              <p className="ov-firstbuild__text">
                Turn an idea into a project and invite teammates when you are ready.
              </p>
            </div>
            <Link to="/projects/new" className="p-btn p-btn--primary p-btn--sm">
              Create your first project
            </Link>
          </div>
        ) : (
          <ul className="ov-projects">
            {projects.slice(0, 4).map(p => (
              <li key={p.id}>
                <Link to={`/projects/${p.id}`} className="ov-project">
                  <span className="ov-project__mark" aria-hidden="true">
                    <Layers size={16} />
                  </span>
                  <div className="ov-project__body">
                    <span className="ov-project__title">{p.title}</span>
                    <MetaRow
                      items={[p.category, p.technologies?.slice(0, 2).join(', ')]}
                      className="ov-project__meta"
                    />
                  </div>
                  <span className="ov-project__side">
                    <span className="ov-project__role">
                      {p.membership?.role === 'owner' ? 'Owner' : 'Member'}
                    </span>
                    <span className={`ov-status ov-status--${p.status || 'planning'}`}>
                      {statusLabel(p.status)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------ 4. discover opportunities ------------------ */}
      <section className="ov-block" aria-labelledby="ov-opps-title">
        <div className="ov-block__head">
          <div>
            <h2 id="ov-opps-title" className="ov-block__title">Discover opportunities</h2>
            <p className="ov-block__sub">
              Internships, hackathons, competitions and events from the community.
            </p>
          </div>
          <span className="ov-block__actions">
            {opps && opps.length > 0 && (
              <Link to="/opportunities/new" className="ov-block__link ov-block__link--muted">
                Submit
              </Link>
            )}
            <Link to="/opportunities" className="ov-block__link">
              View all
              <ArrowRight size={14} />
            </Link>
          </span>
        </div>

        {opps === null ? (
          <Spinner label="Loading opportunities..." />
        ) : opps.length === 0 ? (
          <div className="ov-note">
            <span className="ov-note__icon" aria-hidden="true"><Compass size={16} /></span>
            <p className="ov-note__text">
              Listings appear here once a moderator reviews a student submission.
            </p>
            <Link to="/opportunities/new" className="ov-block__link">
              Submit an opportunity
            </Link>
          </div>
        ) : (
          <ul className="ov-opps">
            {opps.slice(0, 4).map(o => (
              <li key={o.id}>
                <Link to={`/opportunities/${o.id}`} className="ov-opp">
                  <span className="ov-opp__type" aria-hidden="true">
                    <OpportunityTypeIcon type={o.type} />
                  </span>
                  <div className="ov-opp__body">
                    <span className="ov-opp__title">{o.title}</span>
                    {o.organization && <span className="ov-opp__org">{o.organization}</span>}
                    <div className="ov-opp__meta">
                      <span className="ov-opp__kind">{opportunityTypeLabel(o.type)}</span>
                      <MetaRow
                        items={[
                          label(o.mode),
                          o.deadline ? `Closes ${fmtDate(o.deadline)}` : '',
                        ]}
                        className="ov-opp__meta-line"
                      />
                      {o.is_verified && (
                        <span className="ov-opp__verified">
                          <Check size={12} />
                          Verified
                        </span>
                      )}
                      {matchedIds.has(o.id) && <span className="ov-match">Match</span>}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --------------------------- 5. recent activity ----------------------- */}
      <section className="ov-block" aria-labelledby="ov-activity-title">
        <div className="ov-block__head">
          <h2 id="ov-activity-title" className="ov-block__title">Recent activity</h2>
        </div>

        {submissions === null || projects === null || joinRequests === null ? (
          <Spinner label="Loading activity..." />
        ) : recent.length === 0 ? (
          <p className="ov-feed-empty">
            <Clock size={14} />
            <span>Nothing logged yet - your activity appears here as you build, join and submit.</span>
          </p>
        ) : (
          <ol className="ov-feed">
            {recent.map((a, i) => (
              <li key={`${a.to}-${i}`}>
                <Link to={a.to} className="ov-feed__item">
                  <span className="ov-feed__mark" aria-hidden="true">
                    <ActivityIcon kind={a.kind} />
                  </span>
                  <span className="ov-feed__text">{a.text}</span>
                  <time className="ov-feed__time" dateTime={a.date}>{fmtDate(a.date)}</time>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ------------------------- 6. AADI identity preview ------------------- */}
      <section className="ov-idcard" aria-label="AADI identity" aria-busy={!profileReady}>
        <div className="ov-idcard__identity">
          <p className="ov-idcard__label">AADI ID</p>
          {profileReady ? (
            <>
              <p className="ov-idcard__number">{profile?.aadi_id || 'Not issued yet'}</p>
              <p className="ov-idcard__name">{profile?.full_name || 'Student'}</p>
            </>
          ) : (
            <>
              <span className="ov-idcard__skeleton ov-idcard__skeleton--id" aria-hidden="true" />
              <span className="ov-idcard__skeleton ov-idcard__skeleton--name" aria-hidden="true" />
            </>
          )}
          <MetaRow items={identityMeta} className="ov-idcard__meta" />
        </div>

        <div className="ov-idcard__side">
          {profileReady && (pct === 100 ? (
            <span className="ov-idcard__status ov-idcard__status--done">
              <Check size={13} />
              <span>Profile complete</span>
            </span>
          ) : (
            <span className="ov-idcard__status">
              <span className="ov-idcard__meter" aria-hidden="true">
                <i style={{ width: `${pct}%` }} />
              </span>
              <span>Profile {pct}% complete</span>
            </span>
          ))}
          <Link to="/aadi-id" className="p-btn p-btn--secondary p-btn--sm">
            Open ID card
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}

