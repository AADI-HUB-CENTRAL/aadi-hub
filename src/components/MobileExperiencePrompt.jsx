import { useEffect, useRef, useState } from 'react'
import { BrandSymbol } from './Logo.jsx'

const SESSION_KEY = 'aadi_mobile_continue'
const MOBILE_QUERY = '(max-width: 768px)'

function getSessionFlag() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

function setSessionFlag() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, 'true')
  } catch {
    /* storage unavailable — ignore */
  }
}

function isMobileViewport() {
  try {
    if (window.matchMedia) return window.matchMedia(MOBILE_QUERY).matches
    return window.innerWidth <= 768
  } catch {
    return false
  }
}

export default function MobileExperiencePrompt() {
  const [open, setOpen] = useState(() => !getSessionFlag() && isMobileViewport())
  const [panel, setPanel] = useState('intro')
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [siteUrl] = useState(() => window.location.href)
  const cardRef = useRef(null)
  const primaryRef = useRef(null)
  const openRef = useRef(open)
  const copyTimerRef = useRef(null)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => {
      if (e.matches) {
        if (!openRef.current && !getSessionFlag()) setOpen(true)
      } else if (openRef.current) {
        setOpen(false)
        setPanel('intro')
      }
    }
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else if (mq.addListener) mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else if (mq.removeListener) mq.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prevBody = document.body.style.overflow
    const prevDoc = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevDoc
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      if (panel === 'desktop') {
        const el = cardRef.current && cardRef.current.querySelector('[data-prompt-focus]')
        if (el) el.focus()
      } else if (primaryRef.current) {
        primaryRef.current.focus()
      }
    }, 60)
    return () => clearTimeout(t)
  }, [open, panel])

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
  }, [])

  const dismiss = () => {
    setSessionFlag()
    setOpen(false)
    setPanel('intro')
    setCopied(false)
    setCopyFailed(false)
  }

  const showDesktopPanel = () => {
    setPanel('desktop')
    setCopied(false)
    setCopyFailed(false)
  }

  const copyLink = async () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    setCopyFailed(false)
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setCopyFailed(true)
      return
    }
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopyFailed(true)
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dismiss()
        return
      }
      if (e.key === 'Tab') {
        const card = cardRef.current
        if (!card) return
        const items = card.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, panel])

  if (!open) return null

  return (
    <div
      className="aadi-mobile-prompt"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aadi-mobile-prompt-title"
    >
      <div className="aadi-mobile-prompt__card" ref={cardRef}>
        {panel === 'intro' ? (
          <>
            <div className="aadi-mobile-prompt__logo" aria-hidden="true">
              <BrandSymbol size={34} />
              <span className="aadi-mobile-prompt__logotype">
                AADI <b>HUB</b>
              </span>
            </div>
            <p className="aadi-mobile-prompt__eyebrow">Desktop-optimized showcase</p>
            <h1 className="aadi-mobile-prompt__title" id="aadi-mobile-prompt-title">
              Experience AADI HUB on a bigger screen.
            </h1>
            <p className="aadi-mobile-prompt__description">
              The AADI HUB showcase is designed to give you the full experience on desktop — from the ecosystem
              visuals and interactive cards to the complete AADI journey.
            </p>
            <p className="aadi-mobile-prompt__note">AADI HUB is currently optimized for desktop.</p>
            <div className="aadi-mobile-prompt__actions">
              <button type="button" ref={primaryRef} className="aadi-mobile-prompt__primary" onClick={showDesktopPanel}>
                View in Desktop Mode
              </button>
              <button type="button" className="aadi-mobile-prompt__secondary" onClick={dismiss}>
                Continue on Mobile <span className="aadi-mobile-prompt__arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <p className="aadi-mobile-prompt__foot">Best experienced on laptop or desktop.</p>
          </>
        ) : (
          <>
            <div className="aadi-mobile-prompt__logo" aria-hidden="true">
              <BrandSymbol size={34} />
              <span className="aadi-mobile-prompt__logotype">
                AADI <b>HUB</b>
              </span>
            </div>
            <h2 className="aadi-mobile-prompt__subtitle" id="aadi-mobile-prompt-title">
              Open AADI HUB on desktop
            </h2>
            <p className="aadi-mobile-prompt__description">
              For the full showcase experience, open AADI HUB on a laptop or desktop.
            </p>
            <ol className="aadi-mobile-prompt__steps">
              <li>
                <span aria-hidden="true">1</span> Copy the website link below
              </li>
              <li>
                <span aria-hidden="true">2</span> Open it on your laptop or desktop
              </li>
            </ol>
            <div className="aadi-mobile-prompt__url" dir="ltr">
              {siteUrl}
            </div>
            <div className="aadi-mobile-prompt__actions">
              <button type="button" data-prompt-focus className="aadi-mobile-prompt__primary" onClick={copyLink}>
                {copied ? 'Link copied' : 'Copy Link'}
              </button>
              <p className="aadi-mobile-prompt__copy-status" role="status" aria-live="polite">
                {copied ? 'Link copied' : copyFailed ? 'Copy the link above manually.' : ''}
              </p>
              <button type="button" className="aadi-mobile-prompt__secondary" onClick={dismiss}>
                Continue on Mobile <span className="aadi-mobile-prompt__arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <p className="aadi-mobile-prompt__foot">Best experienced on laptop or desktop.</p>
          </>
        )}
      </div>
    </div>
  )
}
