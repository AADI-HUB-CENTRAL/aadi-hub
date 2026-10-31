import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { profileToIdentity } from '../../../features/profile/adapters.js'
import { getProfileCompletion } from '../../../utils/identity.js'
import { listMyProjects } from '../../../features/projects/projectsApi.js'
import { listOpportunities, listMySubmissions } from '../../../features/opportunities/opportunitiesApi.js'
import { Badge, PageState, Spinner } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Overview — the student's honest home screen.
   Everything shown is real data from Supabase. Missing data renders as an
   empty state, never as invented activity.
--------------------------------------------------------------------------- */

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function firstName(name = '') {
  return String(name).split(/\s+/).filter(Boolean)[0] || 'there'
}

const QUICK_ACTIONS = [
  { to: '/projects/new', label: 'Start a project', icon: 'M12 5v14M5 12h14' },
  { to: '/projects', label: 'Find teammates', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { to: '/opportunities', label: 'Browse opportunities', icon: 'M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' },
  { to: '/profile', label: 'Edit profile', icon: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' },
]

export default function OverviewPage() {
  const { user, profile } = useAuth()
  const identity = profileToIdentity(profile)
  const { pct } = getProfileCompletion(identity)

  const [projects, setProjects] = useState(null)
  const [opps, setOpps] = useState(null)
  const [submissions, setSubmissions] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      if (!user?.id) return
      const [p, o, s] = await Promise.all([
        listMyProjects(user.id, { limit: 4 }),
        listOpportunities({ limit: 4 }),
        listMySubmissions(user.id, { limit: 20 }),
      ])
      if (!active) return
      if (p.error || o.error) {
        setLoadError('Some panels could not be loaded. The rest of this page is current.')
      } else {
        setLoadError('')
      }
      setProjects(p.data || [])
      setOpps(o.data || [])
      setSubmissions((s.data || []).filter(x => x.status === 'pending'))
    }
    load()
    return () => { active = false }
  }, [user?.id])

  return (
    <div>
      <section className="ov-hero">
        <div className="ov-hero__greet">
          <h1>{greeting()}, {firstName(profile?.full_name)}.</h1>
          <p>
            {profile?.aadi_id} ·{' '}
            {[profile?.course, profile?.college].filter(Boolean).join(' · ') || 'Add your education details'}
          </p>
        </div>

        <div className="ov-hero__completion">
          <div className="ov-ring" role="img" aria-label={`Profile ${pct} percent complete`}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--night-700)" strokeWidth="7" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--kiwi-500)" strokeWidth="7"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - pct / 100)}`} />
            </svg>
            <span className="ov-ring__pct">{pct}%</span>
          </div>
          <div className="ov-hero__completion-copy">
            <strong>{pct === 100 ? 'Profile complete' : 'Profile progress'}</strong>
            <span>
              {pct === 100
                ? 'Everything is filled in.'
                : 'Finish your profile so teammates can find you.'}
            </span>
            {pct < 100 && (
              <Link to="/profile" style={{ fontSize: 13, color: 'var(--kiwi-400)', fontWeight: 600 }}>
                Continue editing →
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="ov-actions" style={{ marginBottom: 24 }}>
        {QUICK_ACTIONS.map(a => (
          <Link key={a.to} to={a.to} className="ov-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={a.icon} />
            </svg>
            <span>{a.label}</span>
          </Link>
        ))}
      </div>

      {loadError && <div className="p-inline-error" style={{ marginBottom: 16 }}>{loadError}</div>}

      <div className="ov-grid">
        {/* ----- my projects ----- */}
        <section className="ov-panel">
          <div className="ov-panel__head">
            <h2>Your projects</h2>
            <Link to="/projects" className="ov-panel__link">View all</Link>
          </div>
          {projects === null ? (
            <Spinner label="Loading your projects…" />
          ) : projects.length === 0 ? (
            <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>
              You have not created or joined a project yet.{' '}
              <Link to="/projects/new" style={{ color: 'var(--kiwi-400)', fontWeight: 600 }}>
                Start one
              </Link>{' '}
              and invite teammates.
            </p>
          ) : (
            <div className="ov-list">
              {projects.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className="ov-item">
                  <div className="ov-item__body">
                    <p className="ov-item__title">{p.title}</p>
                    <p className="ov-item__meta">
                      {p.membership?.role === 'owner' ? 'You own this' : 'You are a member'}
                      {' · '}
                      {p.technologies?.slice(0, 3).join(', ') || 'No technologies listed'}
                    </p>
                  </div>
                  <Badge tone={p.status === 'in_progress' ? 'kiwi' : 'neutral'}>
                    {String(p.status).replace('_', ' ')}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ----- latest opportunities ----- */}
        <section className="ov-panel">
          <div className="ov-panel__head">
            <h2>Latest opportunities</h2>
            <Link to="/opportunities" className="ov-panel__link">View all</Link>
          </div>
          {opps === null ? (
            <Spinner label="Loading opportunities…" />
          ) : opps.length === 0 ? (
            <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>
              No published opportunities yet. You can{' '}
              <Link to="/opportunities/new" style={{ color: 'var(--kiwi-400)', fontWeight: 600 }}>
                submit one
              </Link>{' '}
              for review.
            </p>
          ) : (
            <div className="ov-list">
              {opps.map(o => (
                <Link key={o.id} to={`/opportunities/${o.id}`} className="ov-item">
                  <div className="ov-item__body">
                    <p className="ov-item__title">{o.title}</p>
                    <p className="ov-item__meta">
                      {[o.organization, o.mode].filter(Boolean).join(' · ') || 'Details inside'}
                    </p>
                  </div>
                  <Badge tone={o.is_verified ? 'kiwi' : 'info'}>
                    {o.is_verified ? 'Verified' : 'Listing'}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ----- pending submissions / requests honesty strip ----- */}
      {(submissions?.length > 0) && (
        <section className="ov-panel" style={{ marginTop: 20 }}>
          <div className="ov-panel__head">
            <h2>Your submissions awaiting review</h2>
          </div>
          <div className="ov-list">
            {submissions.map(s => (
              <Link key={s.id} to={`/opportunities/${s.id}`} className="ov-item">
                <div className="ov-item__body">
                  <p className="ov-item__title">{s.title}</p>
                  <p className="ov-item__meta">Submitted — visible to you and moderators only</p>
                </div>
                <Badge tone="warn">Awaiting review</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ----- first-run nudge ----- */}
      {projects?.length === 0 && opps?.length === 0 && projects !== null && (
        <div style={{ marginTop: 24 }}>
          <PageState
            title="A blank workspace — on purpose."
            body="AADI HUB only shows real projects, real people and real opportunities. There is no sample activity here. Create your first project or browse what other students have posted."
            action={
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/projects/new" className="p-btn p-btn--primary p-btn--md">Start a project</Link>
                <Link to="/opportunities" className="p-btn p-btn--secondary p-btn--md">Browse opportunities</Link>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}
