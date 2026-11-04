import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { BrandSymbol } from './Logo.jsx'

const MAX_TILT = 3.5

function DiamondIcon({ size = 13, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 3h11L21 9l-9 12L3 9z" fill="currentColor" opacity="0.92" />
      <path d="M3 9h18M9 3 6.5 9 12 21l5.5-12L15 3M6.5 9 12 21 17.5 9" stroke="rgba(20,14,4,0.35)" strokeWidth="1" />
    </svg>
  )
}

function SparkleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 1.8l1.7 6.2L20 9.7l-6.3 1.7L12 17.6l-1.7-6.2L4 9.7l6.3-1.7z"
        fill="currentColor"
      />
      <path d="M19 15.5l.7 2.6 2.6.7-2.6.7-.7 2.6-.7-2.6-2.6-.7 2.6-.7z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export default function TeamGoldIdCard({ member }) {
  const wrapRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const isFounding = Boolean(member.founding)
  const profileUrl = `${window.location.origin}/team/${member.slug}`

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

  const faceClass = `goldcard goldcard--face${isFounding ? ' goldcard--diamond' : ''}`

  return (
    <div
      className={`goldcard-flip${isFounding ? ' goldcard-flip--diamond' : ''}`}
      ref={wrapRef}
    >
      <div
        className={`goldcard-flip__inner${flipped ? ' is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setFlipped((f) => !f)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Show the front of the AADI ID card' : 'Show the back of the AADI ID card'}
        aria-pressed={flipped}
      >
        {/* ── FRONT ── */}
        <div className={`${faceClass} goldcard--front`}>
          <span className="goldcard__shine" aria-hidden="true" />
          <DiamondIcon size={190} className="goldcard__diamond-mark" />
          {isFounding && (
            <>
              <span className="goldcard__sparkle goldcard__sparkle--1" aria-hidden="true">
                <SparkleIcon size={15} />
              </span>
              <span className="goldcard__sparkle goldcard__sparkle--2" aria-hidden="true">
                <SparkleIcon size={11} />
              </span>
              <span className="goldcard__sparkle goldcard__sparkle--3" aria-hidden="true">
                <SparkleIcon size={13} />
              </span>
            </>
          )}

          <div className="goldcard__brand">
            <span className="goldcard__logo">
              <BrandSymbol size={26} />
              <img src="/AADI HUB LOGO.png" alt="AADI HUB" />
            </span>
            <span className="goldcard__badge">
              {isFounding ? <DiamondIcon size={11} /> : <i aria-hidden="true" />}
              {isFounding ? 'Diamond' : 'Premium'}
            </span>
          </div>

          <div className="goldcard__identity">
            <div className="goldcard__photo">
              <img src={member.img} alt={member.alt} draggable="false" />
            </div>
            <div className="goldcard__identity-copy">
              <h3 className="goldcard__name">{member.name}</h3>
              <p className="goldcard__role">{member.role} · AADI HUB</p>
              {isFounding && (
                <span className="goldcard__ribbon">
                  <DiamondIcon size={10} />
                  Founding Circle
                </span>
              )}
            </div>
          </div>

          <div className="goldcard__foot">
            <div className="goldcard__idline">
              <span className="goldcard__idlabel">AADI ID</span>
              <span className="goldcard__idnum">{member.chips[1]}</span>
            </div>
            <div className="goldcard__qr">
              <QRCodeSVG
                value={profileUrl}
                size={72}
                level="M"
                bgColor="#F7E8B5"
                fgColor="#0B111E"
              />
            </div>
          </div>

          <div className="goldcard__strip">
            <span>AADI HUB · Premium Identity</span>
            <span>{isFounding ? 'Diamond Member' : 'Gold Member'}</span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className={`${faceClass} goldcard--back`}>
          <span className="goldcard__shine" aria-hidden="true" />
          <DiamondIcon size={190} className="goldcard__diamond-mark" />

          <div className="goldcard__brand">
            <span className="goldcard__logo">
              <BrandSymbol size={26} />
              <img src="/AADI HUB LOGO.png" alt="AADI HUB" />
            </span>
            <span className="goldcard__badge">
              {isFounding ? <DiamondIcon size={11} /> : <i aria-hidden="true" />}
              {isFounding ? 'Diamond' : 'Premium'}
            </span>
          </div>

          <div className="goldcard__back-fields">
            <div className="goldcard__back-field">
              <span className="goldcard__back-label">Full Name</span>
              <span className="goldcard__back-value">{member.name}</span>
            </div>
            <div className="goldcard__back-field">
              <span className="goldcard__back-label">Role</span>
              <span className="goldcard__back-value">{member.role} · AADI HUB</span>
            </div>
            <div className="goldcard__back-field">
              <span className="goldcard__back-label">Focus</span>
              <span className="goldcard__back-value">{member.focus.join(' · ')}</span>
            </div>
            <div className="goldcard__back-field">
              <span className="goldcard__back-label">AADI ID</span>
              <span className="goldcard__back-value">{member.chips[1]}</span>
            </div>
            <div className="goldcard__back-field">
              <span className="goldcard__back-label">Membership</span>
              <span className="goldcard__back-value goldcard__back-value--gold">
                {isFounding ? 'Founding Circle' : 'Core Team'}
              </span>
            </div>
          </div>

          <div className="goldcard__strip">
            <span>AADI HUB · Verified Preview</span>
            <span>{isFounding ? 'Diamond Identity' : 'Digital Identity'}</span>
          </div>
        </div>
      </div>

      <p className="goldcard-flip__hint">
        {flipped ? '← Click to see front' : 'Click to flip →'}
      </p>
    </div>
  )
}
