import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import { fetchProfileByAadiId } from '../../../features/profile/profileApi.js'
import { listProjectsByOwner } from '../../../features/projects/projectsApi.js'
import { shareProfile } from '../../../utils/identity.js'
import { ProductLogo, Spinner, PageState } from '../../ui/kit.jsx'
import ProfileView from './ProfileView.jsx'

/* ---------------------------------------------------------------------------
   Public profile — the same LinkedIn-style view as My profile, read-only.
   A null result means "not available"; we never reveal whether the row is
   missing or private.
--------------------------------------------------------------------------- */

export default function PublicProfilePage() {
  const { aadiId } = useParams()
  const { profile: viewer } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
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

    const { data: owned } = await listProjectsByOwner(data.id, { limit: 12 })
    setProjects(owned || [])
  }, [aadiId])

  useEffect(() => { load() }, [load])

  async function handleShare() {
    const result = await shareProfile(aadiId)
    if (result === 'copied') toast.success('Profile link copied to clipboard.')
    else if (result === 'failed') toast.error('Could not copy the link. Copy it from the address bar.')
  }

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
        <PageState
          title="Could not load this profile."
          body={msg}
          action={<button className="p-btn p-btn--primary p-btn--md" onClick={load}>Try again</button>}
        />
      </div>
    )
  }

  const isViewerOwner = Boolean(viewer && viewer.id === profile.id)

  return (
    <div className="p-container" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="lp-public-top">
        <Link to="/" aria-label="AADI HUB home"><ProductLogo symbol={26} size={17} /></Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={handleShare}>
            Share profile
          </button>
          {isViewerOwner ? (
            <Link to="/profile" className="p-btn p-btn--primary p-btn--sm">Edit my profile</Link>
          ) : (
            <Link to={viewer ? '/dashboard' : '/login'} className="p-btn p-btn--ghost p-btn--sm">
              {viewer ? 'Open AADI HUB' : 'Sign in'}
            </Link>
          )}
        </div>
      </div>

      <ProfileView
        profile={profile}
        isOwner={false}
        viewerIsOwner={isViewerOwner}
        projects={projects}
        onShare={handleShare}
      />
    </div>
  )
}
