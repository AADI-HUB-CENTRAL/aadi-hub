import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import {
  listOpportunities, listMyBookmarks, listMySubmissions,
  OPPORTUNITY_TYPES, OPPORTUNITY_MODES, opportunityTypeLabel,
} from '../../../features/opportunities/opportunitiesApi.js'
import { SearchInput, Select, Badge, Spinner, PageState } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Opportunities Hub — published listings plus two private tabs:
   what you submitted (any review state) and what you bookmarked.
--------------------------------------------------------------------------- */

const TABS = [
  { id: 'browse', label: 'Browse' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'mine', label: 'My submissions' },
]

export function deadlineState(iso) {
  if (!iso) return { cls: '', label: 'No deadline' }
  const end = new Date(iso)
  end.setHours(23, 59, 59, 999)
  const now = new Date()
  const days = Math.ceil((end - now) / 86400000)
  if (days < 0) return { cls: 'is-past', label: 'Closed' }
  if (days <= 7) return { cls: 'is-soon', label: `Closes in ${days} day${days === 1 ? '' : 's'}` }
  return { cls: '', label: `Closes ${end.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}` }
}

function OppRow({ o, right }) {
  const dl = deadlineState(o.deadline)
  return (
    <Link to={`/opportunities/${o.id}`} className="ov-item">
      <div className="ov-item__body">
        <p className="ov-item__title">{o.title}</p>
        <p className="ov-item__meta">
          {[o.organization, opportunityTypeLabel(o.type), o.mode].filter(Boolean).join(' · ')}
        </p>
        <p className={`opp-deadline ${dl.cls}`} style={{ fontSize: 12, marginTop: 4 }}>{dl.label}</p>
      </div>
      {right}
    </Link>
  )
}

export default function OpportunitiesPage() {
  const { user, isAuthenticated } = useAuth()
  const [tab, setTab] = useState('browse')

  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [mode, setMode] = useState('')

  const [browse, setBrowse] = useState(null)
  const [bookmarks, setBookmarks] = useState(null)
  const [mine, setMine] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    if (tab === 'browse') {
      setBrowse(null)
      listOpportunities({ search, type, mode }).then(({ data, error: err }) => {
        if (!active) return
        setError(err ? 'Could not load opportunities right now.' : '')
        setBrowse(data || [])
      })
    }
    return () => { active = false }
  }, [tab, search, type, mode])

  useEffect(() => {
    let active = true
    if (tab === 'bookmarks' && user?.id) {
      setBookmarks(null)
      listMyBookmarks(user.id).then(({ data, error: err }) => {
        if (!active) return
        setError(err ? 'Could not load your bookmarks.' : '')
        setBookmarks(data || [])
      })
    }
    if (tab === 'mine' && user?.id) {
      setMine(null)
      listMySubmissions(user.id).then(({ data, error: err }) => {
        if (!active) return
        setError(err ? 'Could not load your submissions.' : '')
        setMine(data || [])
      })
    }
    return () => { active = false }
  }, [tab, user?.id])

  const typeOptions = useMemo(
    () => [{ value: '', label: 'Any type' }, ...OPPORTUNITY_TYPES],
    [],
  )
  const modeOptions = useMemo(
    () => [{ value: '', label: 'Any mode' }, ...OPPORTUNITY_MODES],
    [],
  )

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">Opportunities hub</h1>
          <p className="page-head__sub">
            Internships, hackathons, scholarships and more — submitted by students and reviewed before publishing.
            Nothing here is sponsored or guaranteed.
          </p>
        </div>
        <Link to="/opportunities/new" className="p-btn p-btn--primary p-btn--md">Submit an opportunity</Link>
      </div>

      <div className="chip-cloud" style={{ marginBottom: 18 }}>
        {TABS.map(t => (
          <button key={t.id} type="button" className={`p-chip${tab === t.id ? ' p-chip--on' : ''}`}
            onClick={() => setTab(t.id)} aria-pressed={tab === t.id}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="p-inline-error" style={{ marginBottom: 16 }}>{error}</div>}

      {tab === 'browse' && (
        <>
          <div className="toolbar" style={{ marginBottom: 20 }}>
            <div className="toolbar__search">
              <SearchInput value={search} onChange={setSearch} placeholder="Search title, organisation…" />
            </div>
            <div className="toolbar__filters">
              <Select value={type} onChange={e => setType(e.target.value)} options={typeOptions} aria-label="Filter by type" />
              <Select value={mode} onChange={e => setMode(e.target.value)} options={modeOptions} aria-label="Filter by mode" />
            </div>
          </div>

          {browse === null ? (
            <Spinner label="Loading opportunities…" />
          ) : browse.length === 0 ? (
            <PageState
              title={search || type || mode ? 'Nothing matches those filters.' : 'No published opportunities yet.'}
              body={
                search || type || mode
                  ? 'Try clearing a filter.'
                  : 'Listings appear once a moderator reviews a student submission. You can submit one yourself — it stays private until approved.'
              }
              action={<Link to="/opportunities/new" className="p-btn p-btn--primary p-btn--md">Submit an opportunity</Link>}
            />
          ) : (
            <div className="ov-list">
              {browse.map(o => (
                <OppRow key={o.id} o={o}
                  right={
                    <Badge tone={o.is_verified ? 'kiwi' : 'info'}>
                      {o.is_verified ? 'Verified' : 'Reviewed listing'}
                    </Badge>
                  } />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'bookmarks' && (
        !isAuthenticated ? (
          <PageState title="Sign in to see bookmarks."
            body="Bookmarks are private to your account." />
        ) : bookmarks === null ? (
          <Spinner label="Loading bookmarks…" />
        ) : bookmarks.length === 0 ? (
          <PageState title="No bookmarks yet."
            body="Use the bookmark button on any opportunity to save it here. Only you can see this list." />
        ) : (
          <div className="ov-list">
            {bookmarks.map(o => <OppRow key={o.id} o={o} right={<Badge tone="kiwi">Bookmarked</Badge>} />)}
          </div>
        )
      )}

      {tab === 'mine' && (
        !isAuthenticated ? (
          <PageState title="Sign in to see your submissions." body="Submissions are tied to your account." />
        ) : mine === null ? (
          <Spinner label="Loading your submissions…" />
        ) : mine.length === 0 ? (
          <PageState title="You have not submitted an opportunity."
            body="Found something worth sharing? Submit it — a moderator reviews every listing before it goes public."
            action={<Link to="/opportunities/new" className="p-btn p-btn--primary p-btn--md">Submit an opportunity</Link>} />
        ) : (
          <div className="ov-list">
            {mine.map(o => (
              <OppRow key={o.id} o={o}
                right={
                  <Badge tone={o.status === 'published' ? 'kiwi' : o.status === 'pending' ? 'warn' : 'neutral'}>
                    {o.status === 'pending' ? 'Awaiting review'
                      : o.status === 'published' ? 'Published'
                      : o.status === 'closed' ? 'Closed' : 'Draft'}
                  </Badge>
                } />
            ))}
          </div>
        )
      )}
    </div>
  )
}
