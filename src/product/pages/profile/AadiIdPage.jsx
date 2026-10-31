import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { profileToIdentity } from '../../../features/profile/adapters.js'
import { getPublicProfileUrl, shareProfile } from '../../../utils/identity.js'
import { Button, Badge, PageState } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   AADI ID — the student's shareable identity card.
   The QR encodes the real public profile URL; nothing on the card is
   decorative data. Flipping is a pure UI transform.
--------------------------------------------------------------------------- */

export default function AadiIdPage() {
  const { profile } = useAuth()
  const [flipped, setFlipped] = useState(false)
  const [shareMsg, setShareMsg] = useState('')

  if (!profile) {
    return <PageState title="Loading your AADI ID…" body="One moment." />
  }

  const identity = profileToIdentity(profile)
  const url = getPublicProfileUrl(profile.aadi_id)

  async function handleShare() {
    const result = await shareProfile(profile.aadi_id)
    setShareMsg(
      result === 'copied' ? 'Profile link copied to your clipboard.'
      : result === 'shared' ? 'Shared.'
      : 'Could not copy the link — copy it from the address bar instead.',
    )
  }

  return (
    <div className="idpage">
      <div className="page-head">
        <div>
          <h1 className="page-head__title">AADI ID</h1>
          <p className="page-head__sub">
            Your permanent student identity on AADI HUB. The QR code opens your public profile —
            only when your profile is public.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to={`/u/${profile.aadi_id}`} className="p-btn p-btn--secondary p-btn--md">Open public page</Link>
          <Button onClick={handleShare}>Share</Button>
        </div>
      </div>

      {shareMsg && (
        <div className="p-inline-success" style={{ marginBottom: 16, display: 'block' }}>{shareMsg}</div>
      )}

      {!profile.is_public && (
        <div className="p-inline-error" style={{ marginBottom: 16, display: 'block' }}>
          Your profile is currently restricted — people who scan this QR will see “Profile not available”
          until you switch it back to public in{' '}
          <Link to="/profile" style={{ color: 'var(--kiwi-400)' }}>My profile</Link>.
        </div>
      )}

      <div className="idcard-scene" style={{ maxWidth: 460, margin: '0 auto' }}>
        <button
          type="button"
          className={`idcard${flipped ? ' is-flipped' : ''}`}
          onClick={() => setFlipped(f => !f)}
          aria-label={flipped ? 'Show the front of your AADI ID' : 'Show the QR code on the back'}
          aria-pressed={flipped}
          style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}
        >
          <div className="idcard__face idcard__face--front">
            <div className="idcard__brand">
              <span className="idcard__brand-mark">◆</span> AADI HUB
              <Badge tone="kiwi">Student</Badge>
            </div>
            <p className="idcard__id">{profile.aadi_id}</p>
            <p className="idcard__name">{profile.full_name}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
              {[identity.education?.degree, profile.college].filter(Boolean).join(' · ') ||
                'Student at AADI HUB'}
            </p>
            <p className="idcard__hint">Tap to reveal QR →</p>
          </div>

          <div className="idcard__face idcard__face--back">
            <div className="idcard__back-qr">
              <QRCodeSVG value={url} size={132} bgColor="#0B1220" fgColor="#B5E84A" level="M" />
            </div>
            <div>
              <p className="idcard__back-id">{profile.aadi_id}</p>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, marginTop: 6, wordBreak: 'break-all' }}>
                {url}
              </p>
              <p className="idcard__hint">← Tap to flip back</p>
            </div>
          </div>
        </button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted-on-dark)', textAlign: 'center', marginTop: 24, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
        The AADI ID confirms a student account on this platform only. It is not a government,
        institutional or academic credential, and it carries no verification beyond “this account exists”.
      </p>
    </div>
  )
}
