import { useRef, useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { BrandSymbol } from './Logo.jsx'
import { getInitials, getPublicProfileUrl } from '../utils/identity.js'

const MAX_TILT = 3.5

export default function AadiIdCard({ name, domain, aadiId, profilePhoto, createdAt, college, location, ageRange, headline, education }) {
  const wrapRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [scan, setScan] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - py) * MAX_TILT * 2).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', '0deg')
        el.style.setProperty('--ry', '0deg')
      })
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleFlip = (e) => {
    if (e.target.closest('.idcard__qrbox')) return
    setFlipped(f => !f)
  }

  const handleScan = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setScan(n => n + 1)
  }

  const initials = getInitials(name)
  const profileUrl = getPublicProfileUrl(aadiId)
  const memberDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <div className="idcard-flip" ref={wrapRef}>
      <div
        className={`idcard-flip__inner${flipped ? ' is-flipped' : ''}`}
        onClick={handleFlip}
      >
        {/* ── FRONT ── */}
        <div className="idcard idcard--face idcard--front">
          <BrandSymbol className="idcard__watermark" size={240} />

          <div className="idcard__brand">
            <span className="idcard__logo">
              <BrandSymbol size={26} />
              <img
                src="/AADI HUB LOGO.png"
                alt="AADI HUB"
                className="idcard__logo-img"
              />
            </span>
            <span className="idcard__badge">DIGITAL ID</span>
          </div>

          <div className="idcard__identity">
            <div className={`idcard__photo${profilePhoto ? '' : ' idcard__photo--initials'}`}>
              {profilePhoto ? (
                <img src={profilePhoto} alt={name} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <h3 className="idcard__name">{name}</h3>
            <p className="idcard__role">{(headline && headline.trim()) ? headline : (domain ? `${domain} · Builder` : 'AADI Member')}</p>
          </div>

          <div className="idcard__foot">
            <div className="idcard__idline">
              <span className="idcard__idlabel">AADI ID</span>
              <span className="idcard__idnum">{aadiId}</span>
            </div>
            <div className="idcard__qrbox" onClick={handleScan}>
              <div className="idcard__qr">
                <span
                  key={scan}
                  className={`idcard__scan${scan > 0 ? ' is-active' : ''}`}
                  aria-hidden="true"
                  onAnimationEnd={() => setScan(0)}
                />
                <QRCodeSVG
                  value={profileUrl}
                  size={72}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#0B111E"
                />
              </div>
              <span className="idcard__qrtext">Scan to discover</span>
            </div>
          </div>

          <div className="idcard__strip">
            <span>AADI HUB · Digital Identity</span>
            <span>AADI MEMBER</span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="idcard idcard--face idcard--back">
          <BrandSymbol className="idcard__watermark" size={240} />

          <div className="idcard__brand">
            <span className="idcard__logo">
              <BrandSymbol size={26} />
              <img
                src="/AADI HUB LOGO.png"
                alt="AADI HUB"
                className="idcard__logo-img"
              />
            </span>
            <span className="idcard__badge">Digital ID</span>
          </div>

          <div className="idcard__back-fields">
            <div className="idcard__back-field">
              <span className="idcard__back-label">Full Name</span>
              <span className="idcard__back-value">{name}</span>
            </div>
            {college && (
              <div className="idcard__back-field">
                <span className="idcard__back-label">College / School</span>
                <span className="idcard__back-value">{college}</span>
              </div>
            )}
            {education?.degree && (
              <div className="idcard__back-field">
                <span className="idcard__back-label">Degree / Program</span>
                <span className="idcard__back-value">{education.degree}</span>
              </div>
            )}
            {education?.year && (
              <div className="idcard__back-field">
                <span className="idcard__back-label">Year</span>
                <span className="idcard__back-value">{education.year}</span>
              </div>
            )}
            <div className="idcard__back-field">
              <span className="idcard__back-label">Domain</span>
              <span className="idcard__back-value">{domain}</span>
            </div>
            {location && (
              <div className="idcard__back-field idcard__back-field--row">
                <div className="idcard__back-field">
                  <span className="idcard__back-label">Location</span>
                  <span className="idcard__back-value">{location}</span>
                </div>
                {ageRange && (
                  <div className="idcard__back-field">
                    <span className="idcard__back-label">Age</span>
                    <span className="idcard__back-value">{ageRange}</span>
                  </div>
                )}
              </div>
            )}
            <div className="idcard__back-field">
              <span className="idcard__back-label">Member Since</span>
              <span className="idcard__back-value">{memberDate}</span>
            </div>
          </div>

          <div className="idcard__back-idline">
            <span className="idcard__idlabel">AADI ID</span>
            <span className="idcard__idnum">{aadiId}</span>
          </div>

          <div className="idcard__strip">
            <span>AADI HUB · Digital Identity</span>
            <span>Verified through AADI HUB</span>
          </div>
        </div>
      </div>

      <p className="idcard-flip__hint">
        {flipped ? '← Click to see front' : 'Click to flip →'}
      </p>
    </div>
  )
}
