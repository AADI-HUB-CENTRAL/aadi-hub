import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import {
  fetchProject, fetchMyMembership, listJoinRequests,
  requestToJoin, leaveProject, respondToJoinRequest, removeMember,
  archiveProject, deleteProject, PROJECT_STATUSES,
} from '../../../features/projects/projectsApi.js'
import { Button, Badge, Spinner, PageState, TextArea, Avatar } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Project detail — facts, members, and the join/approve workflow.
   Every mutation is immediate and honest about failure.
--------------------------------------------------------------------------- */

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return '' }
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [project, setProject] = useState(null)
  const [membership, setMembership] = useState(null)
  const [requests, setRequests] = useState([])
  const [state, setState] = useState('loading') // loading | ready | missing | error
  const [error, setError] = useState('')
  const [joinMessage, setJoinMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const isOwner = project?.owner_id === user?.id

  const load = useCallback(async () => {
    setState('loading')
    setError('')
    const [{ data, error: pErr }, { data: m }] = await Promise.all([
      fetchProject(id),
      user?.id ? fetchMyMembership(id, user.id) : Promise.resolve({ data: null }),
    ])
    if (pErr) {
      setState('error')
      setError('This project could not be loaded. It may have been deleted, or the database is unavailable.')
      return
    }
    if (!data) { setState('missing'); return }
    setProject(data)
    setMembership(m)
    if (data.owner_id === user?.id) {
      const { data: reqs } = await listJoinRequests(id)
      setRequests(reqs || [])
    }
    setState('ready')
  }, [id, user?.id])

  useEffect(() => { load() }, [load])

  async function act(fn, okMsg) {
    if (busy) return
    setBusy(true)
    const { error: err } = await fn()
    setBusy(false)
    if (err) { setError(err.message || 'That action failed. Please try again.'); return }
    if (okMsg) toast.success(okMsg)
    await load()
  }

  function handleJoin() {
    act(() => requestToJoin(id, user.id, joinMessage), 'Join request sent. The owner will review it.')
    setJoinMessage('')
  }

  async function handleDelete() {
    if (!window.confirm('Delete this project permanently? This cannot be undone.')) return
    setBusy(true)
    const { error: err } = await deleteProject(id)
    setBusy(false)
    if (err) { setError(err.message || 'Could not delete the project.'); return }
    toast.success('Project deleted.')
    navigate('/projects', { replace: true })
  }

  if (state === 'loading') return <Spinner label="Loading project…" />

  if (state === 'missing') {
    return (
      <PageState
        title="Project not found."
        body="It may have been deleted, or it is private and you are not a member."
        action={<Link to="/projects" className="p-btn p-btn--secondary p-btn--md">Back to projects</Link>}
      />
    )
  }

  if (state === 'error') {
    return (
      <PageState
        title="Could not load this project."
        body={error}
        action={<button className="p-btn p-btn--primary p-btn--md" onClick={load}>Try again</button>}
      />
    )
  }

  const p = project
  const memberRows = p.members || []
  const activeMembers = memberRows.filter(m => m.status === 'active')
  const myRequest = memberRows.find(m => m.user_id === user?.id && m.status === 'pending')

  return (
    <div>
      <Link to="/projects" className="detail-back">← All projects</Link>

      <header className="detail-head">
        <div className="detail-head__row">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {p.category && <Badge tone="info">{p.category}</Badge>}
            <Badge tone={p.status === 'in_progress' ? 'kiwi' : 'neutral'}>
              {(PROJECT_STATUSES.find(s => s.value === p.status)?.label || String(p.status)).replace('_', ' ')}
            </Badge>
            <Badge tone="neutral">{p.visibility === 'private' ? 'Private' : 'Public'}</Badge>
          </div>
          {isOwner && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to={`/projects/${p.id}/edit`} className="p-btn p-btn--secondary p-btn--sm">Edit</Link>
              <Button size="sm" variant="secondary" disabled={busy}
                onClick={() => act(() => archiveProject(p.id), 'Project archived.')}>
                Archive
              </Button>
              <Button size="sm" variant="danger" disabled={busy} onClick={handleDelete}>Delete</Button>
            </div>
          )}
        </div>
        <h1>{p.title}</h1>
        <div className="detail-head__meta">
          <span>Created {fmtDate(p.created_at)}</span>
          {p.owner?.full_name && <span>Owned by {p.owner.full_name}</span>}
        </div>
      </header>

      {error && <div className="p-inline-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="detail-body">
        <div>
          {p.description && (
            <section className="detail-section">
              <h2>About this project</h2>
              <p>{p.description}</p>
            </section>
          )}

          <section className="detail-section">
            <h2>Members ({activeMembers.length})</h2>
            {activeMembers.length === 0 ? (
              <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>
                No members besides the owner yet.
              </p>
            ) : (
              <div>
                {activeMembers.map(m => (
                  <div className="member-row" key={m.user_id}>
                    <Avatar src={null} name={m.profile?.full_name || 'Member'} size={34} />
                    <div className="member-row__body">
                      <span className="member-row__name">{m.profile?.full_name || 'Member'}</span>
                      <span className="member-row__meta">
                        {m.role}{m.profile?.aadi_id ? ` · ${m.profile.aadi_id}` : ''}
                      </span>
                    </div>
                    {isOwner && (
                      <div className="member-row__actions">
                        <Button size="sm" variant="ghost" disabled={busy}
                          onClick={() => act(() => removeMember(p.id, m.user_id), 'Member removed.')}>
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {isOwner && (
            <section className="detail-section">
              <h2>Join requests ({requests.length})</h2>
              {requests.length === 0 ? (
                <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>
                  No pending requests. Requests appear here when students click “Request to join”.
                </p>
              ) : (
                <div>
                  {requests.map(r => (
                    <div className="member-row" key={r.user_id}>
                      <Avatar src={null} name={r.profile?.full_name || 'Student'} size={34} />
                      <div className="member-row__body">
                        <span className="member-row__name">{r.profile?.full_name || 'Student'}</span>
                        <span className="member-row__meta">
                          {r.message ? `"${r.message}"` : 'No message'}
                        </span>
                      </div>
                      <div className="member-row__actions">
                        <Button size="sm" disabled={busy}
                          onClick={() => act(() => respondToJoinRequest(p.id, r.user_id, true), 'Request approved.')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="secondary" disabled={busy}
                          onClick={() => act(() => respondToJoinRequest(p.id, r.user_id, false), 'Request rejected.')}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="detail-side">
          <section className="detail-section">
            <h2>Details</h2>
            <div className="kv">
              <div className="kv__row"><span className="kv__key">Status</span>
                <span className="kv__val">{PROJECT_STATUSES.find(s => s.value === p.status)?.label || p.status}</span></div>
              <div className="kv__row"><span className="kv__key">Category</span>
                <span className="kv__val">{p.category || '—'}</span></div>
              <div className="kv__row"><span className="kv__key">Created</span>
                <span className="kv__val">{fmtDate(p.created_at)}</span></div>
              <div className="kv__row"><span className="kv__key">Updated</span>
                <span className="kv__val">{fmtDate(p.updated_at)}</span></div>
            </div>
          </section>

          {p.roles_needed?.length > 0 && (
            <section className="detail-section">
              <h2>Looking for</h2>
              <div className="chip-cloud">
                {p.roles_needed.map(r => <span key={r} className="p-chip p-chip--on" style={{ pointerEvents: 'none' }}>{r}</span>)}
              </div>
            </section>
          )}

          {p.skills_needed?.length > 0 && (
            <section className="detail-section">
              <h2>Skills needed</h2>
              <div className="chip-cloud">
                {p.skills_needed.map(s => <span key={s} className="p-chip" style={{ pointerEvents: 'none' }}>{s}</span>)}
              </div>
            </section>
          )}

          {p.technologies?.length > 0 && (
            <section className="detail-section">
              <h2>Technologies</h2>
              <div className="chip-cloud">
                {p.technologies.map(t => <span key={t} className="rcard__tag">{t}</span>)}
              </div>
            </section>
          )}

          {(p.repo_url || p.demo_url) && (
            <section className="detail-section">
              <h2>Links</h2>
              <div className="prof-links">
                {p.repo_url && <a href={p.repo_url} target="_blank" rel="noreferrer noopener">Repository ↗</a>}
                {p.demo_url && <a href={p.demo_url} target="_blank" rel="noreferrer noopener">Live demo ↗</a>}
              </div>
            </section>
          )}

          {/* --- membership actions --- */}
          {!isOwner && user && (
            <section className="detail-section">
              <h2>{membership?.status === 'active' ? 'You are a member' : myRequest ? 'Your request' : 'Join this project'}</h2>

              {membership?.status === 'active' ? (
                <p style={{ fontSize: 13, color: 'var(--muted-on-dark)', marginBottom: 10 }}>
                  You joined as {membership.role}.
                </p>
              ) : myRequest ? (
                <p style={{ fontSize: 13, color: 'var(--muted-on-dark)', marginBottom: 10 }}>
                  Sent {fmtDate(myRequest.created_at)} — waiting for the owner to approve or reject.
                </p>
              ) : (
                <>
                  <TextArea rows={3} value={joinMessage} onChange={e => setJoinMessage(e.target.value)}
                    placeholder="Why do you want to join? (optional, 500 chars)" maxLength={500} />
                  <div style={{ marginTop: 10 }}>
                    <Button full disabled={busy} onClick={handleJoin}>Request to join</Button>
                  </div>
                </>
              )}

              {(myRequest || membership?.status === 'active') && (
                <div style={{ marginTop: 10 }}>
                  <Button variant="secondary" full disabled={busy}
                    onClick={() => act(
                      () => leaveProject(p.id, user.id),
                      myRequest ? 'Request withdrawn.' : 'You left the project.',
                    )}>
                    {myRequest ? 'Withdraw request' : 'Leave project'}
                  </Button>
                </div>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
