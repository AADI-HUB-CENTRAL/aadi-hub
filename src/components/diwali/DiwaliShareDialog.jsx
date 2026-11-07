import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildDiwaliGreeting,
  copyToClipboard,
  diwaliCardFileName,
  renderDiwaliCard,
} from '../../lib/diwaliShare.js'

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.94)
    } catch {
      resolve(null)
    }
  })
}

export default function DiwaliShareDialog({ name, onClose }) {
  const canvasRef = useRef(null)
  const closeButtonRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const [cardDataUrl, setCardDataUrl] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const greeting = useMemo(() => {
    try {
      return buildDiwaliGreeting(name)
    } catch {
      return ''
    }
  }, [name])

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!greeting) return undefined

    const canvas = renderDiwaliCard(name)
    canvasRef.current = canvas

    if (canvas) {
      try {
        setCardDataUrl(canvas.toDataURL('image/png'))
      } catch {
        setCardDataUrl('')
      }
    }

    return () => {
      canvasRef.current = null
    }
  }, [greeting, name])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handleShare = async () => {
    if (!greeting || busy) return

    setBusy(true)
    setStatus('')

    try {
      const supportsShare =
        typeof navigator !== 'undefined' && typeof navigator.share === 'function'

      if (supportsShare && canvasRef.current) {
        const blob = await canvasToBlob(canvasRef.current)

        if (blob) {
          const file = new File([blob], diwaliCardFileName(name), {
            type: 'image/png',
          })
          const canShareFile =
            typeof navigator.canShare === 'function' &&
            navigator.canShare({ files: [file] })

          if (canShareFile) {
            try {
              await navigator.share({
                title: 'Happy Diwali from AADI HUB',
                text: greeting,
                files: [file],
              })
              setStatus('Your personalised Diwali card is ready to share.')
              return
            } catch (error) {
              if (error?.name === 'AbortError') return
              // Fall through to text sharing, then copying.
            }
          }
        }
      }

      if (supportsShare) {
        try {
          await navigator.share({
            title: 'Happy Diwali from AADI HUB',
            text: greeting,
          })
          setStatus('Your Diwali wishes are ready to share.')
          return
        } catch (error) {
          if (error?.name === 'AbortError') return
        }
      }

      const copied = await copyToClipboard(greeting)
      setStatus(
        copied
          ? 'Your Diwali wishes were copied. Paste them anywhere to share.'
          : 'Sharing is not available in this browser. Use Copy Wishes below.'
      )
    } finally {
      setBusy(false)
    }
  }

  const handleWhatsApp = async () => {
    if (!greeting) return

    const url = `https://wa.me/?text=${encodeURIComponent(greeting)}`
    const popup = window.open(url, '_blank', 'noopener,noreferrer')

    if (popup) {
      setStatus('Opening WhatsApp with your Diwali wishes.')
      return
    }

    const copied = await copyToClipboard(greeting)
    setStatus(
      copied
        ? 'WhatsApp could not open, so your wishes were copied instead.'
        : 'WhatsApp could not open. Please allow pop-ups and try again.'
    )
  }

  const handleCopy = async () => {
    if (!greeting) return

    const copied = await copyToClipboard(greeting)
    setStatus(
      copied
        ? 'Your Diwali wishes were copied to the clipboard.'
        : 'Copying is not available in this browser.'
    )
  }

  const handleDownload = () => {
    if (!cardDataUrl) return

    const link = document.createElement('a')
    link.href = cardDataUrl
    link.download = diwaliCardFileName(name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setStatus('Your Diwali card has been downloaded.')
  }

  return (
    <div
      className="dw-share"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dw-share-title"
      aria-describedby="dw-share-note"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current?.()
        }
      }}
    >
      <div className="dw-share__panel">
        <button
          className="dw-share__close"
          type="button"
          onClick={() => onCloseRef.current?.()}
          aria-label="Close sharing dialog"
          ref={closeButtonRef}
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <header className="dw-share__head">
          <span className="dw-share__eyebrow">AADI HUB &middot; Festival of Lights</span>
          <h2 className="dw-share__title" id="dw-share-title">
            Share Your Diwali Wishes
          </h2>
          <p className="dw-share__subtitle" id="dw-share-note">
            A personalised card for {name}, made with warmth by AADI HUB.
          </p>
        </header>

        <div className="dw-share__body">
          <div className="dw-share__preview">
            {cardDataUrl ? (
              <img
                className="dw-share__image"
                src={cardDataUrl}
                alt={`Personalised Diwali greeting card for ${name}`}
                width="1080"
                height="1350"
              />
            ) : (
              <div className="dw-share__preview-loading" role="status">
                Preparing your Diwali card&hellip;
              </div>
            )}
          </div>

          <div className="dw-share__content">
            <div className="dw-share__message" tabIndex={0}>
              {greeting}
            </div>

            <div className="dw-share__actions">
              <button
                className="dw-btn dw-btn--gold"
                type="button"
                onClick={handleShare}
                disabled={busy || !greeting}
              >
                {busy ? 'Preparing…' : 'Share Card'}
              </button>
              <button
                className="dw-btn dw-btn--outline"
                type="button"
                onClick={handleWhatsApp}
                disabled={!greeting}
              >
                Share on WhatsApp
              </button>
              <button
                className="dw-btn dw-btn--outline"
                type="button"
                onClick={handleCopy}
                disabled={!greeting}
              >
                Copy Wishes
              </button>
              <button
                className="dw-btn dw-btn--ghost"
                type="button"
                onClick={handleDownload}
                disabled={!cardDataUrl}
              >
                Download Card
              </button>
            </div>

            <p className="dw-share__status" role="status" aria-live="polite">
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
