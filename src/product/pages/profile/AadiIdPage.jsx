import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import { profileToIdentity } from '../../../features/profile/adapters.js'
import { getPublicProfileUrl, shareProfile } from '../../../utils/identity.js'
import AadiIdCard from '../../../components/AadiIdCard.jsx'
import { ArrowUpRight, LinkIcon, Share } from '../../../components/ui/Icons.jsx'
import { PageState } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   AADI ID - the student's shareable identity card.

   The page is intentionally just the card: no marketing copy, no bio panel
   and no duplicate actions. The card reads live profile data, so edits made
   in My profile show up here immediately.
--------------------------------------------------------------------------- */

export default function AadiIdPage() {
  const { profile } = useAuth()
  const toast = useToast()

  if (!profile) {
    return <PageState title="Loading your AADI ID..." body="One moment." />
  }

  const identity = profileToIdentity(profile)
  const url = getPublicProfileUrl(profile.aadi_id)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Profile link copied to your clipboard.')
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar instead.')
    }
  }

  async function handleShare() {
    const result = await shareProfile(profile.aadi_id)
    if (result === 'copied') toast.success('Profile link copied to your clipboard.')
    else if (result === 'shared') toast.success('AADI ID shared.')
    else toast.error('Could not share the link. Copy it from the address bar instead.')
  }

  return (
    <div className="idpage">
      <div className="idpage__card">
        <AadiIdCard
          name={identity.fullName}
          domain={identity.domain}
          headline={identity.headline}
          aadiId={identity.aadiId}
          profilePhoto={identity.profilePhoto}
          createdAt={identity.createdAt}
          college={identity.college}
          location={identity.location}
          ageRange={identity.ageRange}
          education={identity.education}
        />
      </div>

      <div className="idpage__actions" aria-label="AADI ID actions">
        <button type="button" className="idpage__action" onClick={handleCopy}>
          <LinkIcon size={14} />
          Copy link
        </button>
        <button type="button" className="idpage__action" onClick={handleShare}>
          <Share size={14} />
          Share
        </button>
        <Link className="idpage__action" to={`/u/${profile.aadi_id}`}>
          <ArrowUpRight size={14} />
          Public profile
        </Link>
      </div>

      {!profile.is_public && (
        <p className="idpage__notice" role="status">
          Your profile is private, so the QR code shows "Profile not available" until you make it public.
        </p>
      )}

      <p className="idpage__note">
        The AADI ID confirms a student account on this platform only. It is not a government,
        institutional or academic credential.
      </p>
    </div>
  )
}
