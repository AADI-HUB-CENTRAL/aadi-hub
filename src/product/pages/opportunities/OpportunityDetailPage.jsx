import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import {
  fetchOpportunity, listMyBookmarkIds, addBookmark, removeBookmark,
  deleteOpportunity, opportunityTypeLabel, opportunityStatusLabel,
} from '../../../features/opportunities/opportunitiesApi.js'
import { Button, Badge, Spinner, PageState, InlineError } from '../../ui/kit.jsx'
import { deadlineState } from './OpportunitiesPage.jsx'

/* ---------------------------------------------------------------------------
   Opportunity detail — full listing facts, bookmark toggle, and the
   submitter's own pending submission (editable/deletable before review).
--------------------------------------------------------------------------- */

function fmtDate(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

export default function OpportunityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()

  const [opp, setOpp] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setState('loading')
    setError('')
    const { data, error: err } = await fetchOpportunity(id)
    if (err) {
      setState('error')
      setError('This opportunity could not be loaded. It may have been removed, or the database is unavailable.')
      return
    }
    if (!data) { setState('missing'); return }
    setOpp(data)
    setState('ready')

    if (user?.id) {
      const { data: ids } = await listMyBookmarkIds(user.id)
      setBookmarked((ids || []).includes(id))
    }
  }, [id, user?.id])

  useEffect(() => { load() }, [load])

  async function toggleBookmark() {
    if (busy || !user?.id) return
    setBusy(true)
    const fn = bookmarked ? removeBookmark : addBookmark
    const { error: err } = await fn(user.id, id)
    setBusy(false)
    if (err) { setError(err.message || 'Could not update the bookmark.'); return }
    setBookmarked(b => !b)
    toast.success(bookmarked ? 'Bookmark removed.' : 'Saved to your bookmarks.')
  }

  async function handleDelete() {
    if (!window.confirm('Delete this submission? A moderator has not published it.')) return
    setBusy(true)
    const { error: err } = await deleteOpportunity(id)
    setBusy(false)
    if (err) { setError(err.message || 'Could not delete the submission.'); return }
    toast.success('Submission deleted.')
    navigate('/opportunities', { replace: true })
  }

  if (state === 'loading') return <Spinner label="Loading opportunity…" />

  if (state === 'missing') {
    return (
      <PageState title="Opportunity not found."
        body="It may have been removed, or you followed a link to a submission that is not public."
        action={<Link to="/opportunities" className="p-btn p-btn--secondary p-btn--md">Back to opportunities</Link>} />
    )
  }

  if (state === 'error') {
    return (
      <PageState title="Could not load this opportunity." body={error}
        action={<button className="p-btn p-btn--primary p-btn--md" onClick={load}>Try again</button>} />
    )
  }

  const o = opp
  const dl = deadlineState(o.deadline)
  const mine = o.created_by === user?.id
  const past = dl.cls === 'is-past'
  const applyable = o.apply_url && !past && o.status === 'published'

  return (
    <div>
      <Link to="/opportunities" className="detail-back">← All opportunities</Link>

      <header className="detail-head">
        <div className="detail-head__row">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="info">{opportunityTypeLabel(o.type)}</Badge>
            {o.status !== 'published' && <Badge tone="warn">{opportunityStatusLabel(o.status)}</Badge>}
            {o.is_verified
              ? <Badge tone="kiwi">Verified</Badge>
              : o.status === 'published' && <Badge tone="neutral">Listed</Badge>}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {isAuthenticated && (
              <Button size="sm" variant={bookmarked ? 'primary' : 'secondary'} disabled={busy}
                onClick={toggleBookmark} aria-pressed={bookmarked}>
                {bookmarked ? 'Bookmarked ✓' : 'Bookmark'}
              </Button>
            )}
            {mine && o.status === 'pending' && (
              <Button size="sm" variant="danger" disabled={busy} onClick={handleDelete}>
                Delete submission
              </Button>
            )}
          </div>
        </div>
        <h1>{o.title}</h1>
        <div className="detail-head__meta">
          {o.organization && <span>{o.organization}</span>}
          {o.mode && <span>{o.mode === 'onsite' ? 'On-site' : o.mode[0].toUpperCase() + o.mode.slice(1)}</span>}
          {o.location && <span>{o.location}</span>}
          <span className={`opp-deadline ${dl.cls}`}>{dl.label}</span>
        </div>
      </header>

      {error && <div className="p-inline-error" style={{ marginBottom: 16 }}>{error}</div>}

      {o.status === 'pending' && (
        <div className="p-inline-success" style={{ marginBottom: 16 }}>
          {mine
            ? 'This is your submission. It is visible only to you and moderators until it is reviewed and published.'
            : 'This listing is awaiting moderator review.'}
        </div>
      )}

      <div className="detail-body">
        <div>
          {o.description && (
            <section className="detail-section">
              <h2>About this opportunity</h2>
              <p>{o.description}</p>
            </section>
          )}

          {o.eligibility && (
            <section className="detail-section">
              <h2>Eligibility</h2>
              <p>{o.eligibility}</p>
            </section>
          )}

          <section className="detail-section">
            <h2>Applying</h2>
            {applyable ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={o.apply_url} target="_blank" rel="noreferrer noopener"
                  className="p-btn p-btn--primary p-btn--md">
                  Apply on the official site ↗
                </a>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>
                {past
                  ? 'The deadline for this opportunity has passed.'
                  : !o.apply_url
                    ? 'No application link was provided with this listing. Check with the organisation directly.'
                    : 'Applications open when this listing is published.'}
              </p>
            )}
            <p style={{ fontSize: 12.5, color: 'var(--faint-on-dark)', marginTop: 12 }}>
              AADI HUB does not host applications or guarantee outcomes. Always verify details on the
              organisation’s own site before sharing personal information.
            </p>
          </section>
        </div>

        <aside className="detail-side">
          <section className="detail-section">
            <h2>Details</h2>
            <div className="kv">
              <div className="kv__row"><span className="kv__key">Type</span>
                <span className="kv__val">{opportunityTypeLabel(o.type)}</span></div>
              <div className="kv__row"><span className="kv__key">Mode</span>
                <span className="kv__val">{o.mode ? (o.mode === 'onsite' ? 'On-site' : o.mode[0].toUpperCase() + o.mode.slice(1)) : '—'}</span></div>
              <div className="kv__row"><span className="kv__key">Location</span>
                <span className="kv__val">{o.location || '—'}</span></div>
              <div className="kv__row"><span className="kv__key">Deadline</span>
                <span className="kv__val">{fmtDate(o.deadline)}</span></div>
              <div className="kv__row"><span className="kv__key">Posted</span>
                <span className="kv__val">{fmtDate(o.created_at)}</span></div>
              <div className="kv__row"><span className="kv__key">Status</span>
                <span className="kv__val">{opportunityStatusLabel(o.status)}</span></div>
            </div>
          </section>

          {o.organization && (
            <section className="detail-section">
              <h2>Organisation</h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>{o.organization}</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
