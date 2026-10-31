import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import {
  listProjects, listMyProjects, listMyJoinRequests,
  PROJECT_CATEGORIES, PROJECT_STATUSES,
} from '../../../features/projects/projectsApi.js'
import { SearchInput, Select, Badge, Spinner, PageState, Avatar } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Projects directory — discover public projects, see what you own/joined,
   and track join requests you have sent. All three tabs hit real tables.
--------------------------------------------------------------------------- */

const TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'mine', label: 'My projects' },
  { id: 'requests', label: 'My requests' },
]

export default function ProjectsPage() {
  const { user, profile } = useAuth()
  const [tab, setTab] = useState('discover')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const [discover, setDiscover] = useState(null)
  const [mine, setMine] = useState(null)
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    if (tab === 'discover') {
      setDiscover(null)
      listProjects({ search, category, status }).then(({ data, error }) => {
        if (!active) return
        setError(error ? 'Could not load projects. The directory may be unavailable right now.' : '')
        setDiscover(data || [])
      })
    }
    return () => { active = false }
  }, [tab, search, category, status])

  useEffect(() => {
    let active = true
    if (tab === 'mine' && user?.id) {
      setMine(null)
      listMyProjects(user.id).then(({ data, error }) => {
        if (!active) return
        setError(error ? 'Could not load your projects.' : '')
        setMine(data || [])
      })
    }
    if (tab === 'requests' && user?.id) {
      setRequests(null)
      listMyJoinRequests(user.id).then(({ data, error }) => {
        if (!active) return
        setError(error ? 'Could not load your join requests.' : '')
        setRequests(data || [])
      })
    }
    return () => { active = false }
  }, [tab, user?.id])

  const statusOptions = useMemo(
    () => [{ value: '', label: 'Any status' }, ...PROJECT_STATUSES],
    [],
  )
  const categoryOptions = useMemo(
    () => [{ value: '', label: 'Any category' }, ...PROJECT_CATEGORIES.map(c => ({ value: c, label: c }))],
    [],
  )

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">Projects &amp; collaboration</h1>
          <p className="page-head__sub">
            Every project here was created by a student. Join requests are reviewed by the owner — nobody is added automatically.
          </p>
        </div>
        <Link to="/projects/new" className="p-btn p-btn--primary p-btn--md">Start a project</Link>
      </div>

      <div className="chip-cloud" style={{ marginBottom: 18 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={`p-chip${tab === t.id ? ' p-chip--on' : ''}`}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="p-inline-error" style={{ marginBottom: 16 }}>{error}</div>}

      {tab === 'discover' && (
        <>
          <div className="toolbar" style={{ marginBottom: 20 }}>
            <div className="toolbar__search">
              <SearchInput value={search} onChange={setSearch} placeholder="Search projects…" />
            </div>
            <div className="toolbar__filters">
              <Select value={category} onChange={e => setCategory(e.target.value)} options={categoryOptions} aria-label="Filter by category" />
              <Select value={status} onChange={e => setStatus(e.target.value)} options={statusOptions} aria-label="Filter by status" />
            </div>
          </div>

          {discover === null ? (
            <Spinner label="Loading projects…" />
          ) : discover.length === 0 ? (
            <PageState
              title={search || category || status ? 'No projects match those filters.' : 'No public projects yet.'}
              body={
                search || category || status
                  ? 'Try a different search or clear the filters.'
                  : 'Be the first to create one — teammates can request to join.'
              }
              action={
                <Link to="/projects/new" className="p-btn p-btn--primary p-btn--md">Start a project</Link>
              }
            />
          ) : (
            <div className="card-grid">
              {discover.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </>
      )}

      {tab === 'mine' && (
        mine === null ? (
          <Spinner label="Loading your projects…" />
        ) : mine.length === 0 ? (
          <PageState
            title="You have not created or joined a project."
            body="Create one and publish it to the directory, or send a join request on a project you like."
            action={<Link to="/projects/new" className="p-btn p-btn--primary p-btn--md">Start a project</Link>}
          />
        ) : (
          <div className="card-grid">
            {mine.map(p => <ProjectCard key={p.id} project={p} mine />)}
          </div>
        )
      )}

      {tab === 'requests' && (
        requests === null ? (
          <Spinner label="Loading your requests…" />
        ) : requests.length === 0 ? (
          <PageState
            title="No pending join requests."
            body="Requests you send from a project page show up here until the owner approves or rejects them."
            action={<Link to="/projects" className="p-btn p-btn--secondary p-btn--md">Browse projects</Link>}
          />
        ) : (
          <div className="ov-list">
            {requests.map(r => (
              <Link key={`${r.project_id}-${r.created_at}`} to={`/projects/${r.project_id}`} className="ov-item">
                <div className="ov-item__body">
                  <p className="ov-item__title">{r.project?.title || 'Project'}</p>
                  <p className="ov-item__meta">
                    Sent {new Date(r.created_at).toLocaleDateString()}
                    {r.message ? ` · "${r.message}"` : ''}
                  </p>
                </div>
                <Badge tone="warn">Pending approval</Badge>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export function ProjectCard({ project: p, mine = false }) {
  const ownerLabel = mine
    ? p.membership?.role === 'owner'
      ? 'You own this'
      : 'You are a member'
    : null

  return (
    <Link to={`/projects/${p.id}`} className="rcard">
      <div className="rcard__top">
        {p.category && <Badge tone="info">{p.category}</Badge>}
        <Badge tone={p.status === 'in_progress' ? 'kiwi' : p.status === 'completed' ? 'neutral' : 'neutral'}>
          {String(p.status || 'planning').replace('_', ' ')}
        </Badge>
      </div>
      <h3 className="rcard__title">{p.title}</h3>
      {p.description && <p className="rcard__desc">{p.description}</p>}
      {p.technologies?.length > 0 && (
        <div className="rcard__tags">
          {p.technologies.slice(0, 5).map(t => <span key={t} className="rcard__tag">{t}</span>)}
        </div>
      )}
      <div className="rcard__foot">
        {ownerLabel ? (
          <span className="rcard__owner">{ownerLabel}</span>
        ) : p.owner?.full_name ? (
          <span className="rcard__owner">
            <Avatar src={null} name={p.owner.full_name} size={22} />
            {p.owner.full_name}
          </span>
        ) : <span />}
        {p.roles_needed?.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--faint-on-dark)' }}>
            Needs: {p.roles_needed.slice(0, 2).join(', ')}
          </span>
        )}
      </div>
    </Link>
  )
}
