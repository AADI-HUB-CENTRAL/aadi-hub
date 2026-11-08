import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { BrandSymbol } from '../Logo.jsx'
import { useDiwaliCampaign } from './DiwaliCampaignController.jsx'
import DiwaliWishesBackdrop from './DiwaliWishesBackdrop.jsx'
import DiwaliNameForm from './DiwaliNameForm.jsx'
import DiwaliRocketScene from './DiwaliRocketScene.jsx'
import DiwaliGrandFireworks from './DiwaliGrandFireworks.jsx'
import DiwaliGreetingReveal from './DiwaliGreetingReveal.jsx'
import DiwaliShareDialog from './DiwaliShareDialog.jsx'
import { DiwaliMusicButton } from './DiwaliMusicController.jsx'
import { Rangoli } from './DiwaliHeroDecorations.jsx'
import { primeDiwaliAudio, playDiwaliLaunch, playDiwaliExplosion } from '../../lib/diwaliSound.js'
import {
  createCelebrationId,
  saveDiwaliCelebration,
} from '../../lib/diwaliCelebrations.js'
import '../../styles/diwali-wishes.css'

const HERO_SPARKLES = [
  { left: '9%', top: '26%', size: 7, duration: 5.2, delay: 0.2 },
  { left: '22%', top: '16%', size: 5, duration: 4.4, delay: 1.6 },
  { left: '36%', top: '34%', size: 6, duration: 6.1, delay: 2.8 },
  { left: '64%', top: '20%', size: 5, duration: 4.8, delay: 0.9 },
  { left: '79%', top: '31%', size: 7, duration: 5.7, delay: 3.4 },
  { left: '91%', top: '18%', size: 5, duration: 4.2, delay: 2.1 },
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setReduced(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

export default function DiwaliWishesPage() {
  const active = useDiwaliCampaign()
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState('intro')
  const [name, setName] = useState('')
  const [runId, setRunId] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [showFinale, setShowFinale] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [ownCelebration, setOwnCelebration] = useState(null)
  const [celebrationRefreshKey, setCelebrationRefreshKey] = useState(0)
  const shakeTimer = useRef(0)
  const celebrationIdRef = useRef('')
  const savedCelebrationRef = useRef('')

  useEffect(() => {
    if (!active) return undefined

    const previousTitle = document.title
    document.title = 'Happy Diwali · AADI HUB'
    return () => {
      document.title = previousTitle
    }
  }, [active])

  useEffect(() => {
    if (phase !== 'scene') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'reveal') {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    }
  }, [phase, reducedMotion])

  useEffect(() => {
    return () => window.clearTimeout(shakeTimer.current)
  }, [])

  if (!active) {
    return <Navigate to="/" replace />
  }

  const saveCelebration = (enteredName) => {
    const celebrationId =
      celebrationIdRef.current || createCelebrationId()

    celebrationIdRef.current = celebrationId

    if (savedCelebrationRef.current === celebrationId) return

    savedCelebrationRef.current = celebrationId

    saveDiwaliCelebration(enteredName, celebrationId)
      .then((result) => {
        // Keep the visitor's name visible even when the network is offline:
        // the celebration is cached on the device and synced on a later visit.
        if (result.entry) {
          setOwnCelebration(result.entry)
        }

        if (
          result.entry &&
          (!result.error || result.duplicate || result.localOnly)
        ) {
          setCelebrationRefreshKey((value) => value + 1)
        } else {
          setOwnCelebration(null)
          savedCelebrationRef.current = ''
        }
      })
      .catch(() => {
        setOwnCelebration(null)
        savedCelebrationRef.current = ''
      })
  }

  const handleCelebrate = (enteredName) => {
    setName(enteredName)
    setShowFinale(false)
    setShaking(false)
    setOwnCelebration(null)
    celebrationIdRef.current = createCelebrationId()
    savedCelebrationRef.current = ''
    setPhase('scene')
    setRunId((value) => value + 1)
    if (soundOn) primeDiwaliAudio()
  }

  const handleLaunch = () => {
    if (soundOn) playDiwaliLaunch()
  }

  const handleExplode = () => {
    if (soundOn) playDiwaliExplosion()

    if (reducedMotion) return

    setShowFinale(true)
    setShaking(true)
    window.clearTimeout(shakeTimer.current)
    shakeTimer.current = window.setTimeout(() => setShaking(false), 650)

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(55)
    }
  }

  const handleComplete = () => {
    setPhase('reveal')
    saveCelebration(name)
  }

  const handleReplay = () => {
    setShowFinale(false)
    setShaking(false)
    setShareOpen(false)
    setPhase('scene')
    setRunId((value) => value + 1)
    if (soundOn) primeDiwaliAudio()
  }

  const handleShare = () => {
    setShareOpen(true)
  }

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    if (next) primeDiwaliAudio()
  }

  return (
    <div className="dw-experience">
      <DiwaliWishesBackdrop />

      <header className="dw-topbar">
        <Link className="dw-brand" to="/" aria-label="AADI HUB home">
          <BrandSymbol size={28} />
          <span>AADI HUB</span>
        </Link>

        <div className="dw-topbar__actions">
          <DiwaliMusicButton
            className="dw-sound dw-topbar__music"
            showLabel={false}
          />

          <button
            className={`dw-sound${soundOn ? ' is-on' : ''}`}
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 9v6h4l5 4V5L8 9H4Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              {soundOn ? (
                <path
                  d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="m16.5 9 5 6M21.5 9l-5 6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>
      </header>

      <div className={`dw-shell${shaking ? ' is-shaking' : ''}`}>
        {phase === 'intro' && (
          <main className="dw-intro">
            <div className="dw-intro__mandala" aria-hidden="true">
              <Rangoli className="dw-intro__rangoli" />
            </div>

            <div className="dw-intro__sparkles" aria-hidden="true">
              {HERO_SPARKLES.map((sparkle, index) => (
                <span
                  key={index}
                  className="dw-intro__sparkle"
                  style={{
                    left: sparkle.left,
                    top: sparkle.top,
                    '--s': `${sparkle.size}px`,
                    '--dur': `${sparkle.duration}s`,
                    '--delay': `${sparkle.delay}s`,
                  }}
                />
              ))}
            </div>

            <div className="dw-intro__inner">
              <p className="dw-intro__eyebrow">AADI HUB &middot; FESTIVE EDITION 2026</p>
              <h1 className="dw-intro__title">
                Let&apos;s Celebrate the <em>Festival of Lights!</em>
              </h1>
              <p className="dw-intro__lead">
                A little celebration, a little surprise, and a special wish just
                for you.
              </p>

              <div className="dw-intro__card">
                <DiwaliNameForm onSubmit={handleCelebrate} />
              </div>

              <p className="dw-intro__note">
                A tiny interactive Diwali movie, made with warmth by AADI HUB.
              </p>
            </div>
          </main>
        )}

        {phase === 'scene' && (
          <div className="dw-stage">
            <DiwaliRocketScene
              key={runId}
              name={name}
              reducedMotion={reducedMotion}
              onLaunch={handleLaunch}
              onExplode={handleExplode}
              onComplete={handleComplete}
            />
          </div>
        )}

        {phase === 'reveal' && (
          <main className="dw-reveal-wrap">
            <DiwaliGreetingReveal
              name={name}
              onReplay={handleReplay}
              onShare={handleShare}
              ownCelebration={ownCelebration}
              celebrationRefreshKey={celebrationRefreshKey}
            />
          </main>
        )}

        {showFinale && (
          <DiwaliGrandFireworks onDone={() => setShowFinale(false)} />
        )}
      </div>

      {shareOpen && (
        <DiwaliShareDialog name={name} onClose={() => setShareOpen(false)} />
      )}
    </div>
  )
}
