import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProfileByAadiId, publicMediaUrl } from '../../../features/profile/profileApi.js'
import { shareProfile } from '../../../utils/identity.js'
import { ProductLogo, Avatar, Badge, Spinner, PageState, Button } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Public profile — readable without an account when is_public is true.
   A null result means "not available" (missing OR private — RLS decides);
   we never reveal which.
--------------------------------------------------------------------------- */

const SKILL_LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced']

export default function PublicProfilePage() {
  const { aadiId } = useParams()
  const [profile, setProfile] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | missing | error
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setState('loading')
    setMsg('')
    const { data, error } = await fetchProfileByAadiId(aadiId)
    if (error) {
      setState('error')
      setMsg('This profile could not be loaded right now. The database may be unavailable.')
      return
    }
    if (!data) { setState('missing'); return }
    setProfile(data)
    setState('ready')
  }, [aadiId])

  useEffect(() => { load() }, [load])

  if (state === 'loading') return <Spinner label="Loading profile…" />

  if (state === 'missing') {
    return (
      <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <PageState
          title="Profile not available."
          body="This AADI ID does not exist, or the student has set their profile to restricted."
          action={<Link to="/" className="p-btn p-btn--secondary p-btn--md">Back to AADI HUB</Link>}
        />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <PageState title="Could not load this profile." body={msg}
          action={<button className="p-btn p-btn--primary p-btn--md" onClick={load}>Try again</button>} />
      </div>
    )
  }

  const p = profile
  const avatar = publicMediaUrl(p.avatar_path)
  const skills = [...(p.skills || [])]
    .sort((a, b) => SKILL_LEVEL_ORDER.indexOf(p.skill_levels?.[b] || 'Beginner') - SKILL_LEVEL_ORDER.indexOf(p.skill_levels?.[a] || 'Beginner'))
  const links = [
    { label: 'GitHub', url: p.github_url },
    { label: 'Portfolio', url: p.portfolio_url },
    { label: 'LinkedIn', url: p.linkedin_url },
  ].filter(l => l.url)

  async function handleShare() {
    const result = await shareProfile(p.aadi_id)
    if (result === 'copied') window.alert('Profile link copied to clipboard.')
    else if (result === 'failed') window.alert('Could not copy the link. Copy it from the address bar.')
  }

  return (
    <div className="p-container" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={26} size={17} /></Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={handleShare}>Share profile</Button>
          <Link to="/login" className="p-btn p-btn--ghost p-btn--sm">Sign in</Link>
        </div>
      </nav>

      <div className="p-card p-card--flush" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div className="prof-cover prof-cover--kiwi" />
        <div className="prof-head">
          <div className="prof-head__id">
            <div className="prof-head__avatar">
              <Avatar src={avatar} name={p.full_name} size={96} />
            </div>
            <div>
              <h1 className="prof-head__name">{p.full_name}</h1>
              <p className="prof-head__aid">{p.aadi_id}</p>
              {p.headline && <p className="prof-head__headline">{p.headline}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {p.roles?.map(r => <Badge key={r} tone="neutral">{r}</Badge>)}
            {p.is_public === false && <Badge tone="warn">Restricted</Badge>}
          </div>
        </div>
      </div>

      <div className="prof-body">
        <div>
          {p.bio && (
            <section className="prof-section">
              <h2>About</h2>
              <p>{p.bio}</p>
            </section>
          )}

          {(p.college || p.course || p.study_year || p.graduation_year) && (
            <section className="prof-section">
              <h2>Education</h2>
              <p>
                {[p.course, p.department].filter(Boolean).join(', ')}
                {p.study_year ? ` · ${p.study_year}` : ''}
                <br />
                {[p.college, p.graduation_year ? `Graduating ${p.graduation_year}` : ''].filter(Boolean).join(' · ')}
                {p.location ? <><br />{p.location}</> : null}
              </p>
            </section>
          )}

          {skills.length > 0 && (
            <section className="prof-section">
              <h2>Skills <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(self-reported)</span></h2>
              <div>
                {skills.map(s => (
                  <div className="skill-line" key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border-dark)' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{s}</span>
                    <span className="skill-line__level">{p.skill_levels?.[s] || 'Beginner'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(p.interests?.length > 0 || p.goals?.length > 0) && (
            <section className="prof-section">
              <h2>Interests &amp; goals</h2>
              <div className="chip-cloud">
                {[...p.goals, ...p.interests].map(x => (
                  <span key={x} className="p-chip" style={{ pointerEvents: 'none' }}>{x}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          {p.looking_for && (
            <section className="prof-section">
              <h2>Looking for</h2>
              <p>{p.looking_for}</p>
            </section>
          )}

          {p.collab_prefs?.length > 0 && (
            <section className="prof-section">
              <h2>Open to</h2>
              <div className="chip-cloud">
                {p.collab_prefs.map(c => (
                  <span key={c} className="p-chip" style={{ pointerEvents: 'none' }}>{c}</span>
                ))}
              </div>
            </section>
          )}

          {links.length > 0 && (
            <section className="prof-section">
              <h2>Links</h2>
              <div className="prof-links">
                {links.map(l => (
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer noopener">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="prof-section">
            <h2>AADI ID</h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted-on-dark)' }}>
              {p.aadi_id} · issued by AADI HUB. Verified student identity on this platform only —
              it is not a government credential.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
