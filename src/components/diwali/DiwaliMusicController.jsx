import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { useDiwaliCampaign } from './DiwaliCampaignController.jsx'

const MUSIC_SRC = '/diwalisong.mp3'
const MUSIC_VOLUME = 0.36
const MUSIC_ROUTES = new Set(['/', '/diwali-wishes', '/team', '/form'])
const MUSIC_PROMPT_KEY = 'aadi_diwali_music_prompt_seen'
const MOBILE_QUERY = '(max-width: 768px)'

function isMusicRoute(pathname) {
  return (
    MUSIC_ROUTES.has(pathname) ||
    pathname.startsWith('/team/') ||
    pathname.startsWith('/explore/')
  )
}

function readMusicPromptSeen() {
  try {
    return window.sessionStorage.getItem(MUSIC_PROMPT_KEY) === 'true'
  } catch {
    return false
  }
}

function markMusicPromptSeen() {
  try {
    window.sessionStorage.setItem(MUSIC_PROMPT_KEY, 'true')
  } catch {
    /* storage unavailable — the prompt can show again next visit */
  }
}

function isMobileViewport() {
  try {
    return window.matchMedia(MOBILE_QUERY).matches
  } catch {
    return false
  }
}

const DiwaliMusicContext = createContext(null)

export function DiwaliMusicProvider({ children }) {
  const { pathname } = useLocation()
  const diwaliActive = useDiwaliCampaign()
  const audioRef = useRef(null)
  const [wantsMusic, setWantsMusic] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [isMobile, setIsMobile] = useState(isMobileViewport)
  const [promptSeen, setPromptSeen] = useState(readMusicPromptSeen)
  const [promptOpen, setPromptOpen] = useState(false)
  const [promptError, setPromptError] = useState('')
  const allowed = diwaliActive && isMusicRoute(pathname)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.volume = MUSIC_VOLUME

    const handlePlay = () => {
      setIsPlaying(true)
      setAutoplayBlocked(false)
      markMusicPromptSeen()
      setPromptSeen(true)
    }
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.pause()
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  const startPlayback = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !allowed) return

    const playback = audio.play()

    if (playback && typeof playback.catch === 'function') {
      playback.catch((error) => {
        if (error?.name === 'NotAllowedError') {
          setAutoplayBlocked(true)
        }
      })
    }
  }, [allowed])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !allowed) return false

    setWantsMusic(true)

    try {
      await audio.play()
      setAutoplayBlocked(false)
      return true
    } catch (error) {
      if (error?.name === 'NotAllowedError') {
        setAutoplayBlocked(true)
      }
      return false
    }
  }, [allowed])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!allowed || !wantsMusic) {
      audio.pause()
      return
    }

    if (!audio.paused) return

    startPlayback()
  }, [allowed, wantsMusic, startPlayback])

  useEffect(() => {
    if (!window.matchMedia) return undefined

    const query = window.matchMedia(MOBILE_QUERY)
    const sync = (event) => setIsMobile(event.matches)

    if (query.addEventListener) query.addEventListener('change', sync)
    else if (query.addListener) query.addListener(sync)

    return () => {
      if (query.removeEventListener) query.removeEventListener('change', sync)
      else if (query.removeListener) query.removeListener(sync)
    }
  }, [])

  useEffect(() => {
    if (!allowed || !isMobile || promptSeen || isPlaying) {
      setPromptOpen(false)
      return undefined
    }

    setPromptError('')
    const timer = window.setTimeout(() => setPromptOpen(true), 650)

    return () => window.clearTimeout(timer)
  }, [allowed, isMobile, isPlaying, pathname, promptSeen])

  useEffect(() => {
    if (!autoplayBlocked || !allowed || !wantsMusic || promptOpen) return undefined

    const unlockAudio = () => startPlayback()
    const events = ['pointerdown', 'keydown', 'touchstart']

    events.forEach((event) => {
      document.addEventListener(event, unlockAudio, { once: true, passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, unlockAudio)
      })
    }
  }, [autoplayBlocked, allowed, promptOpen, wantsMusic, startPlayback])

  useEffect(() => {
    const stopPlayback = () => {
      audioRef.current?.pause()
    }

    window.addEventListener('pagehide', stopPlayback)
    window.addEventListener('beforeunload', stopPlayback)

    return () => {
      window.removeEventListener('pagehide', stopPlayback)
      window.removeEventListener('beforeunload', stopPlayback)
    }
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      await play()
      return
    }

    setWantsMusic(false)
    audio.pause()
  }, [play])

  const dismissPrompt = useCallback(() => {
    markMusicPromptSeen()
    setPromptSeen(true)
    setPromptOpen(false)
    setPromptError('')
    setWantsMusic(false)
    audioRef.current?.pause()
  }, [])

  const handlePromptPlay = useCallback(async () => {
    setPromptError('')
    const started = await play()

    if (!started) {
      setPromptError('Music could not start. Tap play to try again.')
      return
    }

    markMusicPromptSeen()
    setPromptSeen(true)
    setPromptOpen(false)
  }, [play])

  const value = useMemo(
    () => ({
      isPlaying,
      autoplayBlocked,
      canControl: allowed,
      toggle,
    }),
    [isPlaying, autoplayBlocked, allowed, toggle]
  )

  return (
    <DiwaliMusicContext.Provider value={value}>
      {children}

      {promptOpen && (
        <DiwaliMusicPrompt
          error={promptError}
          onDismiss={dismissPrompt}
          onPlay={handlePromptPlay}
        />
      )}

      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="auto"
        aria-hidden="true"
        hidden
      />
    </DiwaliMusicContext.Provider>
  )
}

function DiwaliMusicPrompt({ error, onDismiss, onPlay }) {
  const cardRef = useRef(null)
  const playRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousBodyOverflow = document.body.style.overflow
    const previousDocOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.dataset.diwaliMusicPrompt = 'true'

    const focusTimer = window.setTimeout(() => {
      playRef.current?.focus()
    }, 80)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onDismiss()
        return
      }

      if (event.key !== 'Tab') return

      const card = cardRef.current
      if (!card) return

      const items = Array.from(
        card.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
      ).filter((item) => !item.hasAttribute('disabled'))

      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown, true)
      delete document.documentElement.dataset.diwaliMusicPrompt
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onDismiss])

  return (
    <div
      className="diwali-music-prompt"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diwali-music-prompt-title"
      aria-describedby="diwali-music-prompt-description"
    >
      <div className="diwali-music-prompt__backdrop" onClick={onDismiss} />

      <div className="diwali-music-prompt__card" ref={cardRef}>
        <div className="diwali-music-prompt__visual" aria-hidden="true">
          <span className="diwali-music-prompt__halo" />
          <span className="diwali-music-prompt__diya">
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M8 37.5h48c-3.7 10.2-12.2 15.5-24 15.5S11.7 47.7 8 37.5Z"
                fill="url(#diwaliPromptBowl)"
                stroke="rgba(255,226,164,0.5)"
                strokeWidth="1.3"
              />
              <path
                d="M15 37.5c4.5 2.1 10.2 3.2 17 3.2s12.5-1.1 17-3.2"
                stroke="rgba(255,236,192,0.65)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M32 12c5.4 5.2 8 9 8 12.4A8 8 0 0 1 32 32a8 8 0 0 1-8-7.6C24 21 26.6 17.2 32 12Z"
                fill="url(#diwaliPromptFlame)"
              />
              <path
                d="M32 19c2.5 2.9 3.5 4.8 3.5 6.4A3.5 3.5 0 0 1 32 29a3.5 3.5 0 0 1-3.5-3.6c0-1.6 1-3.5 3.5-6.4Z"
                fill="#fff6d8"
              />
              <rect x="31" y="32" width="2" height="6" rx="1" fill="#3d2414" />
              <defs>
                <linearGradient id="diwaliPromptBowl" x1="8" y1="38" x2="56" y2="52" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#b75b22" />
                  <stop offset="0.5" stopColor="#f2a13d" />
                  <stop offset="1" stopColor="#8d411c" />
                </linearGradient>
                <linearGradient id="diwaliPromptFlame" x1="32" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fff3c4" />
                  <stop offset="0.45" stopColor="#ffc24a" />
                  <stop offset="1" stopColor="#ff7a28" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="diwali-music-prompt__note diwali-music-prompt__note--1">&#9835;</span>
          <span className="diwali-music-prompt__note diwali-music-prompt__note--2">&#9834;</span>
          <span className="diwali-music-prompt__note diwali-music-prompt__note--3">&#9835;</span>
        </div>

        <p className="diwali-music-prompt__eyebrow">
          AADI HUB &middot; FESTIVE EDITION 2026
        </p>
        <h2 className="diwali-music-prompt__title" id="diwali-music-prompt-title">
          Let the diyas sing.
        </h2>
        <p
          className="diwali-music-prompt__description"
          id="diwali-music-prompt-description"
        >
          Tap play to start the Diwali soundtrack and step into the celebration.
        </p>

        <div className="diwali-music-prompt__actions">
          <button
            type="button"
            ref={playRef}
            className="diwali-music-prompt__play"
            onClick={onPlay}
          >
            <span className="diwali-music-prompt__play-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.6v12.8c0 .8.9 1.3 1.6.9l9.2-6.4a1 1 0 0 0 0-1.7L9.6 4.7C8.9 4.3 8 4.8 8 5.6Z" />
              </svg>
            </span>
            Play Music
          </button>

          <button
            type="button"
            className="diwali-music-prompt__skip"
            onClick={onDismiss}
          >
            Not now
          </button>
        </div>

        {error && (
          <p className="diwali-music-prompt__error" role="status" aria-live="polite">
            {error}
          </p>
        )}

        <p className="diwali-music-prompt__foot">
          Your browser needs one tap before it can play sound.
        </p>
      </div>
    </div>
  )
}

export function DiwaliMusicButton({
  className = '',
  showLabel = true,
  ...buttonProps
}) {
  const music = useContext(DiwaliMusicContext)

  if (!music) return null

  const { isPlaying, autoplayBlocked, canControl, toggle } = music
  const label = isPlaying
    ? 'Turn off Diwali music'
    : autoplayBlocked
      ? 'Start Diwali music'
      : 'Play Diwali music'

  return (
    <button
      {...buttonProps}
      className={`diwali-music-btn${isPlaying ? ' is-playing' : ''}${className ? ` ${className}` : ''}`}
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isPlaying}
      title={label}
      disabled={!canControl}
    >
      <span className="diwali-music-btn__icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18V6.8l9-1.8v10.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="15.5" cy="15.4" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>

      <span className="diwali-music-btn__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>

      {showLabel && (
        <span className="diwali-music-btn__label">
          {isPlaying ? 'Music On' : autoplayBlocked ? 'Play Music' : 'Music Off'}
        </span>
      )}
    </button>
  )
}
