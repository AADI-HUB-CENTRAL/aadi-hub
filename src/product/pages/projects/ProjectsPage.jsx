import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import {
  listProjects, listMyProjects, listMyJoinRequests,
  PROJECT_CATEGORIES, PROJECT_STATUSES,
} from '../../../features/projects/projectsApi.js'
import { Select, Badge, Spinner, Avatar } from '../../ui/kit.jsx'
import {
  ArrowUpRight, Close, Clock, Compass, Layers, Plus, Search, Shield, Users,
} from '../../ui/icons.jsx'
import '../../styles/projects.css'

const TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'mine', label: 'My projects' },
  { id: 'requests', label: 'My requests' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'Any category' },
  ...PROJECT_CATEGORIES.map(category => ({ value: category, label: category })),
]

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  ...PROJECT_STATUSES,
]

function statusLabel(value) {
  const text = String(value || 'planning').replace(/_/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function fmtDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return '' }
}

function searchTokensFor(query) {
  return String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean)
}

function includesAll(parts, tokens) {
  if (tokens.length === 0) return true
  const haystack = parts.filter(Boolean).join(' ').toLowerCase()
  return tokens.every(token => haystack.includes(token))
}

function projectMatches(project, tokens) {
  return includesAll([
    project.title,
    project.description,
    project.category,
    statusLabel(project.status),
    ...(project.technologies || []),
    ...(project.skills_needed || []),
    ...(project.roles_needed || []),
    project.owner?.full_name,
    project.owner?.aadi_id,
    ...(project.members || []).map(member => member.profile?.full_name),
  ], tokens)
}

function requestMatches(request, tokens) {
  return includesAll([
    request.project?.title,
    request.message,
    request.status,
  ], tokens)
}

function EmptyProjectsArt() {
  return (
    <svg className="pj-empty__art" viewBox="0 0 176 132" fill="none" aria-hidden="true">
      <path
        d="M40 80 84 50l44 24M40 80l44 26 44-26M84 50v56"
        stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.4"
        strokeDasharray="3 6" strokeLinecap="round"
      />
      <rect x="68" y="32" width="34" height="34" rx="10" stroke="currentColor" strokeWidth="1.7" />
      <path d="M77 44h16M77 51h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="40" cy="80" r="7" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="128" cy="74" r="7" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="84" cy="106" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="84" cy="106" r="1.6" fill="currentColor" />
      <path
        d="M26 38h8M30 34v8M140 104h8M144 100v8"
        stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

function FilterToken({ label, onRemove }) {
  return (
    <span className="pj-token">
      <span className="pj-token__label" title={label}>{label}</span>
      <button
        type="button"
        className="pj-token__x"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
      >
        <Close size={12} />
      </button>
    </span>
  )
}

function EmptyState({ art, icon, title, body, action }) {
  return (
    <div className="pj-empty">
      {art || (icon && <span className="pj-empty__icon" aria-hidden="true">{icon}</span>)}
      <h2 className="pj-empty__title">{title}</h2>
      <p className="pj-empty__body">{body}</p>
      {action && <div className="pj-empty__action">{action}</div>}
    </div>
  )
}

function FilterEmpty({ onClear, searchOnly = false }) {
  return (
    <EmptyState
      icon={<Compass size={24} />}
      title={searchOnly ? 'No projects match your search.' : 'No projects match your filters.'}
      body={searchOnly
        ? 'Try a different search term to find what you are looking for.'
        : 'Try a different search or clear the filters to see everything in the directory.'}
      action={(
        <button type="button" className="p-btn p-btn--secondary p-btn--md" onClick={onClear}>
          <Close size={15} />
          {searchOnly ? 'Clear search' : 'Clear filters'}
        </button>
      )}
    />
  )
}

function LoadingGrid({ label }) {
  return (
    <div className="pj-loading" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="pj-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="pj-skeleton" key={index}>
            <span className="pj-skeleton__line pj-skeleton__line--xs" />
            <span className="pj-skeleton__line pj-skeleton__line--title" />
            <span className="pj-skeleton__line" />
            <span className="pj-skeleton__line pj-skeleton__line--short" />
            <span className="pj-skeleton__line pj-skeleton__line--foot" />
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadError({ message, onRetry }) {
  return (
    <div className="p-inline-error pj-error" role="alert">
      <span>{message}</span>
      <button
        type="button"
        className="p-btn p-btn--secondary p-btn--sm"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  )
}

function TabPanel({ id, active, busy, children }) {
  return (
    <div
      role="tabpanel"
      id={`pj-panel-${id}`}
      aria-labelledby={`pj-tab-${id}`}
      aria-busy={(active && busy) || undefined}
      hidden={!active}
      className="pj-panel"
    >
      {children}
    </div>
  )
}

function RequestRow({ request }) {
  return (
    <Link to={`/projects/${request.project_id}`} className="pj-request">
      <span className="pj-request__mark" aria-hidden="true">
        <Layers size={16} />
      </span>
      <span className="pj-request__body">
        <span className="pj-request__title">{request.project?.title || 'Project'}</span>
        <span className="pj-request__meta">
          <span>Sent {fmtDate(request.created_at)}</span>
          {request.message && <span className="pj-request__message">&ldquo;{request.message}&rdquo;</span>}
        </span>
      </span>
      <span className="pj-request__side">
        <Badge tone="warn">Pending</Badge>
        <span className="pj-request__arrow" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      </span>
    </Link>
  )
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('discover')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const [discover, setDiscover] = useState(null)
  const [mine, setMine] = useState(null)
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const tabRefs = useRef([])

  useEffect(() => {
    if (tab !== 'discover') return undefined
    let active = true
    setDiscover(null)
    setError('')
    listProjects({ category, status }).then(({ data, error: loadError }) => {
      if (!active) return
      if (loadError) {
        setError('Could not load projects. The directory may be unavailable right now.')
        setDiscover([])
        return
      }
      setDiscover(data || [])
    })
    return () => { active = false }
  }, [tab, category, status, reloadKey])

  useEffect(() => {
    let active = true
    if (tab === 'mine' && user?.id) {
      setMine(null)
      setError('')
      listMyProjects(user.id).then(({ data, error: loadError }) => {
        if (!active) return
        if (loadError) {
          setError('Could not load your projects.')
          setMine([])
          return
        }
        setMine(data || [])
      })
    }
    if (tab === 'requests' && user?.id) {
      setRequests(null)
      setError('')
      listMyJoinRequests(user.id).then(({ data, error: loadError }) => {
        if (!active) return
        if (loadError) {
          setError('Could not load your join requests.')
          setRequests([])
          return
        }
        setRequests(data || [])
      })
    }
    return () => { active = false }
  }, [tab, user?.id, reloadKey])

  const searchTerm = search.trim()
  const tokens = useMemo(() => searchTokensFor(searchTerm), [searchTerm])

  const filteredDiscover = useMemo(
    () => (discover === null ? null : discover.filter(project => projectMatches(project, tokens))),
    [discover, tokens],
  )

  const filteredMine = useMemo(
    () => (mine === null ? null : mine.filter(project => projectMatches(project, tokens))),
    [mine, tokens],
  )

  const filteredRequests = useMemo(
    () => (requests === null ? null : requests.filter(request => requestMatches(request, tokens))),
    [requests, tokens],
  )

  const hasFacetFilters = Boolean(category || status)
  const hasFilters = Boolean(searchTerm || category || status)
  const activeStatusLabel = PROJECT_STATUSES.find(option => option.value === status)?.label || status

  function resetFilters() {
    setSearch('')
    setCategory('')
    setStatus('')
  }

  function handleTabKey(event) {
    const index = TABS.findIndex(item => item.id === tab)
    let nextIndex = -1

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TABS.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + TABS.length) % TABS.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = TABS.length - 1

    if (nextIndex < 0) return
    event.preventDefault()
    selectTab(TABS[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  function selectTab(nextTab) {
    setError('')
    setTab(nextTab)
  }

  return (
    <div className="pj">
      <header className="pj-head">
        <div className="pj-head__copy">
          <h1 className="pj-head__title">Projects</h1>
          <p className="pj-head__sub">Discover ideas. Build together. Make an impact.</p>
        </div>
        <Link to="/projects/new" className="p-btn p-btn--primary p-btn--md pj-head__action">
          <Plus size={16} />
          Start a project
        </Link>
      </header>

      <section className="pj-toolbar" aria-label="Project discovery">
        <div className="pj-toolbar__top">
          <div className="pj-search">
            <span className="pj-search__icon" aria-hidden="true"><Search size={16} /></span>
            <input
              type="search"
              className="pj-search__input"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search projects, skills, owners..."
              aria-label="Search projects"
              autoComplete="off"
              spellCheck="false"
            />
            {searchTerm && (
              <button
                type="button"
                className="pj-search__clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <Close size={14} />
              </button>
            )}
          </div>

          <div className="pj-tabs" role="tablist" aria-label="Project views">
            {TABS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`pj-tab-${item.id}`}
                aria-selected={tab === item.id}
                aria-controls={`pj-panel-${item.id}`}
                tabIndex={tab === item.id ? 0 : -1}
                className={`pj-tab${tab === item.id ? ' pj-tab--active' : ''}`}
                onClick={() => selectTab(item.id)}
                onKeyDown={handleTabKey}
                ref={element => { tabRefs.current[index] = element }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'discover' && (
          <div className="pj-filters">
            <div className="pj-filters__selects">
              <Select
                value={category}
                onChange={event => setCategory(event.target.value)}
                options={CATEGORY_OPTIONS}
                aria-label="Filter by category"
              />
              <Select
                value={status}
                onChange={event => setStatus(event.target.value)}
                options={STATUS_OPTIONS}
                aria-label="Filter by project status"
              />
            </div>

            {hasFilters && (
              <div className="pj-active" aria-label="Active filters">
                <span className="pj-active__label">Filtered by</span>
                {searchTerm && (
                  <FilterToken label={`Search: ${searchTerm}`} onRemove={() => setSearch('')} />
                )}
                {category && (
                  <FilterToken label={category} onRemove={() => setCategory('')} />
                )}
                {status && (
                  <FilterToken label={activeStatusLabel} onRemove={() => setStatus('')} />
                )}
                <button type="button" className="pj-clear-all" onClick={resetFilters}>
                  <Close size={12} />
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <TabPanel id="discover" active={tab === 'discover'} busy={discover === null}>
        {error ? (
          tab === 'discover' ? (
            <LoadError message={error} onRetry={() => setReloadKey(key => key + 1)} />
          ) : null
        ) : discover === null ? (
          <LoadingGrid label="Loading projects..." />
        ) : (
          <>
            <div className="pj-results" aria-live="polite" aria-atomic="true">
              <p className="pj-results__count">
                <strong>{filteredDiscover.length}</strong>
                {' '}
                {filteredDiscover.length === 1 ? 'project' : 'projects'}
                {hasFilters ? ' match your filters' : ' in the directory'}
              </p>
              <span className="pj-results__sort">Newest first</span>
            </div>

            {filteredDiscover.length === 0 ? (
              hasFilters ? (
                <FilterEmpty onClear={resetFilters} searchOnly={!hasFacetFilters} />
              ) : (
                <EmptyState
                  art={<EmptyProjectsArt />}
                  title="Every great project starts somewhere."
                  body="Share your idea, find collaborators, and build something meaningful."
                  action={(
                    <Link to="/projects/new" className="p-btn p-btn--primary p-btn--md">
                      <Plus size={16} />
                      Create a project
                    </Link>
                  )}
                />
              )
            ) : (
              <div className="pj-grid">
                {filteredDiscover.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </>
        )}
      </TabPanel>

      <TabPanel id="mine" active={tab === 'mine'} busy={mine === null}>
        {error ? (
          tab === 'mine' ? (
            <LoadError message={error} onRetry={() => setReloadKey(key => key + 1)} />
          ) : null
        ) : mine === null ? (
          <LoadingGrid label="Loading your projects..." />
        ) : (
          <>
            <div className="pj-results" aria-live="polite" aria-atomic="true">
              <p className="pj-results__count">
                <strong>{filteredMine.length}</strong>
                {' '}
                {filteredMine.length === 1 ? 'project' : 'projects'}
                {searchTerm ? ' match your search' : ' in your workspace'}
              </p>
            </div>

            {mine.length === 0 ? (
              <EmptyState
                icon={<Layers size={24} />}
                title="Your workspace is empty."
                body="Create a project to publish it to the directory, or request to join one you like."
                action={(
                  <Link to="/projects/new" className="p-btn p-btn--primary p-btn--md">
                    <Plus size={16} />
                    Create a project
                  </Link>
                )}
              />
            ) : filteredMine.length === 0 ? (
              <FilterEmpty onClear={() => setSearch('')} searchOnly />
            ) : (
              <div className="pj-grid">
                {filteredMine.map(project => (
                  <ProjectCard key={project.id} project={project} mine />
                ))}
              </div>
            )}
          </>
        )}
      </TabPanel>

      <TabPanel id="requests" active={tab === 'requests'} busy={requests === null}>
        {error ? (
          tab === 'requests' ? (
            <LoadError message={error} onRetry={() => setReloadKey(key => key + 1)} />
          ) : null
        ) : requests === null ? (
          <div className="pj-loading" role="status" aria-live="polite">
            <Spinner label="Loading your requests..." />
          </div>
        ) : (
          <>
            {requests.length > 0 && (
              <div className="pj-results" aria-live="polite" aria-atomic="true">
                <p className="pj-results__count">
                  <strong>{filteredRequests.length}</strong>
                  {' '}
                  pending {filteredRequests.length === 1 ? 'request' : 'requests'}
                  {searchTerm ? ' match your search' : ''}
                </p>
              </div>
            )}

            {requests.length === 0 ? (
              <EmptyState
                icon={<Clock size={24} />}
                title="No pending join requests."
                body="Requests you send from a project page appear here until the owner responds."
                action={(
                  <button
                    type="button"
                    className="p-btn p-btn--secondary p-btn--md"
                    onClick={() => selectTab('discover')}
                  >
                    <Compass size={16} />
                    Browse projects
                  </button>
                )}
              />
            ) : filteredRequests.length === 0 ? (
              <FilterEmpty onClear={() => setSearch('')} searchOnly />
            ) : (
              <div className="pj-requests">
                {filteredRequests.map(request => (
                  <RequestRow
                    key={`${request.project_id}-${request.created_at}`}
                    request={request}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </TabPanel>
    </div>
  )
}

export function ProjectCard({ project: p, mine = false }) {
  const projectStatus = p.status || 'planning'
  const ownerName = p.owner?.full_name || ''
  const membership = p.membership
  const isOwner = membership?.role === 'owner'
  const isMember = Boolean(membership?.role) && !isOwner
  const roles = (p.roles_needed || []).filter(Boolean)
  const rolePreview = roles.slice(0, 2).join(', ')
  const extraRoles = roles.length - 2
  const sourceTags = (p.technologies || []).length > 0 ? p.technologies : p.skills_needed
  const tags = [...new Set((sourceTags || []).filter(Boolean))]
  const shownTags = tags.slice(0, 4)
  const extraTags = tags.length - shownTags.length

  return (
    <Link to={`/projects/${p.id}`} className="pj-card">
      <div className="pj-card__head">
        {p.category
          ? <span className="pj-card__cat">{p.category}</span>
          : <span className="pj-card__cat pj-card__cat--muted">Uncategorized</span>}
        <span className="pj-card__badges">
          {p.visibility === 'private' && (
            <span className="pj-card__private">
              <Shield size={11} />
              Private
            </span>
          )}
          <span className={`pj-status pj-status--${projectStatus}`}>
            <span className="pj-status__dot" aria-hidden="true" />
            {statusLabel(projectStatus)}
          </span>
        </span>
      </div>

      <div className="pj-card__title-row">
        <h3 className="pj-card__title">{p.title}</h3>
        <span className="pj-card__arrow" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      </div>

      {p.description && <p className="pj-card__desc">{p.description}</p>}

      {shownTags.length > 0 && (
        <div className="pj-card__tags">
          {shownTags.map(tag => (
            <span key={tag} className="pj-card__tag">{tag}</span>
          ))}
          {extraTags > 0 && (
            <span className="pj-card__tag pj-card__tag--more">+{extraTags}</span>
          )}
        </div>
      )}

      <div className="pj-card__footer">
        <span className="pj-card__owner">
          {isOwner ? (
            <span className="pj-card__owner-role">You own this</span>
          ) : isMember ? (
            <span className="pj-card__owner-role">You are a member</span>
          ) : ownerName ? (
            <>
              <Avatar src={null} name={ownerName} size={22} />
              <span className="pj-card__owner-name">{ownerName}</span>
            </>
          ) : (
            <span className="pj-card__owner-role">{mine ? 'Your project' : 'Community project'}</span>
          )}
        </span>

        {roles.length > 0 && (
          <span className="pj-card__collab" title={`Looking for: ${roles.join(', ')}`}>
            <Users size={13} />
            <span>
              Needs {rolePreview}{extraRoles > 0 ? ` +${extraRoles}` : ''}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
